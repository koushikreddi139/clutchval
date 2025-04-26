"use client"

import { Input } from "@/components/ui/input"
import { use, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Trophy, Users, Calendar, Clock, DollarSign, Shield, ChevronRight } from "lucide-react"
import { fetchById, fetchAll, insertRecord } from "@/lib/supabaseQueries"

export default function TournamentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const tournamentId = unwrappedParams.id
  const router = useRouter()

  const [tournament, setTournament] = useState<any>(null)
  const [friends, setFriends] = useState<any[]>([])
  const [selectedFriends, setSelectedFriends] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState<"details" | "team" | "payment" | "confirmation">("details")
  const [roomPassword, setRoomPassword] = useState<string>("")
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false)

  useEffect(() => {
    // Fetch tournament details from Supabase
    async function fetchTournament() {
      const data = await fetchById("tournaments", tournamentId);
      if (data) {
        setTournament(data);
        setRoomPassword(data.room_password || "");
      }
    }
    // Fetch friends from Supabase
    async function fetchFriends() {
      const data = await fetchAll({ table: "friends", filter: { status: "accepted" } });
      setFriends(data || []);
    }
    fetchTournament();
    fetchFriends();
  }, [tournamentId])

  const handleFriendSelection = (friendId: number) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId))
    } else {
      if (selectedFriends.length < tournament.team_size - 1) {
        setSelectedFriends([...selectedFriends, friendId])
      }
    }
  }

  const handleProceedToPayment = () => {
    setCurrentStep("payment")
  }

  const handleCompletePayment = async () => {
    setCurrentStep("confirmation");
    // Save registration to Supabase
    await insertRecord("registrations", {
      tournament_id: tournamentId,
      team: [/* user id + selectedFriends */],
      paid: true
    });
  }

  const copyToClipboard = (text: string) => {
    if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setShowCopiedTooltip(true)
          setTimeout(() => setShowCopiedTooltip(false), 2000)
        })
        .catch((err) => {
          console.error("Failed to copy text using Clipboard API: ", err)
          fallbackCopyToClipboard(text)
        })
    } else {
      fallbackCopyToClipboard(text)
    }
  }

  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed" // Prevent scrolling to the bottom of the page
      textarea.style.opacity = "0" // Make it invisible
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textarea)
      if (successful) {
        setShowCopiedTooltip(true)
        setTimeout(() => setShowCopiedTooltip(false), 2000)
      } else {
        alert("Failed to copy text. Please copy manually.")
      }
    } catch (err) {
      console.error("Fallback copy failed: ", err)
      alert("Failed to copy text. Please copy manually.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20">
        <div className="container py-8">
          {currentStep === "details" && tournament && (
            <>
              <div className="mb-8">
                <Link href="/tournaments" className="text-neon-green hover:underline flex items-center gap-1 mb-4">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back to Tournaments
                </Link>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">{tournament.title}</h1>
                <p className="text-muted-foreground">{tournament.description}</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-steel-gray mb-8">
                    <Image
                      src={`/placeholder.svg?height=400&width=800`}
                      alt={tournament.title}
                      width={800}
                      height={400}
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 rounded bg-neon-green px-3 py-1 text-sm font-medium text-black">
                      {tournament.mode}
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-steel-dark">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="rules">Rules</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4">
                      <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                        <h2 className="text-xl font-bold mb-4">Tournament Overview</h2>
                        <p className="text-muted-foreground mb-6">{tournament.description}</p>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Date</p>
                              <p className="font-medium">{tournament.date}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Time</p>
                              <p className="font-medium">{tournament.time}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Team Size</p>
                              <p className="font-medium">{tournament.team_size} Players</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <DollarSign className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Entry Fee</p>
                              <p className="font-medium">${tournament.entry_fee} per team</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Prize Pool</p>
                              <p className="font-medium">${tournament.prize_pool}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <Shield className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <p className="font-medium">{tournament.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="rules" className="mt-4">
                      <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                        <h2 className="text-xl font-bold mb-4">Tournament Rules</h2>
                        <ul className="space-y-2">
                          {tournament.rules.map((rule: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neon-green/10 text-neon-green text-xs mt-0.5">
                                {index + 1}
                              </div>
                              <span className="text-muted-foreground">{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div>
                  <div className="rounded-lg border border-steel-gray bg-steel-dark p-6 sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Registration</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entry Fee</span>
                        <span className="font-medium">${tournament.entry_fee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Size</span>
                        <span className="font-medium">{tournament.team_size} Players</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mode</span>
                        <span className="font-medium">{tournament.mode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{tournament.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{tournament.time}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-steel-gray">
                      <Button
                        className="w-full bg-neon-green text-black hover:bg-neon-green/80"
                        onClick={() => setCurrentStep("team")}
                      >
                        Register Now
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        By registering, you agree to the tournament rules and terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === "team" && tournament && (
            <>
              <div className="mb-8">
                <button
                  onClick={() => setCurrentStep("details")}
                  className="text-neon-green hover:underline flex items-center gap-1 mb-4"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back to Tournament Details
                </button>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">Select Your Team</h1>
                <p className="text-muted-foreground">
                  Choose {tournament.team_size - 1} friends to join your team for {tournament.title}
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                    <h2 className="text-xl font-bold mb-4">Your Friends</h2>
                    <p className="text-muted-foreground mb-6">
                      Select {tournament.team_size - 1} friends to form your team. You will be the team leader.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {friends.map((friend) => (
                        <div
                          key={friend.id}
                          className={`relative overflow-hidden rounded-lg border p-4 transition-all ${
                            selectedFriends.includes(friend.id)
                              ? "border-neon-green bg-neon-green/10"
                              : "border-steel-gray bg-steel-dark hover:border-neon-green/50"
                          }`}
                        >
                          <div className="absolute top-2 right-2">
                            <Checkbox
                              checked={selectedFriends.includes(friend.id)}
                              onCheckedChange={() => handleFriendSelection(friend.id)}
                              disabled={
                                !selectedFriends.includes(friend.id) &&
                                selectedFriends.length >= tournament.team_size - 1
                              }
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full">
                              <Image
                                src={friend.avatar || "/placeholder.svg"}
                                alt={friend.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                              <div
                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-steel-dark ${
                                  friend.status === "Online" ? "bg-green-500" : "bg-gray-500"
                                }`}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{friend.name}</h4>
                              <div className="text-xs text-muted-foreground">{friend.status}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="rounded-lg border border-steel-gray bg-steel-dark p-6 sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Team Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tournament</span>
                        <span className="font-medium">{tournament.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Size</span>
                        <span className="font-medium">{tournament.team_size} Players</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Selected</span>
                        <span className="font-medium">
                          {selectedFriends.length + 1} / {tournament.team_size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entry Fee</span>
                        <span className="font-medium">${tournament.entry_fee}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-steel-gray">
                      <Button
                        className="w-full bg-neon-green text-black hover:bg-neon-green/80"
                        onClick={handleProceedToPayment}
                        disabled={selectedFriends.length !== tournament.team_size - 1}
                      >
                        Proceed to Payment
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        {selectedFriends.length !== tournament.team_size - 1
                          ? `Please select ${tournament.team_size - 1 - selectedFriends.length} more friends to continue.`
                          : "Click to proceed to payment and complete registration."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === "payment" && tournament && (
            <>
              <div className="mb-8">
                <button
                  onClick={() => setCurrentStep("team")}
                  className="text-neon-green hover:underline flex items-center gap-1 mb-4"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back to Team Selection
                </button>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">Payment</h1>
                <p className="text-muted-foreground">Complete payment to register for {tournament.title}</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                    <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                    <p className="text-muted-foreground mb-6">
                      Complete your payment using our secure payment gateway.
                    </p>

                    <div className="rounded-lg border border-steel-gray bg-black/50 p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">Cashfree Payment Gateway</h3>

                      {/* This would be replaced with actual Cashfree integration */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-name">Name on Card</Label>
                            <Input id="card-name" placeholder="John Doe" className="bg-steel-dark border-steel-gray" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input
                              id="card-number"
                              placeholder="4111 1111 1111 1111"
                              className="bg-steel-dark border-steel-gray"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="expiry-month">Expiry Month</Label>
                            <Input id="expiry-month" placeholder="MM" className="bg-steel-dark border-steel-gray" />
                          </div>
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="expiry-year">Expiry Year</Label>
                            <Input id="expiry-year" placeholder="YY" className="bg-steel-dark border-steel-gray" />
                          </div>
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" className="bg-steel-dark border-steel-gray" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-neon-green text-black hover:bg-neon-green/80"
                      onClick={handleCompletePayment}
                    >
                      Pay ${tournament.entry_fee} and Register
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="rounded-lg border border-steel-gray bg-steel-dark p-6 sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tournament</span>
                        <span className="font-medium">{tournament.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Size</span>
                        <span className="font-medium">{tournament.team_size} Players</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{tournament.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{tournament.time}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-neon-green">${tournament.entry_fee}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-steel-gray">
                      <p className="text-xs text-muted-foreground">
                        By completing payment, you agree to the tournament rules and terms. No refunds will be issued
                        after registration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === "confirmation" && tournament && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-lg border border-steel-gray bg-steel-dark p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neon-green/20 text-neon-green mx-auto mb-6">
                  <Trophy className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-bold tracking-tighter mb-4">Registration Complete!</h1>
                <p className="text-muted-foreground mb-8">
                  You have successfully registered for {tournament.title}. Your team is now confirmed.
                </p>

                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6 mb-8">
                  <h2 className="text-xl font-bold text-yellow-500 mb-2">Important: Room Password</h2>
                  <p className="text-muted-foreground mb-4">
                    This Room Password is essential. Copy and store it securely — it won't be shown again.
                  </p>
                  <div className="relative">
                    <div className="flex items-center justify-between rounded-lg border border-steel-gray bg-black p-4 mb-2">
                      <span className="font-mono text-neon-green">{roomPassword}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(roomPassword)}
                        className="relative"
                      >
                        {showCopiedTooltip && (
                          <span className="absolute -top-8 right-0 rounded bg-neon-green px-2 py-1 text-xs text-black">
                            Copied!
                          </span>
                        )}
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-medium">Tournament Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-steel-gray bg-black p-4">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{tournament.date}</p>
                    </div>
                    <div className="rounded-lg border border-steel-gray bg-black p-4">
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{tournament.time}</p>
                    </div>
                    <div className="rounded-lg border border-steel-gray bg-black p-4">
                      <p className="text-sm text-muted-foreground">Team Size</p>
                      <p className="font-medium">{tournament.team_size} Players</p>
                    </div>
                    <div className="rounded-lg border border-steel-gray bg-black p-4">
                      <p className="text-sm text-muted-foreground">Mode</p>
                      <p className="font-medium">{tournament.mode}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-neon-green text-black hover:bg-neon-green/80">
                    <Link href="/profile">View in My Profile</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/tournaments">Browse More Tournaments</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
