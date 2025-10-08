// NOT FINISHED, LATER FOR REGISTER AND AUTH

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate} from "react-router-dom"
import { useState } from "react"
import Patient from "@/Classes/Authenticated/Patient"
import RegisterAuth from "@/API/RegisterAuth"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [userName,setUsername] = useState<string>("")
  const [password,setPassword] = useState<string>("")
  const [confPassword,setConfPassword] = useState<string>("")
  const [firstName,setFirstName] = useState<string>("")
  const [lastName,setLastName] = useState<string>("")
  const [contactNo,setContactNo] = useState<string>("")
  const [email,setEmail] = useState<string>("")
  
  const navigate = useNavigate()
  
  const handleRegister = async() =>{
    console.log('working')
    if(password.trim() == confPassword.trim()){
      const user = new Patient(userName,firstName,lastName,password,contactNo,email)
      const UserLoginData = await RegisterAuth(user)
      console.log("userlogininfo," + UserLoginData)
      if(UserLoginData){
        alert("account exists")
      }else{
        navigate(`/user/${UserLoginData}`)        
      }
  
    }
  }
  
  return (
    <form className={cn("flex flex-col gap-6", className)}
     onSubmit={(e)=>{
       e.preventDefault()
       handleRegister()
     }}
      {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Fill out the details below to register your account
        </p>
      </div>
    
      <div className="grid gap-6">
    
        {/* Username */}
       
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
    
        <div className="grid-cols-2 flex gap-2 ">
          <div className="">
            <Label htmlFor="first_name" className="mb-2">First Name</Label>
            <Input
              id="first_name"
              type="text"
              placeholder="Enter your first name"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
      
          <div className="grid">
            <Label htmlFor="last_name" className="mb-2">Last Name</Label>
            <Input
              id="last_name"
              type="text"
              placeholder="Enter your last name"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        
    
    
        <div className="grid-cols-2 flex">
          {/* Contact Number */}
          <div className="px-2">
            <Label htmlFor="contact_no" className="mb-2">Contact Number</Label>
            <Input
              id="contact_no"
              type="text"
              placeholder="e.g. 09XXXXXXXXX"
              onChange={(e) => setContactNo(e.target.value)}
              required
            />
          </div>
      
          {/* Email */}
          <div className="px-2">
            <Label htmlFor="email" className="mb-2">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
      
        </div>
        
        {/* Password */}
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
    
        {/* Confirm Password */}
        <div className="grid gap-3">
          <Label htmlFor="conf-password">Confirm Password</Label>
          <Input
            id="conf-password"
            type="password"
            onChange={(e) => setConfPassword(e.target.value)}
            required
          />
        </div>
    
        
        <Button type="submit" className="w-full">
          Register
        </Button>
    
       
      </div>
    
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>

  )
}
