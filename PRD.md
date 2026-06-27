# **PRODUCT REQUIREMENTS DOCUMENT (PRD)**

**Tên sản phẩm:** Wayground Quiz Maker Module

**Nền tảng phát triển:** Next.js (Vercel) \+ Supabase \+ Google Gemini API

**Trạng thái:** Phiên bản nâng cấp (AI-Powered & Frictionless)

## **1\. Tổng quan sản phẩm**

* **Vấn đề (Problem):**  
  * Soạn đề trắc nghiệm thủ công từ tài liệu có sẵn (PDF, sách bài tập) tốn quá nhiều thời gian.  
  * Người tham gia ngại làm bài nếu phải đăng ký tài khoản hoặc khai báo quá nhiều thông tin cá nhân.  
* **Giải pháp (Solution):**  
  * Tích hợp **AI Gemini** để chuyển đổi file tài liệu thành bộ câu hỏi trong vài giây.  
  * Luồng tham gia tối giản: Không cần Email/SĐT, **chỉ nhập Tên hiển thị** là có thể bắt đầu ngay.  
* **Đối tượng sử dụng:**  
  * **Creator:** Giáo viên, Giảng viên, HR, Marketer.  
  * **Participant:** Học viên, ứng viên, khách mời tham gia sự kiện.

    ## **2\. Personas (Người dùng điển hình)**

    ### **2.1 Cô Lan – Giáo viên (Creator)**

* **Nhu cầu:** Có một tệp PDF đề thi cũ hoặc ảnh chụp sách bài tập, muốn biến thành quiz online nhanh để học sinh làm bài trên lớp.  
* **Kỳ vọng:** Upload file lên, AI tự nhận diện câu hỏi/đáp án. Cô chỉ cần duyệt lại và gửi link cho học sinh.

  ### **2.2 Minh – Học viên (Participant)**

* **Nhu cầu:** Làm bài tập nhanh trên điện thoại do cô gửi qua Zalo/Facebook.  
* **Pain-point:** Ngại điền Form dài dòng, nút bấm trên web mobile hay bị nhỏ, khó thao tác.  
* **Kỳ vọng:** Click link, nhập "Minh" (2-20 ký tự) là vào thi luôn. Giao diện mượt, đếm ngược rõ ràng.

  ## **3\. User Flows (Luồng người dùng)**

  ### **3.1 Luồng Creator: Soạn đề bằng AI (Gemini)**

1. **Bắt đầu:** Tại Dashboard, chọn Create with AI.  
2. **Tải tài liệu:** Upload file PDF, DOCX hoặc Ảnh chụp đề thi (Tối đa 50MB).  
3. **Xử lý:** Hệ thống gửi file sang **Gemini 1.5 Flash**. AI trả về danh sách câu hỏi dưới dạng JSON.  
4. **Kiểm tra (Review):** Creator chỉnh sửa nội dung, điểm số hoặc xóa các câu AI nhận diện sai.  
5. **Xuất bản:** Nhấn Publish để lấy Short-link hoặc Mã Quiz.

   ### **3.2 Luồng Participant: Tham gia "Zero Friction"**

1. **Truy cập:** Quét QR hoặc Click Link.  
2. **Nhập tên:** Màn hình yêu cầu: *"Nhập tên của bạn để bắt đầu"* (Giới hạn 2-20 ký tự).  
3. **Làm bài:** Vào giao diện Player, đếm ngược thời gian bắt đầu. Đáp án được lưu real-time.  
4. **Kết quả:** Xem điểm số kèm tên đã nhập ngay khi nộp bài.

   ## **4\. Danh sách tính năng chi tiết**

   ### **Giai đoạn 1: MVP (Ưu tiên cao 🔴)**

| Tính năng | Mô tả chi tiết |
| :---- | :---- |
| **Quản lý Dashboard** | Creator tạo, sửa, xóa Quiz. Quản lý trạng thái Draft/Published. |
| **Manual Builder** | Trình soạn thảo thủ công (Trắc nghiệm, Đúng/Sai). |
| **Join by Name** | Participant chỉ nhập tên (2-20 chars). Hệ thống chặn tên quá ngắn/dài hoặc chỉ có khoảng trắng. |
| **Mobile Player** | Giao diện làm bài tối ưu di động, đồng hồ đếm ngược, thanh tiến trình. |
| **Auto-Submit** | Tự động nộp bài khi hết giờ (Timer \= 0). |

   ### **Giai đoạn 2: V1.1 (Ưu tiên trung bình \- AI & Data 🟡)**

| Tính năng | Mô tả chi tiết |
| :---- | :---- |
| **AI Gemini Converter** | Upload PDF/Docx/Ảnh. **Gemini 1.5** tự trích xuất nội dung thành Quiz JSON. |
| **Review Editor** | Giao diện chỉnh sửa nhanh các câu hỏi sau khi AI trích xuất xong. |
| **Analytics** | Dashboard xem danh sách người tham gia (Tên), điểm số, tỷ lệ đúng/sai từng câu. |
| **Export Excel** | Xuất báo cáo kết quả ra file Excel (Cột: Tên người chơi, Điểm, Thời gian). |
| **Offline Sync** | Lưu đáp án vào LocalStorage, tự động Retry gửi lên Supabase khi mạng ổn định lại. |

   ## **5\. Yêu cầu phi chức năng (NFRs)**

* **Tốc độ:** Trang Player phải tải dưới **1.5s**. AI Gemini phản hồi kết quả trích xuất file dưới **10s**.  
* **Tải trọng:** Hệ thống chịu tải **10.000 CCU** nhờ Supabase Supavisor (Connection Pooling).  
* **Bảo mật:**  
  * Sử dụng **Supabase RLS**: Người chơi (Participant) không thể xem đáp án đúng (is\_correct) từ API.  
  * Chấm điểm 100% tại Backend (Edge Functions).  
  * Vô hiệu hóa Copy-Paste và Right-click trên màn hình làm bài.

    ## **6\. Phụ lục kỹ thuật (AI & Security)**

    ### **6.1 Logic AI Gemini (Gemini 1.5 Flash/Pro)**

* **Cấu hình:** Sử dụng responseMimeType: "application/json".  
* **Prompt System:** *"Bạn là chuyên gia giáo dục. Hãy đọc tài liệu này và trích xuất các câu hỏi trắc nghiệm dưới dạng JSON. Nếu không thấy đáp án đúng trong file, hãy tự suy luận dựa trên kiến thức của bạn."*  
* **Xử lý file:** File được đẩy lên Supabase Storage tạm thời $\\rightarrow$ Chuyển sang Gemini API $\\rightarrow$ Xóa file ngay sau khi xử lý xong để bảo mật.

  ### **6.2 Cấu trúc Database (Supabase)**

* **Bảng sessions:**  
  * id: UUID (PK)  
  * display\_name: VARCHAR(20) \- *Tên học viên*  
  * quiz\_id: FK  
  * started\_at: Timestamp  
  * total\_score: Integer  
* **Bảng responses:** Lưu chi tiết câu trả lời của từng phiên (session\_id).

  ### **6.3 Quy tắc Validate Tên (Display Name)**

* **Frontend:** Input maxLength=20, minLength=2. Nút "Bắt đầu" bị disable nếu không hợp lệ.  
* **Backend:** display\_name trong Postgres được set là VARCHAR(20) NOT NULL. Tự động TRIM (xóa khoảng trắng) trước khi lưu.