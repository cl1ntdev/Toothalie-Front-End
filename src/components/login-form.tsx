import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

import LoginAuth from "@/API/LoginAuth" // checking username and password only
import { UserLoginInfoClass } from "@/Classes/UserLogin"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Alert from "./_myComp/Alerts"
import { IconFlagSearch } from "@tabler/icons-react"
import { authenticateUser } from "@/API/AuthenticateUser"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [userName,setUsername] = useState<string>("")
  const [password,setPassword] = useState<string>("")
  const [isWrong,setIsWrong] = useState<boolean>(false)
  const [submitButton,setSubmitButton] = useState<string>("Login") 
  const navigate = useNavigate()
  
  useEffect(()=>{
    console.log('working')
    const remember=async()=>{
      const userInfo=JSON.parse(localStorage.getItem('userInfo'))
      console.log(userInfo.token)
      const check=await authenticateUser(userInfo.token)
      if(check.status=='ok'){
        navigate('/user')
      }
    }
    
    remember()
  },[])
  
  
  
  const handleLogin = async() =>{
    const user = new UserLoginInfoClass(userName,password)
    setSubmitButton("Loading Please Wait ...")
    const userLoginInfo = await LoginAuth(user) // this returns only a token
    const userLoginID = userLoginInfo.id
    if(userLoginInfo.status != "error"){
      console.log(userLoginInfo)
      localStorage.setItem('userInfo',JSON.stringify(userLoginInfo))
      navigate(`/user`)      
    }else{
      console.log("Error Login")
      setIsWrong(true)
  
    }
    console.log(userLoginInfo)
  }
  
  useEffect(()=>{
    setSubmitButton("Login")
    const reset = setInterval(()=>{
      setIsWrong(false)
      clearInterval(reset)
    },6000)
  },[isWrong])
  
  return (
    <form className={cn("flex flex-col gap-6", className)}
     onSubmit={(e)=>{
       e.preventDefault()
       handleLogin()
     }}
      {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your Username and Password below 
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input 
          onChange={(e)=>setUsername(e.target.value)} id="username" type="text" placeholder="johndoe" 
          maxLength={20}
          // pattern="^[a-zA-Z0-9._-]+$"
          required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input onChange={(e)=>setPassword(e.target.value)} id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          {submitButton}
        </Button>
        {/*<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button>*/}
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        
        <Link to="/register" className="underline underline-offset-4">Sign up</Link>
      </div>
      {isWrong && (
        <Alert status="error_stat_1" />
      )}
    </form>
    
  )
}
