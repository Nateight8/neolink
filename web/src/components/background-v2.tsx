"use client";
import React, { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 40;

export default function BackgroundV2() {
  const [lights, setLights] = useState([]);
  const [nextId, setNextId] = useState(0);

  const getRandomEdgePosition = useCallback(() => {
    const edges = ["top", "right", "bottom", "left"];
    const edge = edges[Math.floor(Math.random() * edges.length)];

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const gridCols = Math.ceil(viewportWidth / GRID_SIZE);
    const gridRows = Math.ceil(viewportHeight / GRID_SIZE);

    switch (edge) {
      case "top":
        return {
          x: Math.floor(Math.random() * gridCols) * GRID_SIZE,
          y: 0,
          direction: "down",
          edge: "top",
        };
      case "right":
        return {
          x: (gridCols - 1) * GRID_SIZE,
          y: Math.floor(Math.random() * gridRows) * GRID_SIZE,
          direction: "left",
          edge: "right",
        };
      case "bottom":
        return {
          x: Math.floor(Math.random() * gridCols) * GRID_SIZE,
          y: (gridRows - 1) * GRID_SIZE,
          direction: "up",
          edge: "bottom",
        };
      case "left":
        return {
          x: 0,
          y: Math.floor(Math.random() * gridRows) * GRID_SIZE,
          direction: "right",
          edge: "left",
        };
      default:
        return { x: 0, y: 0, direction: "right", edge: "left" };
    }
  }, []);

  const createLight = useCallback(() => {
    const position = getRandomEdgePosition();
    const newLight = {
      id: nextId,
      ...position,
      opacity: 1,
      path: [{ x: position.x, y: position.y }],
    };

    setLights((prev) => [...prev, newLight]);
    setNextId((prev) => prev + 1);
  }, [getRandomEdgePosition, nextId]);

  const moveLight = useCallback((light) => {
    const { x, y, direction, edge } = light;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newX = x;
    let newY = y;
    let newDirection = direction;

    // Move in current direction
    switch (direction) {
      case "up":
        newY = Math.max(0, y - GRID_SIZE);
        break;
      case "down":
        newY = Math.min(viewportHeight - GRID_SIZE, y + GRID_SIZE);
        break;
      case "left":
        newX = Math.max(0, x - GRID_SIZE);
        break;
      case "right":
        newX = Math.min(viewportWidth - GRID_SIZE, x + GRID_SIZE);
        break;
    }

    // Check if we can turn at intersection (30% chance)
    if (Math.random() < 0.3) {
      const possibleDirections = [];

      if (direction === "up" || direction === "down") {
        if (newX > 0) possibleDirections.push("left");
        if (newX < viewportWidth - GRID_SIZE) possibleDirections.push("right");
      } else {
        if (newY > 0) possibleDirections.push("up");
        if (newY < viewportHeight - GRID_SIZE) possibleDirections.push("down");
      }

      if (possibleDirections.length > 0) {
        newDirection =
          possibleDirections[
            Math.floor(Math.random() * possibleDirections.length)
          ];
      }
    }

    // Check if light should be removed (reached opposite edge or out of bounds)
    const shouldRemove =
      (edge === "top" && newY >= viewportHeight - GRID_SIZE) ||
      (edge === "bottom" && newY <= 0) ||
      (edge === "left" && newX >= viewportWidth - GRID_SIZE) ||
      (edge === "right" && newX <= 0) ||
      newX < 0 ||
      newX >= viewportWidth ||
      newY < 0 ||
      newY >= viewportHeight;

    if (shouldRemove) {
      return null;
    }

    return {
      ...light,
      x: newX,
      y: newY,
      direction: newDirection,
      opacity: Math.max(0, light.opacity - 0.02),
      path: [...light.path.slice(-10), { x: newX, y: newY }], // Keep last 10 positions for trail
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setLights((prevLights) =>
        prevLights
          .map(moveLight)
          .filter((light) => light !== null && light.opacity > 0.1)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [moveLight]);

  // Spawn new lights
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.7) {
        // 70% chance to spawn
        createLight();
      }
    }, 2000 + Math.random() * 2000); // 2-4 seconds

    return () => clearInterval(spawnInterval);
  }, [createLight]);

  // Initial light
  useEffect(() => {
    const timer = setTimeout(createLight, 1000);
    return () => clearTimeout(timer);
  }, [createLight]);

  return (
    <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0">
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Lights */}
      <div className="absolute inset-0 overflow-hidden">
        {lights.map((light) => (
          <div key={light.id}>
            {/* Main light */}
            <div
              className="absolute w-2 h-2 rounded-full transition-all duration-100 ease-linear"
              style={{
                left: `${light.x}px`,
                top: `${light.y}px`,
                backgroundColor: `rgba(0, 255, 255, ${light.opacity})`,
                boxShadow: `0 0 10px rgba(0, 255, 255, ${
                  light.opacity * 0.8
                }), 0 0 20px rgba(0, 255, 255, ${light.opacity * 0.4})`,
                opacity: light.opacity,
              }}
            />

            {/* Trail effect */}
            {light.path.slice(0, -1).map((pos, index) => (
              <div
                key={`${light.id}-trail-${index}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${pos.x + 2}px`,
                  top: `${pos.y + 2}px`,
                  backgroundColor: `rgba(0, 255, 255, ${
                    light.opacity * (index / light.path.length) * 0.3
                  })`,
                  opacity: light.opacity * (index / light.path.length),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
