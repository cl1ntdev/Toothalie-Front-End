export async function getUsers(){
  console.log('test')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  console.log(userInfo)
  const token = (userInfo.token).toString()
  console.log(token)
  const result = await fetch('http://127.0.0.1:8000/api/get-users',{
    method: "GET",
    headers: {"Authorization": `Bearer ${token}`}
  })
  const data = await result.json()
  return data;
}