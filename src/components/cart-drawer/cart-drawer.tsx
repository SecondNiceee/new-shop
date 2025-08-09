'use client'

import React, { useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/entities/cart/cartStore'
import { Media } from '@/payload-types'

export default function CartDrawer() {
  const {
    isOpen,
    toggle,
    items,
    totalCount,
    totalPrice,
    remove,
    clear,
    loadServer,
  } = useCartStore()

  useEffect(() => {
    // Надо это делать только если есть юзер
    loadServer().catch(() => {})
  }, [loadServer])

  return (
    <Sheet open={isOpen} onOpenChange={toggle}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col h-[calc(100vh-8rem)]">
          {/* Items */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {items.length === 0 ? (
              <div className="text-sm text-gray-500">Ваша корзина пуста</div>
            ) : (
              items.map((it) => {
                const media = it.product.image as Media
                const price = it.product.price || 0
                const sum = price * it.quantity

                return (
                  <div
                    key={it.product.id}
                    className="grid grid-cols-[64px,1fr,auto] gap-3 border rounded-lg p-3 bg-gray-50 items-start"
                  >
                    {/* Image */}
                    <div className="relative w-16 h-16 overflow-hidden rounded-md bg-white">
                      <Image
                        width={64}
                        height={64}
                        src={
                          media?.url ||
                          '/placeholder.svg?height=64&width=64&query=product-thumbnail' ||
                          '/placeholder.svg'
                        }
                        alt={media?.alt || it.product.title}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <div
                            className="text-sm font-medium break-words whitespace-normal"
                            title={it.product.title}
                          >
                            {it.product.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {it.product.weight?.value} {it.product.weight?.unit}
                          </div>
                        </div>
                      </div>

                      {/* Price + Qty controls */}
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold">{price} ₽</div>
                        <div className="flex items-center gap-5">
                          <div
                            className="flex items-center gap-2"
                            role="group"
                            aria-label="Изменить количество в корзине"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full shadow-lg"
                              onClick={() => {}}
                              aria-label="Уменьшить количество"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-6 text-center text-sm">{it.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full shadow-xl"
                              onClick={() => {}}
                              aria-label="Увеличить количество"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 rounded-full shadow-xl"
                            onClick={() => remove(it.product.id)}
                            aria-label="Удалить из корзины"
                            title="Удалить"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Actions (right) */}
                    {/* <div className="flex flex-col justify-between items-end gap-2">
                      <div className="text-sm font-semibold whitespace-nowrap">{sum} ₽</div>
                    </div> */}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t pt-3 mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Товары ({totalCount})</span>
              <span className="text-base font-semibold">{totalPrice} ₽</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => clear()}>
                Очистить
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white">Оформить заказ</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
