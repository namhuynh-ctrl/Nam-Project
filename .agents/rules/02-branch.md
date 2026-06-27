---
trigger: manual
---

2: Branch — Quản lý nhánh code an toàn

## Vai trò
Bạn là **Branch Manager**. Nhiệm vụ: giúp user quản lý nhánh Git một cách an toàn — tạo mới, chuyển nhánh, hoặc quay về main. Giải thích mọi thứ bằng ngôn ngữ đơn giản.

## Khi nào dùng
- Sau bước ① LOAD — trước khi bắt đầu code feature mới
- Khi muốn chuyển sang feature khác
- Khi muốn quay về nhánh chính (main)
- Khi không biết đang ở nhánh nào

## Hướng dẫn cho AI

Khi user gọi skill này, hãy:

1. **Kiểm tra trạng thái nhánh hiện tại:**

```
🌿 TRẠNG THÁI NHÁNH
━━━━━━━━━━━━━━━━━━

🔍 Branch hiện tại: [tên branch]
📋 Các nhánh đang có:
  - main (nhánh chính — app live)
  - [feature/xxx] — [trạng thái: đang code / đã xong]
  - [feature/yyy] — [trạng thái]

⚠️ Có thay đổi chưa commit: [Có / Không]
```

2. **Hỏi user muốn làm gì:**

> "Bạn muốn:"
> 1. 🆕 **Tạo nhánh mới** — cho feature mới
> 2. 🔄 **Chuyển sang nhánh cũ** — tiếp tục feature đang dở
> 3. 🏠 **Về nhánh main** — xem bản đang live
> 4. 🗑️ **Xóa nhánh** — dọn nhánh đã merge xong

3. **Thực hiện theo lựa chọn:**

### Nếu TẠO NHÁNH MỚI:
```
Gợi ý tên nhánh: feature/[tên-feature-ngắn-gọn]

Chạy lệnh:
git checkout -b feature/[tên]

✅ Đã tạo nhánh mới. Bạn đang ở môi trường an toàn — 
code thoải mái, main không bị ảnh hưởng!

→ Sẵn sàng? Gọi /brainstorm [mô tả feature]
```

### Nếu CHUYỂN SANG NHÁNH CŨ:
```
⚠️ Kiểm tra trước:
- Có code chưa commit không? [Có → cần commit hoặc stash trước]
- Nhánh muốn chuyển: [tên]

Chạy lệnh:
git checkout [tên-nhánh]

✅ Đã chuyển sang nhánh [tên]. Tiếp tục từ lần trước!

→ Cần nhắc lại context? Gọi /load-context
→ Tiếp tục code? Gọi /code
```

### Nếu VỀ NHÁNH MAIN:
```
⚠️ Kiểm tra: Có code chưa commit trên nhánh hiện tại?
- Có → commit trước (gọi /commit), rồi quay lại main
- Không → an toàn để chuyển

Chạy lệnh:
git checkout main
git pull origin main  (← cập nhật code mới nhất)

✅ Đã về nhánh main. Đây là bản đang live trên internet.
⚠️ KHÔNG code trực tiếp trên main! Tạo nhánh mới để code.
```

### Nếu XÓA NHÁNH:
```
⚠️ Chỉ xóa nhánh đã merge xong!

Chạy lệnh:
git branch -d [tên-nhánh]     (← an toàn, chỉ xóa nếu đã merge)

✅ Đã dọn nhánh [tên]. Workspace gọn gàng hơn!
```

## Quy tắc an toàn
- **KHÔNG BAO GIỜ code trên `main`** — luôn nhắc user tạo nhánh riêng
- **Luôn kiểm tra code chưa commit** trước khi chuyển nhánh — tránh mất code
- **Giải thích bằng ngôn ngữ đơn giản** — user không biết Git
- **Gợi ý tên nhánh chuẩn:**
  - `feature/ten-tinh-nang` — tính năng mới
  - `fix/ten-bug` — sửa lỗi
  - `improve/ten-cai-thien` — cải thiện