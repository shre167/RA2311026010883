import { mockNotifications } from "./mockData";

export interface NotificationItem {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

const API_URL = "http://20.207.122.201/evaluation-service/notifications";

export const fetchNotifications = async (
  page: number = 1,
  limit: number = 10,
  notificationType?: string
): Promise<{ notifications: NotificationItem[], total: number }> => {
  try {
    const token = localStorage.getItem("access_token") || "";
    let url = `${API_URL}?page=${page}&limit=${limit}`;
    if (notificationType && notificationType !== "All") {
      url += `&notification_type=${notificationType}`;
    }

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { notifications: data.notifications || [], total: data.total || 100 };
    }
    console.warn("API failed, falling back to mock data");
  } catch (error) {
    console.warn("Network error, falling back to mock data", error);
  }

  // MOCK FALLBACK
  let filtered = mockNotifications;
  if (notificationType && notificationType !== "All") {
    filtered = filtered.filter(n => n.Type === notificationType);
  }
  
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ notifications: paginated as NotificationItem[], total: filtered.length });
    }, 400); // simulate network delay
  });
};
