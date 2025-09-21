"use client";

import { usePathname } from "next/navigation";
import HeroSlider from "./hero-slider";

export default function ConditionalHeroSlider() {
  const pathname = usePathname();

  // Показываем HeroSlider только на главной странице
  if (pathname === "/") {
    return <HeroSlider />;
  }

  return null;
}