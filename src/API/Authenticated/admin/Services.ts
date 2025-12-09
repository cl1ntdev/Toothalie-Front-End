export async function getServices() {
  try {
    const userInfoStr = localStorage.getItem("userInfo");
    if (!userInfoStr) throw new Error("No user info");
    const userInfo = JSON.parse(userInfoStr);
    const token = userInfo?.token;
    if (!token) throw new Error("No token");

    const response = await fetch("http://127.0.0.1:8000/api/get-services", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch services");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

