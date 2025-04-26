"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/context/NotificationContext";
import { supabase } from "@/lib/supabaseClient";
import { insertRecord } from "@/lib/supabaseQueries";

export default function RegisterTournamentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const [session, setSession] = useState<any>(null);
  const tournamentId = "123"; // Replace with dynamic tournament ID if needed

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();
  }, []);

  async function handleRegistration() {
    if (!session || !session.user) {
      alert("You must be logged in to register.");
      return;
    }
    setLoading(true);
    try {
      await insertRecord("registrations", {
        tournament_id: tournamentId,
        user_id: session.user.id,
      });
      addNotification({
        title: "Tournament Registration Complete",
        content: `You have successfully registered for the tournament.`,
      });
      router.push("/registration-complete");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert("Registration failed: " + error.message);
      } else {
        alert("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  }

  // Add logic to trigger notifications for friend requests and tournament reminders
  useEffect(() => {
    // Simulate a new friend request notification
    addNotification({
      title: "New Friend Request",
      content: "You have received a new friend request.",
    });

    // Simulate a friend accepting your request
    addNotification({
      title: "Friend Request Accepted",
      content: "Your friend request has been accepted.",
    });

    // Simulate a notification for a registered tournament starting soon
    const tournamentStartTime = new Date();
    tournamentStartTime.setHours(tournamentStartTime.getHours() + 1); // 1 hour from now
    addNotification({
      title: "Tournament Reminder",
      content: `Your registered tournament starts at ${tournamentStartTime.toLocaleTimeString()}. Be ready!`,
    });
  }, [addNotification]);

  return (
    <div className="container max-w-md py-8 relative">
      <h1 className="text-2xl font-bold mb-4">Register for Tournament</h1>
      <Button onClick={handleRegistration} disabled={loading}>
        {loading ? "Registering..." : "Complete Registration"}
      </Button>
    </div>
  );
}
