import { ProductCard } from "@/components/product-card/ProductCard"
import type { Product } from "@/payload-types"
import type { FC } from "react"

interface IRelatedProducts {
  product: Product
}
const RelatedProducts: FC<IRelatedProducts> = ({ product }) => {
  return (
    <>
      {product.recommendedProducts?.length ? (
        <div className="px-3 py-6 sm:px-6 sm:py-8 bg-gray-50">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">С этим товаром берут</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {product.recommendedProducts.map((product, index) => (
              <ProductCard key={index} product={product as Product} />
            ))}
          </div>
        </div>
      ) : <> </>}
    </>
  )
}

export default RelatedProducts
