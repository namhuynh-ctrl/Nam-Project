---
trigger: manual
---

8: Save - Lưu kiến thức & context

## Vai trò
Bạn là **Project Documentor**. Nhiệm vụ: cập nhật tài liệu dự án để AI phiên sau đọc lại và tiếp tục mượt mà.

## Khi nào dùng
- Cuối mỗi phiên làm việc
- Sau khi xong 1 feature lớn
- Khi chuyển sang feature khác
- Trước khi nghỉ dài (hôm sau, tuần sau)

## Hướng dẫn cho AI

Khi user gọi skill này, hãy:

1. **Tóm tắt phiên làm việc** - đã làm gì, quyết định gì, còn gì chưa xong

2. **Cập nhật các file tài liệu** theo danh sách dưới

3. **Output theo format:**

```
📦 CONTEXT ĐÃ LƯU
═════════════════

📋 planning.md - Đã cập nhật:
- ✅ [Feature X] - hoàn thành
- 🔧 [Feature Y] - đang làm, còn sub-task #3, #4
- 👉 Next: [Feature Z]

🏗️ system-design.md - Đã cập nhật:
- [Quyết định kiến trúc mới, nếu có]
- [Component/table mới được thêm]

🗄️ schema.md - Đã cập nhật:
- [Bảng/column mới nếu có thay đổi DB trong phiên này]
- (Bỏ qua nếu không có thay đổi DB)

🔌 api-routes.md - Đã cập nhật:
- [Route mới đã tạo trong phiên này]
- (Bỏ qua nếu không thêm route mới)

🐛 bugs.md - Đã cập nhật:
- [Bug mới phát hiện / Bug đã fix trong phiên này]
- (Bỏ qua nếu không có bug mới)

💡 Gợi ý cho phiên tiếp theo:
→ [Bước tiếp theo cụ thể]
→ [Lưu ý quan trọng cần nhớ]
```

## Cập nhật những file nào?

| File | Cập nhật gì | Khi nào |
|------|------------|---------|
| `planning.md` | Tiến độ features, next steps, notes | **Luôn luôn** |
| `system-design.md` | Kiến trúc, quyết định kỹ thuật, approach đã chọn | Khi có thay đổi kiến trúc |
| `schema.md` | Danh sách bảng, column, quan hệ FK, RLS policies | Khi thêm/sửa bảng DB |
| `api-routes.md` | Route FE, API endpoint, external services đang dùng | Khi thêm route/API mới |
| `bugs.md` | Bug phát hiện, bug đã fix, known issues | Khi phát hiện hoặc fix bug |
| `CHANGELOG.md` | Lịch sử thay đổi theo ngày | Sau feature lớn hoặc cuối ngày |

## Quy tắc save
- **Luôn cập nhật `planning.md`** - đây là file quan trọng nhất
- **Ghi RÕ next steps** - phiên sau đọc lại biết bắt đầu từ đâu
- **Ghi lại DECISIONS** - tại sao chọn approach A thay vì B
- **Ngắn gọn, dễ scan** - AI phiên sau đọc nhanh, không cần đọc hết

## Template planning.md (gợi ý)

```markdown
# 📋 Planning - [Tên dự án]

## Tiến độ
- [x] Auth (login, register, Google OAuth)
- [x] Database schema + RLS
- [x] Reading Test List page
- [ ] Reading Test Detail page ← **ĐANG LÀM**
- [ ] Writing module
- [ ] Dashboard

## Phiên gần nhất: [Ngày]
- Đã xong: [mô tả]
- Đang dở: [mô tả + sub-task nào còn lại]
- Next: [bước tiếp]

## Decisions
- [Ngày]: Dùng Supabase RLS thay vì API middleware cho phân quyền
- [Ngày]: Reading test dùng pagination thay vì infinite scroll

## Notes
- [Lưu ý quan trọng]
```

## Template schema.md (gợi ý)

```markdown
# 🗄️ Database Schema - [Tên dự án]

## Table: users
| Column | Type | Ghi chú |
|--------|------|---------|
| id | uuid | PK, auto-gen |
| email | text | unique |
| full_name | text | |
| created_at | timestamp | default now() |

## Table: posts
| Column | Type | Ghi chú |
|--------|------|---------|
| id | uuid | PK |
| user_id | uuid | FK → users.id |
| title | text | |
| content | text | |
| created_at | timestamp | |

## RLS Policies
- users: chỉ đọc/ghi được row của chính mình (user_id = auth.uid())
- posts: public read, chỉ owner được write
```

## Template api-routes.md (gợi ý)

```markdown
# 🔌 API Routes & Services - [Tên dự án]

## Pages / Routes FE
- `/` → Landing page (public)
- `/dashboard` → protected, cần auth
- `/reading` → Reading test list (public)
- `/reading/[id]` → Chi tiết bài (chưa làm)

## API Endpoints (Next.js / Supabase)
- `GET /api/posts` → lấy danh sách (có RLS)
- `POST /api/posts` → tạo mới (cần auth)
- `DELETE /api/posts/[id]` → chưa có

## External Services đang dùng
- **Supabase** — Database + Auth
- **Vercel** — Hosting + CI/CD
- (chưa có email, payment)
```

## Template bugs.md (gợi ý)

```markdown
# 🐛 Bugs & Known Issues - [Tên dự án]

## 🔴 Critical (chưa fix)
- [ ] User logout không xóa cookie → refresh vẫn còn login

## 🟡 Medium (chưa fix)
- [ ] Trang /reading load chậm (>3s) khi data > 100 rows
- [ ] Mobile: button bị che bởi keyboard khi nhập form

## ✅ Đã fix
- [x] Login redirect loop — fixed buổi 6, sprint 2
- [x] RLS chặn nhầm admin — fixed 15/04
```
