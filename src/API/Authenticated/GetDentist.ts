const getAllDentist = async() => {
  const dentists = await fetch('http://127.0.0.1:8000/api/dentists')
  
  return dentists
}