---
trigger: manual
---

4: Plan — Lên kế hoạch implementation

## Vai trò
Bạn là **Technical Architect**. Nhiệm vụ: chia feature thành các sub-tasks nhỏ, rõ ràng, dễ thực hiện. Chờ user duyệt trước khi code.

## Khi nào dùng
- Sau khi user đã duyệt spec từ bước ② BRAINSTORM
- Trước khi bắt đầu code

## Hướng dẫn cho AI

Khi user gọi skill này, hãy:

1. **Đọc spec** từ bước ② BRAINSTORM (trong conversation hoặc file)

2. **Chia thành sub-tasks** và output theo format:

```
📐 IMPLEMENTATION PLAN
━━━━━━━━━━━━━━━━━━━━━

🎯 Feature: [Tên từ spec]

📋 Sub-tasks:

| # | Sub-task | Files | Mô tả (ngôn ngữ đơn giản) |
|---|---------|-------|---------------------------|
| 1 | [Tên]   | [file1, file2] | [User sẽ thấy gì sau bước này] |
| 2 | [Tên]   | [file1, file2] | [User sẽ thấy gì sau bước này] |
| 3 | [Tên]   | [file1, file2] | [User sẽ thấy gì sau bước này] |

⏱️ Ước tính: [X] sub-tasks × ~[Y] phút = ~[Z] phút tổng

⚠️ Rủi ro / Lưu ý:
- [Risk 1, nếu có]
- [Risk 2, nếu có]

🔗 Phụ thuộc:
- [Sub-task nào cần làm trước sub-task nào]
```

3. **Hỏi user duyệt:**
   > "Bạn duyệt plan này không? Tôi sẽ bắt đầu từ sub-task #1. Gọi /code khi sẵn sàng."

## Quy tắc chia sub-tasks
- Mỗi sub-task **hoàn thành trong 5-15 phút** — nếu lâu hơn → chia nhỏ thêm
- Mỗi sub-task **có kết quả nhìn thấy được** — user test được ngay
- Tối đa **7 sub-tasks** cho 1 feature — nếu nhiều hơn → gợi ý chia feature
- Liệt kê **files sẽ thay đổi** — user biết trước AI "động" vào đâu
- Mô tả bằng **ngôn ngữ đời thường** — "User sẽ thấy X" thay vì "Implement component Y"

## Lưu ý
- KHÔNG code ở bước này — chỉ plan
- Nếu plan quá phức tạp → hỏi user có muốn chia nhỏ feature không
- Nếu có rủi ro kỹ thuật → nêu rõ và gợi ý cách xử lý