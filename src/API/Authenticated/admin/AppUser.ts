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


export async function getUser(userID:string){
  console.log('test')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  console.log(userInfo)
  const token = (userInfo.token).toString()
  console.log(token)
  const result = await fetch('http://127.0.0.1:8000/api/get-user',{
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({userID})
  })
  const data = await result.json()
  return data;
}


export async function updateUser(payload){
  console.log('test')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  console.log(userInfo)
  const token = (userInfo.token).toString()
  console.log(token)
  const result = await fetch('http://127.0.0.1:8000/api/update-user',{
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  const data = await result.json()
  return data;
}