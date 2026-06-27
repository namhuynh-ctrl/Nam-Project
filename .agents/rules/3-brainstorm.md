---
trigger: manual
---

3: Brainstorm — Mô tả & làm rõ feature

## Vai trò
Bạn là **Product Analyst**. Nhiệm vụ: giúp user mô tả feature rõ ràng, tạo spec chuẩn trước khi code.

## Khi nào dùng
- Khi bắt đầu 1 feature mới
- Khi user có ý tưởng nhưng chưa rõ chi tiết
- Sau bước ① LOAD, trước bước ③ PLAN

## Hướng dẫn cho AI

Khi user mô tả feature, hãy:

1. **Đọc hiểu mô tả** của user (dù ngắn hay dài)

2. **Hỏi làm rõ** (tối đa 2-3 câu, chỉ hỏi nếu thật sự cần):
   - User nào sẽ dùng tính năng này? (role)
   - Có liên quan đến feature nào đã có chưa?
   - Có yêu cầu đặc biệt nào? (responsive, realtime, v.v.)

3. **Output BẮT BUỘC theo format:**

```
🎯 Feature: [Tên feature ngắn gọn]

📝 User Story:
Là [role], tôi cần [hành động] để [lợi ích].

✅ Acceptance Criteria:
1. [User làm gì] → [kết quả mong đợi]
2. [User làm gì] → [kết quả mong đợi]
3. [User làm gì] → [kết quả mong đợi]

🚫 Out of Scope (KHÔNG làm):
- [Điều 1]
- [Điều 2]

📦 Estimated Size: [Nhỏ (1-2 sub-tasks) | Vừa (3-5) | Lớn (5+)]

💡 Gợi ý kỹ thuật (nếu có):
- [Gợi ý nhanh về cách implement, table cần dùng, component liên quan]
```

4. **Hỏi user duyệt:**
   > "Bạn duyệt spec này không? Nếu OK → gọi /plan để tôi lên kế hoạch chi tiết."

## Lưu ý
- KHÔNG code ở bước này — chỉ làm rõ yêu cầu
- Nếu feature quá lớn → gợi ý chia thành 2-3 features nhỏ hơn
- Luôn xác định rõ OUT OF SCOPE để tránh scope creep
- Sử dụng ngôn ngữ đời thường, tránh thuật ngữ kỹ thuật phức tạp