"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [codUid, setCodUid] = useState("")
  const [inGameName, setInGameName] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams?.get("redirect") || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        alert(error.message)
        return
      }
      if (data.user) {
        // Insert additional profile data
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            cod_uid: codUid,
            in_game_name: inGameName,
            email: email,
          })
        if (profileError) {
          alert(profileError.message)
          return
        }
        router.push(redirectUrl)
      }
    } catch (error) {
      alert("Signup failed")
    }
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
                <h1 className="text-3xl font-bold tracking-tighter mb-2">Create Account</h1>
                <p className="text-muted-foreground">Join Clutch Vault and start competing</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      className="bg-steel-dark border-steel-gray"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      className="bg-steel-dark border-steel-gray"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

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
                  <Label htmlFor="cod-uid">COD Mobile UID</Label>
                  <Input
                    id="cod-uid"
                    placeholder="6876543210123456789"
                    className="bg-steel-dark border-steel-gray"
                    value={codUid}
                    onChange={(e) => setCodUid(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="in-game-name">In-Game Name</Label>
                  <Input
                    id="in-game-name"
                    placeholder="ClutchMaster"
                    className="bg-steel-dark border-steel-gray"
                    value={inGameName}
                    onChange={(e) => setInGameName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-neon-green hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-neon-green hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-neon-green text-black hover:bg-neon-green/80">
                  Create Account
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login?redirect=/tournaments"
                  className="text-neon-green hover:underline"
                >
                  Login
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
