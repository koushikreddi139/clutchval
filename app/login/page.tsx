"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams?.get("redirect") || "/"

  async function handleLogin() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        alert(error.message)
        return
      }
      if (data.session) {
        localStorage.setItem("authToken", data.session.access_token)
        router.push(redirectUrl)
      }
    } catch (error) {
      alert("Login failed")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container max-w-md">
          <div className="relative overflow-hidden rounded-lg border border-steel-gray bg-steel-dark p-8">
            <div className="absolute inset-0 tech-pattern opacity-10"></div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tighter mb-2">
                  Welcome <span className="text-neon-green">Back</span>
                </h1>
                <p className="text-muted-foreground">Login to your Clutch Vault account</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="bg-steel-dark border-steel-gray"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-neon-green hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-steel-dark border-steel-gray pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-neon-green text-black hover:bg-neon-green/80">
                  Login
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup?redirect=/"
                  className="text-neon-green hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
