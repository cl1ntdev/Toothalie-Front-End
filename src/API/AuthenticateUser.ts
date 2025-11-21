export async function authenticateUser(token: string) {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return { status: "error" };
    }

    const data = await res.json();
    return { status: "ok", user: data };
    
  } catch {
    return { status: "error" };
  }
}
