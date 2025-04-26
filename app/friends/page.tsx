"use client";

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Search, UserPlus, X, Check, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { fetchAll, deleteRecord, updateRecord } from "@/lib/supabaseQueries";

export default function FriendsPage() {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    // Fetch accepted friends
    const fetchFriends = async () => {
      const data = await fetchAll({ table: "friends", filter: { status: "accepted" } });
      setFriends(data || []);
    };
    // Fetch pending requests
    const fetchPending = async () => {
      const data = await fetchAll({ table: "friends", filter: { status: "pending" } });
      setPendingRequests(data || []);
    };
    fetchFriends();
    fetchPending();
  }, []);

  const removeFriend = async (id: number) => {
    await deleteRecord("friends", id);
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const acceptRequest = async (id: number) => {
    await updateRecord("friends", id, { status: "accepted" });
    const accepted = pendingRequests.find((r) => r.id === id);
    if (accepted) {
      setFriends((prev) => [...prev, { ...accepted, status: "Online" }]);
      setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const rejectRequest = async (id: number) => {
    await deleteRecord("friends", id);
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const deleteAllFriends = async () => {
    // No batch delete utility, so fallback to supabase directly for this case
    await supabase.from("friends").delete().eq("status", "accepted");
    setFriends([]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20">
        <div className="container py-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">Manage Friends</h1>
              <p className="text-muted-foreground">Add, remove, and manage your CODM friends</p>
            </div>
            <Button asChild className="md:self-start bg-neon-green text-black hover:bg-neon-green/80">
              <Link href="/friends/add" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Friend
              </Link>
            </Button>
          </div>

          <div className="relative flex mb-8">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search friends..." className="pl-10 bg-steel-dark border-steel-gray" />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-steel-dark">
              <TabsTrigger value="all">All Friends</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="rounded-lg border border-steel-gray bg-steel-dark">
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">All Friends</h3>
                  <p className="text-sm text-muted-foreground">Your complete friend list</p>
                </div>

                <div className="divide-y divide-steel-gray max-h-96 overflow-y-auto">
                  {friends.map((friend) => (
                    <div key={friend.id} className="p-4 flex items-center gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={`Friend ${friend.id}`}
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
                      <div className="flex-1">
                        <h4 className="font-medium">{friend.name}</h4>
                        <div className="text-xs text-muted-foreground">{friend.status}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive" onClick={() => removeFriend(friend.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="online" className="mt-4">
              <div className="rounded-lg border border-steel-gray bg-steel-dark">
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">Online Friends</h3>
                  <p className="text-sm text-muted-foreground">Friends currently online</p>
                </div>

                <div className={`divide-y divide-steel-gray ${friends.filter(friend => friend.status === "Online").length > 5 ? "max-h-96 overflow-y-auto" : ""}`}>
                  {friends.filter(friend => friend.status === "Online").map((friend) => (
                    <div key={friend.id} className="p-4 flex items-center gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={`Friend ${friend.id}`}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-steel-dark bg-green-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{friend.name}</h4>
                        <div className="text-xs text-muted-foreground">Online</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive" onClick={() => removeFriend(friend.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <div className="rounded-lg border border-steel-gray bg-steel-dark">
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">Pending Requests</h3>
                  <p className="text-sm text-muted-foreground">Friend requests waiting for your response</p>
                </div>

                <div className={`divide-y divide-steel-gray ${pendingRequests.length > 5 ? "max-h-96 overflow-y-auto" : ""}`}>
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="p-4 flex items-center gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={`Friend Request ${request.id}`}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{request.name}</h4>
                        <div className="text-xs text-muted-foreground">{request.status}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="w-10 p-0" onClick={() => acceptRequest(request.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" className="w-10 p-0" onClick={() => rejectRequest(request.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <Dialog open={isFull} onOpenChange={setIsFull}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Friends List is Full</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500">Please remove some friends to make space.</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
