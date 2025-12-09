export interface ActivityLogsResponse {
  status: string;
  logs: any[];
  total: number;
  filters: {
    actions: string[];
    users: { user_id: number; username: string }[];
  };
}

export interface ActivityLogFilters {
  userId?: string | number;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export async function getActivityLogs(filters?: ActivityLogFilters): Promise<ActivityLogsResponse> {
  try {
    const userInfoStr = localStorage.getItem("userInfo");
    if (!userInfoStr) throw new Error("No user info found");
    
    const userInfo = JSON.parse(userInfoStr);
    const token = userInfo?.token;
    if (!token) throw new Error("Unauthorized: No token found");

    const params = new URLSearchParams();

    // Only append params if they exist and are not empty strings
    if (filters?.userId) params.append("userId", filters.userId.toString());
    if (filters?.action) params.append("action", filters.action);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    
    // Pagination defaults
    params.append("limit", (filters?.limit ?? 50).toString());
    params.append("offset", (filters?.offset ?? 0).toString());

    const response = await fetch(
      `http://127.0.0.1:8000/api/admin/activity-logs?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Server Error: ${text.substring(0, 50)}...`);
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch activity logs");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}