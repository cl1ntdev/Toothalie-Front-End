export async function getDentistServices(){
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = (userInfo.token).toString()
    const result = await fetch('http://127.0.0.1:8000/api/admin/get-dentist-services',{
      method: "GET",
      headers: {"Authorization": `Bearer ${token}`}
    })
    const data = await result.json()
    return data;
  }
  
  export async function getDentistService(dentistServiceID:string){
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = (userInfo.token).toString()
    const result = await fetch('http://127.0.0.1:8000/api/admin/get-dentist-service',{
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({dentistServiceID})
    })
    const data = await result.json()
    return data;
  }
  
  export async function deleteDentistService(dentistServiceID:string){
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = (userInfo.token).toString()
    const result = await fetch('http://127.0.0.1:8000/api/admin/delete-dentist-service',{
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({dentistServiceID})
    })
    const data = await result.json()
    return data;
  }
  
  export async function updateDentistService(payload){
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = (userInfo.token).toString()
    const result = await fetch('http://127.0.0.1:8000/api/admin/update-dentist-service',{
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
  
  export async function createDentistService(payload){
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = (userInfo.token).toString()
    const result = await fetch('http://127.0.0.1:8000/api/admin/create-dentist-service',{
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