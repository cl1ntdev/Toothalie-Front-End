export async function LogoutUser(){
  console.log('logging out')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = userInfo.token
  console.log(token)
  try{
    const userData = await fetch("http://127.0.0.1:8000/api/logout",{
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    })  
    console.log(userData)
    localStorage.removeItem('userInfo');
    if(localStorage.getItem('loginedDentist')){
        localStorage.removeItem('loginedDentist');
    }
    return userData.json()
    
  }catch(e){
    console.log(e)
  }
  
  
  
  return null
}