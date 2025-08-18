import { ProductCard } from '@/components/product-card/ProductCard';
import { Product } from '@/payload-types';
import React, { FC } from 'react';

interface IRelatedProducts{
    product : Product
}
const RelatedProducts:FC<IRelatedProducts> = ({product}) => {
    return (
        <>
              {product.recommendedProducts?.length && (
                <div className="px-6 py-8 bg-gray-50">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    С этим товаром берут
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {product.recommendedProducts.map((product) => (
                      <ProductCard product={product as Product} />
                    ))}
                  </div>
                </div>
              )}
        </>
    );
};

export default RelatedProducts;