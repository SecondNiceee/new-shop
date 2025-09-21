import type React from "react"
import { Categories } from "@/components/categories/categories";
import ConditionalHeroSlider from "@/components/hero-slider/conditional-hero-slider";

export default async function MainLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <>
      <ConditionalHeroSlider />
      <div className="sticky z-50 flex flex-col  lg:top-[84px] top-[72px]">
        <Categories />
      </div>
      {children}
    </>
  )
}
