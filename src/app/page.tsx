"use client";

import React, { useState } from "react";
import Game from "@/app/_components/Game";
import TopPage from "@/app/_components/TopPage";

export default function Home() {
  const [currentView, setCurrentView] = useState<"top" | "game">("top");

  const handleStartGame = () => {
    setCurrentView("game");
  };

  const handleBackToTop = () => {
    setCurrentView("top");
  };

  if (currentView === "top") {
    return <TopPage onStartGame={handleStartGame} />;
  }

  return <Game onBackToTop={handleBackToTop} />;
}
