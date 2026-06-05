# Stage 1

## Approach for Priority Inbox

### Priority Algorithm
Notifications are sorted based on:
1. **Type Weight**: Placement (3) > Result (2) > Event (1)
2. **Recency**: Most recent notifications shown first within same type

### How it works
- Fetch all notifications from the API
- Sort by priority weight first
- Within same priority, sort by timestamp (newest first)
- Display top N notifications (10, 15, or 20 based on user choice)

### Handling new notifications efficiently
- Every time user clicks "Load Notifications", fresh data is fetched
- Sorting is done on the frontend in O(n log n) time
- Top N slice ensures only most important are shown