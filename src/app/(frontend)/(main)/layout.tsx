import { Categories } from "@/components/categories/categories"

export default async function MainLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <>
      <div className="sticky z-50 flex flex-col top-[116px] lg:top-[84px] md:top-[72px]">
        <Categories />
      </div>
      {children}
    </>
  )
}