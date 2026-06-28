import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface GenerateQuizRequest {
  fileBase64?: string;
  mimeType?: string;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as GenerateQuizRequest;
    const { fileBase64, mimeType } = body;

    if (!fileBase64 || !mimeType) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu fileBase64 hoặc mimeType." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chưa cấu hình GEMINI_API_KEY trong hệ thống." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Use gemini-flash-latest as the user's API key is on the newer model tier
    const primaryModel = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
Bạn là một chuyên gia giáo dục xuất sắc. Nhiệm vụ của bạn là đọc nội dung của tài liệu được cung cấp và trích xuất/tạo ra một bộ câu hỏi trắc nghiệm khách quan để kiểm tra kiến thức của học viên.

YÊU CẦU ĐẦU RA (OUTPUT FORMAT):
Bạn BẮT BUỘC phải trả về kết quả dưới định dạng JSON thuần túy, tuyệt đối KHÔNG bọc trong markdown code block (không dùng \`\`\`json).
Cấu trúc JSON phải tuân thủ chính xác Schema sau:
{
  "questions": [
    {
      "content": "Nội dung câu hỏi (ví dụ: Thủ đô của Việt Nam là gì?)",
      "type": "multiple_choice",
      "points": 10,
      "answers": [
        { "content": "Hà Nội", "is_correct": true },
        { "content": "TP Hồ Chí Minh", "is_correct": false },
        { "content": "Đà Nẵng", "is_correct": false },
        { "content": "Huế", "is_correct": false }
      ]
    }
  ]
}

QUY TẮC TẠO CÂU HỎI:
1. Số lượng: Bắt buộc trích xuất và tạo TẤT CẢ các câu hỏi có trong tài liệu. Không được giới hạn số lượng.
2. Kiểu câu hỏi (type): Bạn có thể tạo "multiple_choice" (Trắc nghiệm 4 đáp án) hoặc "true_false" (Đúng/Sai gồm 2 đáp án).
3. Điểm số (points): Luôn để là 10.
4. Độ dài: Giữ nguyên nội dung gốc của câu hỏi và đáp án từ tài liệu nếu có.
5. Tính chính xác: Đảm bảo có đúng 1 đáp án đúng (is_correct: true) cho mỗi câu hỏi. Dựa vào Answer key trong tài liệu nếu có.
`;

    let result;
    const retries = 3;
    let delay = 3000;

    // Thử lại nếu gặp lỗi 503 (High demand)
    for (let i = 0; i <= retries; i++) {
      try {
        // Nếu là lần thử cuối cùng, dùng model dự phòng (pro)
        const currentModel = (i === retries) ? fallbackModel : primaryModel;

        result = await currentModel.generateContent([
          prompt,
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType,
            },
          },
        ]);
        break; // Thành công thì thoát vòng lặp
      } catch (e: unknown) {
        const message = getErrorMessage(e);
        if (i === retries || (!message.includes("503") && !message.includes("429"))) {
          throw e; // Ném lỗi ra catch tổng nếu hết lượt hoặc không phải lỗi quá tải
        }
        console.warn(`Gemini API bị quá tải (lần ${i + 1}). Đang thử lại sau ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay += 3000; // Tăng dần thời gian chờ: 3s -> 6s -> 9s
      }
    }

    if (!result) {
      throw new Error("Không thể khởi tạo nội dung từ AI.");
    }

    const responseText = result.response.text();

    // Clean up potential markdown formatting if the model still outputs it
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.slice(7);
    }
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.slice(3);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.slice(0, -3);
    }

    cleanJson = cleanJson.trim();

    try {
      const parsedData = JSON.parse(cleanJson);
      return NextResponse.json({ success: true, data: parsedData });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Raw LLM Output:", responseText);
      return NextResponse.json(
        { error: "AI trả về định dạng dữ liệu không hợp lệ. Vui lòng thử lại." },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("Gemini API Error:", error);

    const errorMsg = getErrorMessage(error);
    let userFriendlyError = `Lỗi AI: ${errorMsg}`;

    if (errorMsg.includes("503") || errorMsg.includes("high demand")) {
      userFriendlyError = "Hệ thống AI đang quá tải do nhu cầu cao. Vui lòng chờ vài giây rồi thử lại!";
    } else if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      userFriendlyError = "Đã vượt quá giới hạn gọi AI (Rate limit). Vui lòng chờ 1 phút rồi thử lại!";
    } else if (errorMsg.includes("key")) {
      userFriendlyError = "Lỗi xác thực API Key. Vui lòng kiểm tra lại cấu hình.";
    }

    return NextResponse.json(
      { error: userFriendlyError, rawError: errorMsg },
      { status: 500 }
    );
  }
}
