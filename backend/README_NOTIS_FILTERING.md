# 🔔 Notification Filtering Guide

This document explains how the notification filtering system works across frontend and backend. It includes supported query parameters, API behavior, and UI integration using tabs.

---

## 🚀 API Endpoint

```
GET /api/notifications
```

This endpoint fetches filtered notifications depending on the query parameters provided.

---

## 🔍 Supported Query Parameters

| Parameter | Type      | Required | Description |
|-----------|-----------|----------|-------------|
| `type`    | `string`  | No       | Filters notifications by category. Options: `all`, `unread`, `mention`, `system`, `neural`, `like`, `follow`, `comment`, `ar`. |
| `read`    | `boolean` | No       | Filters by read status. `true` for read, `false` for unread. |
| `limit`   | `number`  | No       | Limits the number of results returned. Defaults to 20. |
| `cursor`  | `string`  | No       | Supports cursor-based pagination (e.g. last seen ID or timestamp). |
| `sort`    | `string`  | No       | Sorting method. Options: `newest`, `oldest`, `most_urgent`. Default is `newest`. |
| `userId`  | `string`  | No       | Filter by user (useful for admin or system dashboards). |

---

## 🧪 Example Queries

### Get all notifications
```
GET /api/notifications?type=all
```

### Get unread notifications
```
GET /api/notifications?type=unread
```

### Get only mentions
```
GET /api/notifications?type=mention
```

### Get unread system alerts sorted by urgency
```
GET /api/notifications?type=system&read=false&sort=most_urgent
```

### Paginate neural notifications
```
GET /api/notifications?type=neural&limit=10&cursor=1683459672000
```

---

## 🧠 Backend Filtering Logic

- If `type=all`, return all notifications (optionally paginated).
- If `type=unread`, imply `read=false` internally.
- Specific types (e.g. `mention`, `neural`) map directly to `alert.type`.
- `cursor` is based on a stable sort key like timestamp or ID.
- `sort=most_urgent` may prioritize `isUrgent: true` or high `neuralSignature`.

---

## 🖥️ Frontend Tab Integration

Each UI tab fetches filtered notifications by sending the appropriate query param:

| Tab Label   | Query Param              |
|-------------|--------------------------|
| All         | `?type=all`              |
| Unread      | `?type=unread`           |
| Mentions    | `?type=mention`          |
| Neural      | `?type=neural`           |
| System      | `?type=system`           |

### Frontend Fetch Example

```ts
useEffect(() => {
  fetch(`/api/notifications?type=${activeTab}`)
    .then((res) => res.json())
    .then(setNotifications);
}, [activeTab]);
```

### UI Tabs Sample (ShadCN)
```tsx
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="unread">Unread</TabsTrigger>
    <TabsTrigger value="mention">Mentions</TabsTrigger>
    <TabsTrigger value="neural">Neural</TabsTrigger>
    <TabsTrigger value="system">System</TabsTrigger>
  </TabsList>

  <TabsContent value="all"><NotificationList type="all" /></TabsContent>
  <TabsContent value="unread"><NotificationList type="unread" /></TabsContent>
  <TabsContent value="mention"><NotificationList type="mention" /></TabsContent>
  <TabsContent value="neural"><NotificationList type="neural" /></TabsContent>
  <TabsContent value="system"><NotificationList type="system" /></TabsContent>
</Tabs>
```

## ✅ Feature Checklist
- [ ] Tabs UI integration
- [ ] Backend filtering by type
- [ ] Filtering by read/unread status
- [ ] Pagination support with cursor
- [ ] Sorting by urgency
- [ ] Notification grouping (optional future enhancement)

## 📬 Contact
For questions or feedback about this notification filtering system, reach out to the frontend or backend developer leads.
