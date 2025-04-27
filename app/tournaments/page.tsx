"use client";

<<<<<<< HEAD
=======
import React, { useState, useEffect, ChangeEvent } from "react";
>>>>>>> b3ce105 (Version)
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Filter, Search, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
<<<<<<< HEAD
import { useState, useEffect, ChangeEvent } from "react";
=======
>>>>>>> b3ce105 (Version)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Add a type for tournaments
interface Tournament {
  id: string;
  name: string;
  type: string;
  prize: number;
  teams: number;
  start_time: string;
  status: string;
  room_code?: string;
  role?: string; // e.g., 'player', 'spectator', etc.
}

export default function TournamentsPage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [roomCode, setRoomCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
<<<<<<< HEAD
    // Fetch tournaments from Supabase
    async function fetchTournaments() {
      const { data, error } = await supabase.from("tournaments").select("*");
      if (error) {
        console.error("Error fetching tournaments:", error);
      } else {
        setTournaments(data || []);
      }
    }
    fetchTournaments();

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);
=======
    async function fetchTournaments() {
      let query = supabase.from("tournaments").select("*");
      if (search.trim() !== "") {
        query = query.ilike("name", `%${search}%`);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching tournaments:", error);
        setTournaments([]);
      } else {
        setTournaments((data as Tournament[]) || []);
      }
    }
    fetchTournaments();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [search]);
>>>>>>> b3ce105 (Version)

  const handleJoinNow = (code?: string) => {
    setRoomCode(code || "N/A");
    setIsDialogOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    alert("Room code copied to clipboard!");
  };

<<<<<<< HEAD
  // Search filter
  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(search.toLowerCase())
  );

  // Placeholder: filter tournaments where user has a role (registered)
  const registeredTournaments = tournaments.filter((t) => t.role);
=======
  const filteredTournaments = tournaments;

  // Placeholder: filter tournaments where user has a role (registered)
  const registeredTournaments = tournaments.filter((t: Tournament) => t.role);
>>>>>>> b3ce105 (Version)

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">Welcome to Tournaments</h1>
            <p className="text-muted-foreground">Browse and register for upcoming CODM tournaments</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-tournaments"
                name="search-tournaments"
                placeholder="Search tournaments..."
                className="pl-10 bg-steel-dark border-steel-gray"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
<<<<<<< HEAD
            {filteredTournaments.map((tournament, i) => (
=======
            {filteredTournaments.map((tournament: Tournament, i: number) => (
>>>>>>> b3ce105 (Version)
              <div key={tournament.id} className="group relative overflow-hidden rounded-lg border border-steel-gray bg-steel-dark">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=300&width=500`}
                    alt={`Tournament ${i + 1}`}
                    width={500}
                    height={300}
                    priority
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 rounded bg-neon-green px-2 py-1 text-xs font-medium text-black">
                    {tournament.type}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="mb-2 text-xl font-bold group-hover:text-neon-green">
                    {tournament.name}
                  </h3>
                  <div className="mb-4 flex items-center text-sm text-muted-foreground">
                    <span className="mr-4">Prize: ${tournament.prize}</span>
                    <span>Teams: {tournament.teams}</span>
                  </div>
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(tournament.start_time) > currentTime
                        ? `Starts in ${Math.max(0, Math.ceil((new Date(tournament.start_time).getTime() - currentTime.getTime()) / 86400000))} days`
                        : `Started`}
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        tournament.status === "Registering"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : tournament.status === "Open"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {tournament.status}
                    </span>
                  </div>
                  <Button asChild className="w-full bg-neon-green text-black hover:bg-neon-green/80">
                    <Link href={`/tournaments/${tournament.id}`}>Register Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Registered Tournaments</h2>
            <p className="text-gray-500 mb-6">Tournaments you've registered for</p>
            <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
              {registeredTournaments.length === 0 && (
                <div className="py-4 text-center text-gray-500">No registered tournaments found.</div>
              )}
<<<<<<< HEAD
              {registeredTournaments.map((tournament) => {
=======
              {registeredTournaments.map((tournament: Tournament) => {
>>>>>>> b3ce105 (Version)
                const hoursLeft = Math.max(0, Math.ceil((new Date(tournament.start_time).getTime() - currentTime.getTime()) / 3600000));
                const isJoinAvailable =
                  hoursLeft <= 1 && new Date(tournament.start_time).getTime() > currentTime.getTime();

                return (
                  <div key={tournament.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{tournament.name}</h3>
                      <p className="text-sm text-gray-400">Starts in {hoursLeft} hours</p>
                      <p className="text-sm text-neon-green">{tournament.role}</p>
                    </div>
                    {isJoinAvailable ? (
                      <button
                        onClick={() => handleJoinNow(tournament.room_code)}
                        className="bg-neon-green text-black px-4 py-2 rounded-lg hover:bg-neon-green/80"
                      >
                        Join Now
                      </button>
                    ) : (
                      <span className="text-gray-500">Starts in {hoursLeft} hours</span>
                    )}
                  </div>
                );
              })}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="text-center">
                <DialogHeader>
                  <DialogTitle>ROOM CODE</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center mt-4">
                  <span className="text-2xl font-bold mr-4">{roomCode}</span>
                  <button onClick={copyToClipboard} className="text-neon-green hover:text-neon-green/80">
                    <Copy className="w-6 h-6" />
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
