"use client"
import Image from "next/image"
import HeaderMobile from "./header-mobile"
import HeaderDesktop from "./header-desktop"

export function Header() {
  return (
    <header>
      <div className="bg-gray-100 shadow-md px-4 py-4 lg:py-5">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout (< 768px) */}
          <HeaderMobile />
          {/* Tablet & Desktop Layout (>= 768px) */}
          <HeaderDesktop />
        </div>
      </div>
    </header>
  )
}
