import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'
import cl from '../product-popup.module.css'
import { Category, Product } from '@/payload-types'

interface IBreadCrumb {
  product: Product
}
const BreadCrumb: FC<IBreadCrumb> = ({ product }) => {
  return (
    <div className="px-6 pt-6 pb-2">
      <div className="flex items-end text-sm text-orange-500 space-x-1">
        <Link className={cl.breadcrumbLink} href={'/'}>
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        {product.category && (
          <>
            <Link
              className={cl.breadcrumbLink}
              href={`/${(product.category as Category[])[0].value}`}
            >
              {(product.category as Category[])[0].title}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        {product.subCategory && (
          <>
            <Link
              className={cl.breadcrumbLink}
              href={`/${(product.category as Category[])[0].value}?sub=${(product.subCategory as Category).value}`}
            >
              {(product.subCategory as Category).title}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className={`${cl.breadcrumbLink} text-gray-600`}>{product.title}</span>
      </div>
    </div>
  )
}

export default BreadCrumb
