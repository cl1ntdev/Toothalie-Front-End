export async function registerUser(
  email: string,
  role: string[],
  password: string,
  username: string,
  first_name: string,
  last_name: string,
  created_at: string,
) {
  console.log(email);
  console.log(role);
  console.log(password);
  console.log(username);
  console.log(first_name);
  console.log(last_name);
  console.log(created_at);

  const result = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      role,
      password,
      username,
      first_name,
      last_name,
      created_at,
    }),
  });

  const data = await result.json();
  return data;
}
