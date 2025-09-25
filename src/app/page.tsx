"use client";

import React, { useState } from "react";
import Game from "@/app/_components/Game";
import TopPage from "@/app/_components/TopPage";

export default function Home() {
  const [currentView, setCurrentView] = useState<"top" | "game">("top");

  const handleStartGame = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setCurrentView("game");
      });
    } else {
      setCurrentView("game");
    }
  };

  const handleBackToTop = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setCurrentView("top");
      });
    } else {
      setCurrentView("top");
    }
  };

  if (currentView === "top") {
    return <TopPage onStartGame={handleStartGame} />;
  }

  return <Game onBackToTop={handleBackToTop} />;
}
