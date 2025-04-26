"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, Discord } from "@/components/footer";

const About = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <a onClick={() => router.back()} className="flex items-center text-sm text-neon-green hover:underline cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-4 h-4 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Go back
      </a>
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-gray-700">
        Welcome to ClutchVault! We are dedicated to providing a platform for competitive CODM tournaments. Join us to showcase your skills and form squads.
      </p>
      <p className="text-lg text-gray-700 mt-4">
        Our mission is to create a thriving community of gamers who are passionate about competition and teamwork. Whether you are a seasoned player or just starting, ClutchVault is the place for you.
      </p>
    </div>
  );
};

export default About;