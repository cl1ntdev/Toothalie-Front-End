export default async function getAllDentist(){
  const res = await fetch('http://127.0.0.1:8000/api/dentists');
  
  if (!res.ok) {
    throw new Error("Failed to fetch dentists");
  }

  return res.json();
};
