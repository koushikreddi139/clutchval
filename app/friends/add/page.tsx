"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Search, ChevronRight, UserPlus } from "lucide-react"
import { fetchAll, insertRecord } from "@/lib/supabaseQueries"

export default function AddFriendPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [sentRequests, setSentRequests] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(false)
    setError("")
    setLoading(true)
    try {
      const data = await fetchAll({ table: "profiles", filter: { cod_uid: searchQuery } })
      setSearchResults(data || [])
    } catch (err) {
      setError("Error searching for users.")
      setSearchResults([])
    }
    setLoading(false)
    setHasSearched(true)
  }

  const handleSendRequest = async (userId: string) => {
    await insertRecord("friends", { friend_id: userId, status: "pending" })
    setSentRequests([...sentRequests, userId])
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20">
        <div className="container py-8">
          <div className="mb-8">
            <Link href="/friends" className="text-neon-green hover:underline flex items-center gap-1 mb-4">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Friends
            </Link>
            <h1 className="text-3xl font-bold tracking-tighter">Add Friend</h1>
            <p className="text-muted-foreground">Search for players by UID</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by UID..."
                    className="pl-10 bg-steel-dark border-steel-gray"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/80">
                  Search
                </Button>
              </div>
            </form>

            {hasSearched && (
              <div className="rounded-lg border border-steel-gray bg-steel-dark">
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">Search Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Found {searchResults.length} players matching "{searchQuery}"
                  </p>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                </div>

                <div className="divide-y divide-steel-gray">
                  {searchResults.map((result) => (
                    <div key={result.id} className="p-4 flex items-center gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={result.avatar_url || "/placeholder.svg"}
                          alt={result.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{result.name}</h4>
                        <div className="text-xs text-muted-foreground">UID: {result.cod_uid}</div>
                      </div>
                      <Button
                        size="sm"
                        variant={sentRequests.includes(result.id) ? "outline" : "default"}
                        disabled={sentRequests.includes(result.id)}
                        onClick={() => handleSendRequest(result.id)}
                        className={
                          !sentRequests.includes(result.id) ? "bg-neon-green text-black hover:bg-neon-green/80" : ""
                        }
                      >
                        {sentRequests.includes(result.id) ? (
                          "Request Sent"
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Friend
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!hasSearched && (
              <div className="text-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neon-green/10 text-neon-green mx-auto mb-6">
                  <UserPlus className="h-10 w-10" />
                </div>
                <h2 className="text-xl font-bold mb-2">Find Your Teammates</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Search for players by their UID to add them as friends and invite them to your
                  tournaments.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
