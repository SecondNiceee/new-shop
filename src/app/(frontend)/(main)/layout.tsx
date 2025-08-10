import { Categories } from "@/components/categories/categories"

export default async function MainLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <>
      <div className="sticky z-50 flex flex-col top-0">
        <Categories />
      </div>
      {children}
    </>
  )
}