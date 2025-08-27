import type React from "react"
import { Categories } from "@/components/categories/categories";
import { BottomNavigation } from "@/components/bottom-navigation/BottomNavigation";

export default async function MainLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <>
      <div className="sticky z-50 flex flex-col  lg:top-[84px] top-[72px]">
        <Categories />
      </div>
      {children}
    </>
  )
}
