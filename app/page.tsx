"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer as AppFooter, X, Discord } from "@/components/footer";
import { Users, Zap, Shield, ChevronRight, Instagram } from "lucide-react";
import { useRouter } from "next/navigation"; // Updated import
import { useEffect, useState } from "react";

const useAuth = () => {
  // Mock implementation of useAuth
  // Replace this with your actual authentication logic
  const isLoggedIn = false; // Change this to true to simulate a logged-in user
  return { isLoggedIn };
};

export function LocalFooter() {
  const router = useRouter(); // Initialize the router
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (e.g., using localStorage)
    const loggedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <footer className="border-t border-steel-gray bg-black/80 py-8">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider text-white">
                CLUTCH<span className="text-neon-green">VAULT</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Join competitive CODM tournaments with your squad. Climb the leaderboard. Win big.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/tournaments"
                    onClick={(e) => {
                      if (!isLoggedIn) {
                        e.preventDefault(); // Prevent navigation
                        router.push("/login?redirect=/tournaments"); // Redirect to login with redirect query
                      }
                    }}
                    className="text-muted-foreground hover:text-neon-green"
                  >
                    Tournaments
                  </Link>
                </li>
                <li>
                  <Link href="/rules" className="text-muted-foreground hover:text-neon-green">
                    Rules
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-neon-green">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-neon-green">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-neon-green">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-neon-green">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Connect with us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-neon-green">
                <X className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-neon-green">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-neon-green">
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-steel-gray pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Clutch Vault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useAuth(); // Replace with your actual authentication logic

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login
    const isAuthenticated = true; // Replace with actual authentication logic

    if (isAuthenticated) {
      localStorage.setItem("isLoggedIn", "true"); // Store login state
      router.push("/tournaments"); // Redirect to the Tournaments page
    } else {
      alert("Invalid login credentials"); // Handle login failure
    }
  };

  const handleTournamentsClick = (e: React.MouseEvent, router: any, path: string) => {
    e.preventDefault();
    if (isLoggedIn) {
      router.push(path); // Redirect to tournaments if logged in
    } else {
      router.push(`/login?redirect=${path}`); // Redirect to login with redirect to tournaments
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 overflow-hidden">
          <div className="absolute inset-0 tech-pattern opacity-20"></div>
          <div className="container relative z-10 py-20 md:py-32">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  <span className="block">Dominate the</span>
                  <span className="block text-neon-green glow-text animate-glow-pulse">Battlefield</span>
                </h1>
                <p className="max-w-[600px] text-xl text-muted-foreground">
                  Join competitive CODM tournaments with your squad. Climb the leaderboard. Win big.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Sign Up Button */}
                  <Button asChild size="lg" className="bg-neon-green text-black hover:bg-neon-green/80">
                    <Link href="/signup?redirect=/">Sign Up</Link>
                  </Button>
                  {/* Browse Tournaments Button */}
                  <Button
                    onClick={(e) => handleTournamentsClick(e, router, "/tournaments")}
                    className="bg-black text-white border border-white hover:bg-white hover:text-black"
                  >
                    Browse Tournaments
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-neon-green/30 to-neon-blue/30 blur-lg"></div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-steel-gray">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Call of Duty Mobile Tournament"
                    width={800}
                    height={600}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Why Choose <span className="text-neon-green">Clutch Vault</span>
              </h2>
              <p className="max-w-[800px] mx-auto text-muted-foreground text-lg">
                The ultimate platform for competitive Call of Duty Mobile players
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="group relative overflow-hidden rounded-lg border border-steel-gray bg-steel-dark p-6 transition-all hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(0,255,170,0.2)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                <Image
                    src="/trophy.jpg" // The image path inside your public folder
                    alt="Trophy Icon"
                    width={24}
                    height={24}
                    />
                </div>
                <h3 className="mb-2 text-xl font-bold">Competitive Tournaments</h3>
                <p className="text-muted-foreground">
                  Join tournaments with various formats and compete against the best CODM players.
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-steel-gray bg-steel-dark p-6 transition-all hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(0,255,170,0.2)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Squad Up</h3>
                <p className="text-muted-foreground">
                  Create or join a team with your friends and dominate the competition together.
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-steel-gray bg-steel-dark p-6 transition-all hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(0,255,170,0.2)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Real Prizes</h3>
                <p className="text-muted-foreground">
                  Win cash prizes, gaming gear, and exclusive in-game items in our tournaments.
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-steel-gray bg-steel-dark p-6 transition-all hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(0,255,170,0.2)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Fair Play</h3>
                <p className="text-muted-foreground">
                  Our anti-cheat system and dedicated moderators ensure fair competition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Tournaments */}
        <section className="py-20 bg-steel-dark">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">
                  Upcoming <span className="text-neon-green">Tournaments</span>
                </h2>
                <p className="text-muted-foreground">Register now to secure your spot in these exciting competitions</p>
              </div>
              <Button
                className="mt-4 md:mt-0"
                variant="outline"
                onClick={() => {
                  if (isLoggedIn) {
                    router.push("/tournaments"); // Redirect to tournaments if logged in
                  } else {
                    router.push("/login?redirect=/tournaments"); // Redirect to login with redirect query
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  View All Tournaments
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg border border-steel-gray bg-black">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=500`}
                      alt={`Tournament ${i}`}
                      width={500}
                      height={300}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 rounded bg-neon-green px-2 py-1 text-xs font-medium text-black">
                      {["Squad", "Solo", "Duo"][i - 1]}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-2 text-xl font-bold group-hover:text-neon-green">
                      {["CODM Pro League", "Weekend Warfare", "Clutch Cup"][i - 1]}
                    </h3>
                    <div className="mb-4 flex items-center text-sm text-muted-foreground">
                      <span className="mr-4">Prize: ${[5000, 2500, 10000][i - 1]}</span>
                      <span>Teams: {[32, 64, 16][i - 1]}</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Starts in {[2, 5, 10][i - 1]} days</span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${i === 1 ? "bg-yellow-500/20 text-yellow-500" : i === 2 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                      >
                        {["Registering", "Open", "Last Call"][i - 1]}
                      </span>
                    </div>
                    <Button
                      className="w-full bg-neon-green text-black hover:bg-neon-green/80"
                      onClick={() => {
                        if (isLoggedIn) {
                          router.push(`/tournaments/${i}`)
                        } else {
                          router.push(`/login?redirect=/tournaments/${i}`)
                        }
                      }}
                    >
                      Register Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="relative overflow-hidden rounded-lg border border-steel-gray bg-steel-dark p-8 md:p-12">
              <div className="absolute inset-0 tech-pattern opacity-10"></div>
              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  Ready to <span className="text-neon-green glow-text">Compete</span>?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Create your account now and start your journey to becoming a CODM champion. Join tournaments, form
                  your squad, and climb the leaderboard.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="bg-neon-green text-black hover:bg-neon-green/80">
                    <Link href="/signup?redirect=/">Sign Up Now</Link>
                  </Button>
                  <Button asChild variant="ghost" className="text-white hover:text hover:bg-transparent">
                    <Link
                      href="/login?redirect=/tournaments"
                      className="text-sm font-medium text-muted-foreground bg-black text-white border border-white hover:bg-white hover:text-black"
                    >
                      Login
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LocalFooter />
    </div>
  );
}