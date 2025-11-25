import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { registerUser } from "@/API/Authenticated/RegisterUser"
export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    contact_no: "",
    email: "",
    password: "",
    confPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleRegister = async () => {
    if (form.password.trim() !== form.confPassword.trim()) {
      alert("Passwords do not match.")
      return
    }

    const created_at = new Date().toISOString()
    const role = ["ROLE_PATIENT"] 

    const res = await registerUser(
      form.email,
      role,
      form.password,
      form.username,
      form.first_name,
      form.last_name,
      created_at
    )

    console.log("Register Response:", res)

    if (!res) {
      alert("Registration failed")
      return
    }

    alert("Account successfully created!")
    navigate(`/login`)
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(e) => {
        e.preventDefault()
        handleRegister()
      }}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Fill out the details below to register your account
        </p>
      </div>

      <div className="grid gap-6">
        
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" placeholder="Enter username"
            onChange={handleChange} required />
        </div>

        <div className="flex gap-2">
          <div className="grid gap-3 w-full">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" type="text" placeholder="Enter your first name"
              onChange={handleChange} required />
          </div>

          <div className="grid gap-3 w-full">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" type="text" placeholder="Enter your last name"
              onChange={handleChange} required />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="grid gap-3 w-full">
            <Label htmlFor="contact_no">Contact Number</Label>
            <Input
              id="contact_no"
              type="text"
              placeholder="09XXXXXXXXX"
              maxLength={11}
              pattern="^09[0-9]{9}$"
              onChange={handleChange}
              required
            />

          </div>

          <div className="grid gap-3 w-full">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com"
              onChange={handleChange} required />
          </div>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" onChange={handleChange} required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="confPassword">Confirm Password</Label>
          <Input id="confPassword" type="password" onChange={handleChange} required />
        </div>

        <Button type="submit" className="w-full">
          Register
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">Login</Link>
      </div>
    </form>
  )
}
