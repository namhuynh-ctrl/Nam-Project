"use client";

if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return; // Ignore next-themes script tag warning in React 19
    }
    originalConsoleError(...args);
  };
}

export function ConsoleSuppressor() {
  return null;
}
