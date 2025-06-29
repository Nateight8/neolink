"use client";
import React from "react";

import { BottomNav } from "@/components/navigation/mobile/bottom-nav";
import { AppBar } from "@/components/navigation/mobile/appbar";
// import ChallengeSwiper from "@/components/navigation/chess/mobile";
export default function FloatingNavDemo() {
  return (
    <div className="relative  w-full">
      <AppBar />
      <BottomNav />
      <DummyContent />
      <DummyContent />
      <DummyContent />
    </div>
  );
}
const DummyContent = () => {
  return (
    // <div className="grid grid-cols-1 h-[40rem] w-full rounded-md">
    //   <p className=" text-center text-4xl mt-40 font-bold">
    //     Scroll back up to reveal Navbar
    //   </p>
    //   <div className="inset-0 absolute bg-grid-black/[0.1] dark:bg-grid-white/[0.2]" />

    // </div>
    // <ChallengeSwiper />
    <div className=""></div>
  );
};
