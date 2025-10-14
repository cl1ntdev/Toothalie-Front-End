import React, { useEffect, useState, } from "react";
import { useParams } from "react-router-dom";
import { getDentistData } from "@/API/Authenticated/GetDentist";
import { LoaderIcon } from "lucide-react";

export function SettingsPane() {
  const [dentistInfo, setDentistInfo] = useState("");
  const {id} = useParams()
  useEffect(() => {
    const fetchLoginDentist = async(id) => {
      const result = await getDentistData(id)
      console.log(result)
      console.log(id)
    }
    console.log(dentistInfo)
    const loginedDentist = localStorage.getItem("loginedDentist");
    console.log(loginedDentist)
   
    if (loginedDentist==null) {
      // fetch dentist if there is no catched json
      fetchLoginDentist(id)
    } else{
      // add dentist here
    }
  }, []);

  return (
    <>
      <h1>Settings ya</h1>
    </>
  );
}
