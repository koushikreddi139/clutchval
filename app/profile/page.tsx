"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Edit, Trophy, Users, Clock, ClipboardCopy } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    uid: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase after login
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      // Fetch profile from 'profiles' table
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("id", user.id)
        .single();
      if (!error && data) {
        setProfile({
          name: data.name || "",
          uid: data.id,
          image: data.avatar_url || "",
        });
      } else {
        setProfile({ name: "", uid: user.id, image: "" });
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    // Update the name in Supabase
    await supabase.from("profiles").update({ name: profile.name }).eq("id", profile.uid);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Optionally upload to Supabase Storage here, for now just use base64 preview
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string;
        setProfile((prev) => ({ ...prev, image: imageUrl }));
        // Update avatar_url in Supabase
        await supabase.from("profiles").update({ avatar_url: imageUrl }).eq("id", profile.uid);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20">
        <div className="container py-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-neon-green">
                <Image
                  src={profile.image || "/placeholder.svg?height=80&width=80"}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="object-cover"
                />
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profilePhoto"
                  className="absolute bottom-0 right-0 h-6 w-6 flex items-center justify-center rounded-full bg-neon-green text-black hover:bg-neon-green/80 cursor-pointer"
                  aria-label="Edit Profile Photo"
                >
                  <Edit className="h-4 w-4" />
                </label>
              </div>
              <div>
                <div>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleInputChange}
                          className="w-full text-3xl font-bold tracking-tighter bg-transparent border-b border-gray-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="uid" className="block text-sm font-medium text-muted-foreground">
                          UID
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{profile.uid}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(profile.uid);
                              setCopied(true); // Show "Copied" text
                              setTimeout(() => setCopied(false), 500); // Hide "Copied" text after 2 seconds
                            }}
                            className="text-muted-foreground hover:text-neon-green"
                            aria-label="Copy UID"
                          >
                            <ClipboardCopy className="h-4 w-4" />
                          </button>
                          {copied && <span className="text-xs text-neon-green">Copied</span>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-3xl font-bold tracking-tighter">{profile.name}</h1>
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground">UID: {profile.uid}</p>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(profile.uid);
                            setCopied(true); // Show "Copied" text
                            setTimeout(() => setCopied(false), 2000); // Hide "Copied" text after 2 seconds
                          }}
                          className="text-muted-foreground hover:text-neon-green"
                          aria-label="Copy UID"
                        >
                          <ClipboardCopy className="h-4 w-4" />
                        </button>
                        {copied && <span className="text-xs text-neon-green">Copied</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {isEditing ? (
                <Button onClick={handleSave} variant="outline" className="md:self-start">
                  Save
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="md:self-start">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
              <Button asChild variant="outline" className="md:self-start">
                <Link href="/friends" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Manage Friends
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                <h2 className="text-xl font-bold mb-4">Player Stats</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tournaments Played</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tournaments Won</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Earnings</span>
                    <span className="font-medium text-neon-green">$1,250</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-steel-gray">
                  <h3 className="text-lg font-medium mb-4">Achievements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Tournament Champion</p>
                        <p className="text-xs text-muted-foreground">Won CODM Pro League</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Squad Leader</p>
                        <p className="text-xs text-muted-foreground">Created a team of 5+ players</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-steel-dark">
                  <TabsTrigger value="history">Match History</TabsTrigger>
                  <TabsTrigger value="registered">Registered</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="mt-4">
                  <div className="rounded-lg border border-steel-gray bg-steel-dark">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2">Recent Tournaments</h3>
                      <p className="text-sm text-muted-foreground">Your tournament match history</p>
                    </div>

                    <div className="divide-y divide-steel-gray">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-steel-gray">
                            <Trophy className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {
                                [
                                  "CODM Pro League",
                                  "Weekend Warfare",
                                  "Clutch Cup",
                                  "Elite Showdown",
                                  "Sniper Challenge",
                                ][i]
                              }
                            </h4>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {["2 weeks ago", "1 month ago", "2 months ago", "3 months ago", "4 months ago"][i]}
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-sm font-medium ${
                                i === 0 ? "text-neon-green" : i === 1 ? "text-blue-400" : "text-muted-foreground"
                              }`}
                            >
                              {["1st Place", "3rd Place", "Top 8", "Top 16", "Top 32"][i]}
                            </div>
                            <div className="text-xs text-muted-foreground">{i < 2 ? `+$${[750, 250][i]}` : ""}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 text-center">
                      <Button variant="outline" size="sm">
                        View All History
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="registered" className="mt-4">
                  <div className="rounded-lg border border-steel-gray bg-steel-dark">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2">Registered Tournaments</h3>
                      <p className="text-sm text-muted-foreground">Tournaments you've registered for</p>
                    </div>

                    <div className="divide-y divide-steel-gray">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="p-4 flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-steel-gray">
                            <Trophy className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{["CODM Pro League", "Weekend Warfare"][i]}</h4>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {["Starts in 2 days", "Starts in 5 days"][i]}
                            </div>
                            <div className="text-xs text-neon-green mt-1">
                              {i === 0 ? "Team Leader" : "Team Member"}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={i === 0 ? "default" : "outline"}
                            disabled={i !== 0}
                            className={i === 0 ? "bg-neon-green text-black hover:bg-neon-green/80" : ""}
                          >
                            {i === 0 ? "Join Now" : "Starts in 5 days"}
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 text-center">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/tournaments">Browse More Tournaments</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="friends" className="mt-4">
                  <div className="rounded-lg border border-steel-gray bg-steel-dark">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Friends</h3>
                        <p className="text-sm text-muted-foreground">Your CODM squad members</p>
                      </div>
                      <Button asChild size="sm">
                        <Link href="/friends/add">Add Friend</Link>
                      </Button>
                    </div>

                    <div className="divide-y divide-steel-gray">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-4 flex items-center gap-4">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full">
                            <Image
                              src={`/placeholder.svg?height=40&width=40`}
                              alt={`Friend ${i + 1}`}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                            <div
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-steel-dark ${
                                i < 2 ? "bg-green-500" : "bg-gray-500"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{["SnipeKing", "FragMaster", "StealthOps", "RushQueen"][i]}</h4>
                            <div className="text-xs text-muted-foreground">
                              {i < 2 ? "Online" : "Last seen 2 hours ago"}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Invite
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 text-center">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/friends">Manage Friends</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
