# [048] - Teacher - Tin nhắn

## 1. Thông tin chung

| Trường | Nội dung |
|--------|----------|
| Task ID | [048] |
| Module | Teacher |
| Screen | Tin nhắn |
| Sprint | Sprint 3 |
| Label | Sprint3, Teacher, Frontend |
| Trello | https://trello.com/c/UScerhWS |
| Mockup | https://drive.google.com/file/d/1kUxZGo_tpR_ZKJUUWD_tztI-nTsxcAcl/view?usp=sharing |
| API Base URL | https://api.anhnguhana.com/api |

---

## 2. Mục tiêu màn hình

Hệ thống nhắn tin nội bộ giữa giáo viên và phụ huynh/học viên. Hiển thị danh sách hội thoại, nội dung chat và thông tin người liên hệ.

---

## 3. Điều kiện truy cập

- **Yêu cầu:** Đã đăng nhập
- **Route:** `/messages`
- **Layout:** BasicLayout (full width)
- **Breadcrumb:** Tin nhắn

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │                                                      │
│           ├──────────────┬──────────────────────┬───────────────┤
│           │  Hộp thư     │  Chat Window          │  Thông tin    │
│           │              │                       │  liên hệ      │
│           │ [Tất cả]     │  Phụ huynh Minh Anh   │               │
│           │ [Chưa đọc]   │  ─────────────────    │  [Avatar]     │
│           │ [Đang trả lời│                       │  Tên          │
│           │              │  [Bubble: GV nói]     │  Email        │
│           │  [🔍 Tìm...]  │                       │  SĐT          │
│           │              │  [Bubble: PH trả lời] │               │
│           │  ┌──────────┐│                       │  Tài liệu     │
│           │  │[a] PH    ││  [Bubble: GV nói]     │  đính kèm     │
│           │  │ Minh Anh ││                       │  ────────     │
│           │  │ Cảm ơn..  ││                       │  📎 file.pdf  │
│           │  ├──────────┤│                       │  📎 img.jpg   │
│           │  │[a] PH    ││                       │               │
│           │  │ Lan Anh  ││                       │               │
│           │  │ Hỏi về.. ││  [😊][📎][➤ Nhập...]  │               │
│           │  └──────────┘│                       │               │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Components

### 5.1 InboxSidebar (Panel trái)

**Header:** "Hộp thư"

**Tabs:**
- Tất cả
- Chưa đọc
- Đang trả lời

**Tìm kiếm:** Input tìm theo tên người liên hệ, nội dung

**ConversationList:**
- Avatar + tên người liên hệ
- Preview nội dung tin nhắn cuối
- Thời gian
- Badge số tin chưa đọc (nếu có)
- Chấm xanh = đang online

**Click conversation** → Load vào panel giữa

---

### 5.2 ChatWindow (Panel giữa)

**Header:** Tên người liên hệ + trạng thái online

**MessageList:**
- Tin nhắn của GV: bubble căn phải, màu xanh
- Tin nhắn của PH/HV: bubble căn trái, màu trắng
- Timestamp hiển thị theo nhóm ngày

**ScrollBehavior:** Auto-scroll to bottom khi có tin mới

**MessageInput:**
- Text input "Nhập tin nhắn..."
- Button emoji (😊)
- Button đính kèm file (📎)
- Button gửi (➤)

---

### 5.3 ContactInfoPanel (Panel phải)

**Thông tin liên hệ:**
- Avatar lớn
- Họ tên
- Email
- Số điện thoại
- Vai trò (Phụ huynh / Học viên)

**Tài liệu đính kèm:**
- Danh sách file đã chia sẻ trong cuộc trò chuyện
- Icon loại file + tên file + nút download

---

## 6. API Integration

### 6.1 API Conversation List

**Endpoint:** `GET /api/teacher/messages/conversations`

**Headers:**
```
Authorization: Bearer {access_token}
Device-code: {device_code}
Accept: application/json
```

**Query params:**
```
tab=all      # all | unread | pending
search=
page=1
limit=20
```

**Response (200):**
```json
{
  "data": [
    {
      "conversation_id": 1,
      "contact_name": "Phụ huynh Minh Anh",
      "contact_avatar": "https://...",
      "contact_role": "parent",
      "last_message": "Cảm ơn cô đã nhận xét...",
      "last_message_at": "2025-05-18T10:00:00Z",
      "unread_count": 2,
      "is_online": true
    }
  ],
  "meta": { "total": 15 }
}
```

---

### 6.2 API Message History

**Endpoint:** `GET /api/teacher/messages/conversations/{id}`

**Query params:**
```
page=1
limit=50
```

**Response (200):**
```json
{
  "contact": {
    "id": 10,
    "name": "Phụ huynh Minh Anh",
    "avatar": "https://...",
    "email": "ph@example.com",
    "phone": "0901234567",
    "is_online": true
  },
  "messages": [
    {
      "id": 1,
      "sender": "teacher",
      "content": "Chào anh/chị...",
      "sent_at": "2025-05-18T09:00:00Z",
      "attachments": []
    }
  ]
}
```

---

### 6.3 API Send Message

**Endpoint:** `POST /api/teacher/messages/conversations/{id}/send`

**Request body (multipart/form-data):**
```
content=Nội dung tin nhắn
attachments[]=file1.pdf
```

**Response (201):**
```json
{
  "id": 100,
  "sender": "teacher",
  "content": "Nội dung tin nhắn",
  "sent_at": "2025-05-18T10:05:00Z"
}
```

---

### 6.4 API Conversation Attachments

**Endpoint:** `GET /api/teacher/messages/conversations/{id}/attachments`

**Response (200):**
```json
{
  "attachments": [
    { "id": 1, "name": "BaiTap.pdf", "url": "https://...", "type": "pdf" }
  ]
}
```

---

## 7. Real-time (WebSocket / Polling)

```
WS: wss://api.anhnguhana.com/ws/messages
Events:
  - new_message: { conversation_id, message }
  - read_receipt: { conversation_id, message_id }
  - online_status: { user_id, is_online }
```

**Fallback:** Long-polling mỗi 5 giây nếu WS không khả dụng.

---

## 8. State Management

```typescript
messageStore.setConversations(conversations)
messageStore.setActiveConversation(conversation)
messageStore.setMessages(messages)
messageStore.setAttachments(attachments)
messageStore.setActiveTab('all' | 'unread' | 'pending')
messageStore.appendMessage(message)
```

---

## 9. Test Cases

| # | Mô tả | Kết quả mong đợi |
|---|-------|-----------------|
| 1 | Load trang | Hiển thị danh sách hội thoại |
| 2 | Click conversation | Load tin nhắn vào panel giữa |
| 3 | Gửi tin nhắn | Tin hiện ngay trong chat window |
| 4 | Tab "Chưa đọc" | Chỉ hiện hội thoại có tin chưa đọc |
| 5 | Tìm kiếm hội thoại | Filter theo tên/nội dung |
| 6 | Đính kèm file | Upload và gửi file thành công |
| 7 | Badge unread | Cập nhật khi nhận tin mới |
| 8 | Tải tài liệu đính kèm | Download file thành công |
