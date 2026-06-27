---
trigger: manual
---

1: Load Context - Nạp ngữ cảnh dự án

## Vai trò
Bạn là **Project Analyst**. Nhiệm vụ: đọc hiểu toàn bộ trạng thái dự án và tóm tắt ngắn gọn để user biết mình đang ở đâu, làm gì tiếp.

## Khi nào dùng
- Bắt đầu phiên làm việc mới
- Chuyển sang feature mới
- Sau khi nghỉ dài (hôm sau, tuần sau)

## Hướng dẫn cho AI

Khi user gọi skill này, hãy:

1. **Đọc các file context** theo thứ tự ưu tiên:

| Ưu tiên | File | Đọc để biết gì? |
|---------|------|----------------|
| 🔴 Bắt buộc | `planning.md` | Tiến độ, features đang làm, next steps |
| 🔴 Bắt buộc | `system-design.md` | Kiến trúc, decisions đã chốt, approach đang dùng |
| 🟡 Nếu có | `schema.md` | Cấu trúc database, bảng, column, RLS |
| 🟡 Nếu có | `api-routes.md` | Route FE, API endpoint, external services |
| 🟡 Nếu có | `bugs.md` | Bug đang tồn đọng, cần tránh làm trầm trọng thêm |
| 🟢 Tùy chọn | `CHANGELOG.md` | Thay đổi gần đây |

2. **Tóm tắt theo format:**

```
🗂️ TRẠNG THÁI DỰ ÁN
══════════════════

📌 Project: [Tên dự án]
🛠️ Tech Stack: [stack — VD: Next.js + Supabase + Vercel]
🌿 Branch hiện tại: [tên branch, nếu biết]

✅ Đã hoàn thành:
- [Feature 1]
- [Feature 2]

🔧 Đang làm dở:
- [Feature đang code] — trạng thái: [mô tả cụ thể]

📅 Chưa làm (theo planning):
- [Feature tiếp theo]
- [Feature sau nữa]

🗄️ Database: [tóm tắt ngắn — VD: "4 bảng: users, posts, comments, tags. RLS đã bật."]

🐛 Bug tồn đọng: [nếu có — VD: "logout không xóa cookie" / "Không có"]

💡 Gợi ý tiếp tục:
→ [Bước tiếp theo cụ thể]

⚠️ Lưu ý quan trọng:
- [Decisions đã thống nhất, không được thay đổi]
- [Convention cần tuân theo]
```

3. **Hỏi user xác nhận:**
   > "Context đã nạp. Bạn muốn làm gì tiếp? Gọi /branch để tạo/chuyển nhánh, hoặc /brainstorm [mô tả] nếu đã ở đúng nhánh."

## Lưu ý
- Nếu **không tìm thấy `planning.md`** → hỏi user mô tả trạng thái dự án bằng lời
- Nếu **project mới hoàn toàn** → báo user chưa có context, chuyển sang 🌿 BRANCH → 💡 BRAINSTORM
- Nếu **có `bugs.md`** → luôn đọc trước khi code để không vô tình tạo lại bug cũ
- Giữ tóm tắt **ngắn gọn, dễ scan** — tối đa 25 dòng
