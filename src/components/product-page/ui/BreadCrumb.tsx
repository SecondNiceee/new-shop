import { ChevronRight } from "lucide-react"
import Link from "next/link"
import type { FC } from "react"
import cl from "../product-popup.module.css"
import type { Category, Product } from "@/payload-types"

interface IBreadCrumb {
  product: Product
}
const BreadCrumb: FC<IBreadCrumb> = ({ product }) => {
  return (
    <div className="px-3 pt-4 pb-2 sm:px-6 hide-scrollbar sm:pt-6">
      <div className="flex items-center text-sm text-orange-500 space-x-1 overflow-x-auto hide-scrollbar">
        <Link className={`${cl.breadcrumbLink} whitespace-nowrap flex-shrink-0`} href={"/"}>
          Главная
        </Link>
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        {product.category && (
          <>
            <Link
              className={`${cl.breadcrumbLink} whitespace-nowrap flex-shrink-0 max-w-[100px] sm:max-w-none truncate`}
              href={`/${(product.category as Category[])[0].value}`}
              title={(product.category as Category[])[0].title}
            >
              {(product.category as Category[])[0].title}
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          </>
        )}
        {product.subCategory && (
          <>
            <Link
              className={`${cl.breadcrumbLink} whitespace-nowrap flex-shrink-0 max-w-[80px] sm:max-w-none truncate`}
              href={`/${(product.category as Category[])[0].value}?sub=${(product.subCategory as Category).value}`}
              title={(product.subCategory as Category).title}
            >
              {(product.subCategory as Category).title}
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          </>
        )}
        <span
          className={`${cl.breadcrumbLink} text-gray-600 whitespace-nowrap flex-shrink-0 max-w-[120px] sm:max-w-none truncate`}
          title={product.title}
        >
          {product.title}
        </span>
      </div>
    </div>
  )
}

export default BreadCrumb
