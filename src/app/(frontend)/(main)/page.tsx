'use client'

import ErrorAlert from '@/components/error-alert/ErrorAlert'
import { ProductCard } from '@/components/product-card/ProductCard'
import ProductPopup from '@/components/product-popup/product-popup'
import { Badge } from '@/components/ui/badge'
import { products } from '@/data/products'
import { useProductsStore } from '@/entities/products/productsStore'
import { Category, Product } from '@/payload-types'
import { request, RequestError } from '@/utils/request'
import { Loader2, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

type TCategoryWithProducts = {
  category: Category
  products: Product[],
  productsCounter : number
}
export default function EcomarketApp() {
  const [productsAndCategories, setProductsWithCategories] = useState<
    TCategoryWithProducts[] | null
  >()
  const [error, setError] = useState<RequestError | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false);
  const {setProductsPopup} = useProductsStore();
  const params = useSearchParams();
  const productParam = params?.get("product");
  useEffect( () => {
    if (productParam){
      setProductsPopup(true);
    }
  }, [productParam] )
  const getProductsWithCategories = useCallback(async () => {
    setLoading(true)
    setError(null);
    try {
      const rezult = await request<TCategoryWithProducts[]>({
        method: 'GET',
        url: '/api/categories-with-products',
        credentials: true,
        headers: {
          'Content-Type': 'Application/json',
        },
      })
      setProductsWithCategories(rezult)
    } catch (e) {
      console.log(e)
      const error = e as RequestError
      setError(error)
    }
    setLoading(false)
  }, [setLoading, setError, setProductsWithCategories])
  useEffect(() => {
    getProductsWithCategories()
  }, [getProductsWithCategories])

  if (error) {
    console.log(error)
    return (
      <ErrorAlert
        buttonAction={() => getProductsWithCategories()}
        errorMessage="Не удалось загрузить товары, проверьте подключение к интернету."
      />
    )
  }
  if (isLoading || !productsAndCategories) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }
  return (
    <>
    <section className='products bg-gray-50'>
      <div className="flex mt-4 flex-col rounded-md bg-gray-50 px-4 mx-auto max-w-7xl gap-3">
        {productsAndCategories.map((item) => (
          <div key={item.category.id} className="flex flex-col gap-4">
            {item.products.length ? (
              <>
                <div className='flex justify-between items-start w-full'>
                  <h2 className="text-2xl text-black font-bold">{item.category.title}</h2>
                  <Link href={`/${item.category.value}`} className='self-end flex items-center'>
                    <Badge className='bg-green-400 hover:bg-green-400 cursor-pointer gap-2 flex items-center'>
                      <p className='text-sm text-white'>Еще {item.productsCounter-6}</p>
                      <MoveRight color='white' size={15} />
                    </Badge>
                  </Link>
                </div>
                <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {item.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </section>
    <ProductPopup />
    </>
  )
}
