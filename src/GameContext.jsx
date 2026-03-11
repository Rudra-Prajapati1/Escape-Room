import React, { createContext, useContext, useState, useCallback } from "react";

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const DIFFICULTY_CONFIG = {
  Easy: {
    hints: 4,
    memoryPairs: 6,
    sequenceStart: 3,
    switchGrid: 3,
    cipherWords: 3,
    timeLimit: 90,
  },
  Medium: {
    hints: 3,
    memoryPairs: 8,
    sequenceStart: 4,
    switchGrid: 4,
    cipherWords: 5,
    timeLimit: 60,
  },
  Hard: {
    hints: 2,
    memoryPairs: 10,
    sequenceStart: 5,
    switchGrid: 5,
    cipherWords: 7,
    timeLimit: 45,
  },
};

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState({
    username: localStorage.getItem("escapeRoom_username") || "",
    difficulty: DIFFICULTIES[0],
    currentLevel: 0,
    startTime: null,
    levelTimes: {},
    totalTime: 0,
    lives: 3,
  });

  const setUsername = (name) => {
    localStorage.setItem("escapeRoom_username", name);
    setGameState((prev) => ({ ...prev, username: name }));
  };

  const setDifficulty = (d) =>
    setGameState((prev) => ({ ...prev, difficulty: d }));

  const nextLevel = useCallback((expectedLevel = null) => {
    setGameState((prev) => {
      if (expectedLevel !== null && prev.currentLevel !== expectedLevel) {
        return prev;
      }
      const now = Date.now();
      const levelTime = prev.startTime
        ? Math.floor((now - prev.startTime) / 1000)
        : 0;
      return {
        ...prev,
        currentLevel: prev.currentLevel + 1,
        levelTimes: { ...prev.levelTimes, [prev.currentLevel]: levelTime },
        startTime: now,
        totalTime: prev.totalTime + levelTime,
      };
    });
  }, []);

  const goToLevel = (level) => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: level,
      startTime: Date.now(),
    }));
  };

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: 2,
      startTime: Date.now(),
      levelTimes: {},
      totalTime: 0,
      lives: 3,
    }));
  };

  const loseLife = () => {
    setGameState((prev) => ({ ...prev, lives: Math.max(0, prev.lives - 1) }));
  };

  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: 0,
      startTime: null,
      levelTimes: {},
      totalTime: 0,
      lives: 3,
    }));
  };

  const getLeaderboard = () => {
    try {
      return JSON.parse(localStorage.getItem("escapeRoom_leaderboard")) || [];
    } catch {
      return [];
    }
  };

  const saveToLeaderboard = (entry) => {
    const board = getLeaderboard();
    board.push(entry);
    board.sort((a, b) => a.totalTime - b.totalTime);
    localStorage.setItem(
      "escapeRoom_leaderboard",
      JSON.stringify(board.slice(0, 10)),
    );
  };

  const config = DIFFICULTY_CONFIG[gameState.difficulty];

  return (
    <GameContext.Provider
      value={{
        gameState,
        setUsername,
        setDifficulty,
        nextLevel,
        goToLevel,
        startGame,
        loseLife,
        resetGame,
        config,
        DIFFICULTIES,
        getLeaderboard,
        saveToLeaderboard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
