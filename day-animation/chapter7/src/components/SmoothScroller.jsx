"use client";

import useLenis from "../hooks/useLenis";

export default function SmoothScroll({ children }) {
  useLenis();

  return <>{children}</>;
}