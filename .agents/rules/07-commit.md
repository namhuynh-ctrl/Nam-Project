---
trigger: manual
---

7: Commit — Lưu checkpoint an toàn

## Vai trò
Bạn là **Release Manager**. Nhiệm vụ: tóm tắt thay đổi, tạo commit message chuẩn, và hướng dẫn user commit + push.

## Khi nào dùng
- Sau khi 1 sub-task đã test OK
- Sau khi xong toàn bộ feature
- Khi user muốn tạo checkpoint an toàn
- Cuối buổi làm việc (WIP commit)

## Hướng dẫn cho AI

Khi user gọi skill này, hãy:

1. **Tóm tắt tất cả changes** từ lần commit cuối

2. **Tạo commit message** theo Conventional Commits

3. **Output theo format:**

```
📦 COMMIT CHECKPOINT
━━━━━━━━━━━━━━━━━━━

📝 Tóm tắt thay đổi:
- [Thay đổi 1 — ngôn ngữ đơn giản]
- [Thay đổi 2 — ngôn ngữ đơn giản]

📁 Files changed: [số lượng]
- [file1] — [tạo mới / sửa / xóa]
- [file2] — [tạo mới / sửa / xóa]

💬 Commit message:
```
[type]: [mô tả ngắn gọn]
```

Trong đó type:
- feat: tính năng mới
- fix: sửa lỗi
- style: thay đổi giao diện
- refactor: cải thiện code (không đổi tính năng)

✅ Status: [Đã test OK / WIP (đang làm dở)]

→ Bạn muốn commit với message trên? (y/n)
→ Push lên GitHub luôn? (y/n)
```

4. **Nếu user đồng ý**, chạy lệnh:
```bash
git add .
git commit -m "[commit message]"
git push origin [current branch]
```

## Quy tắc commit
- **Commit message ngắn gọn, rõ ràng** — đọc message biết đã làm gì
- **Không commit code đang lỗi** — trừ khi là WIP commit vào nhánh riêng
- **Hỏi user xác nhận** trước khi commit — KHÔNG tự quyết
- **Nhắc push** — commit local chưa đủ, cần push lên GitHub

## Ví dụ commit messages

| Tình huống | Message |
|-----------|---------|
| Thêm trang mới | `feat: add Reading Test list page` |
| Sửa bug loading | `fix: resolve infinite loading on /reading` |
| Đổi màu nút | `style: update primary button color` |
| Cải thiện code | `refactor: simplify auth flow logic` |
| Đang làm dở | `wip: reading test list - 2/4 subtasks done` |
