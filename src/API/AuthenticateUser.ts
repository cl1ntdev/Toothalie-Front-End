export async function authenticateUser(token: string) {
  console.log(token);
  try {
    const res = await fetch("/api/auth/me", {
      // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
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
