import { userInfo } from "node:os"

type UserInfo = {
  userID: number 
  first_name:string, 
  last_name:string, 
  role: "Patient" | "Doctor"
}

const loginUser:UserInfo = {
  userID:10,
  first_name:"Clint",
  last_name:"Estrellanes",
  role: "Patient" // Switch
}

export default { loginUser }