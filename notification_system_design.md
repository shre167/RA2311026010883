# Notification System Design

This document outlines the system design and algorithms used for the Campus Notifications Microservice.

## Stage 1: Priority Inbox

**Requirement**: Efficiently maintain and display the top 10 most important unread notifications from a stream based on Weight (Placement > Result > Event) and Recency.

### Algorithm Selection: Min-Heap (Priority Queue)
To maintain the top N notifications efficiently from an incoming stream without storing everything in a database, the optimal data structure is a **Min-Heap (Priority Queue)** of size `N=10`.

**Why Min-Heap?**
- If we keep a list and sort it every time a new notification arrives, the time complexity is `O(M log M)` where M is the total number of notifications. 
- By using a Min-Heap of size 10, we can maintain the top 10 items in `O(log N)` time per insertion, which is highly efficient. Space complexity is constrained to `O(N)`.

**Implementation Details**:
1. We define custom weights for the types: `Placement = 3`, `Result = 2`, `Event = 1`.
2. When a new notification arrives, we compare it against the root of the Min-Heap (which holds the *lowest* priority item currently in the top 10).
3. If the incoming notification has a higher priority than the root (either a higher weight, or same weight but newer timestamp), we pop the root and insert the new notification.
4. If the heap has less than 10 items, we just insert the incoming notification.
