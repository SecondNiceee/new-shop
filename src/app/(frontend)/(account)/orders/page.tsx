'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import type { Media } from '@/payload-types'
import { toast } from 'sonner'
import { useOrdersStore } from '@/entities/orders/ordersStore'
import { formatDate } from '@/utils/formatData'
import { getFullAddress } from '@/utils/getFullAddress'

const statusConfig = {
  pending: { label: 'Ожидает обработки', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Подтвержден', color: 'bg-blue-500', icon: CheckCircle },
  preparing: { label: 'Готовится', color: 'bg-orange-500', icon: Package },
  delivering: { label: 'В доставке', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Доставлен', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'Отменен', color: 'bg-red-500', icon: XCircle },
}

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { orders, loading, error, loadOrders, clearOrders, refreshOrder, refreshingOrderId } =
    useOrdersStore()

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [expandedAddresses, setExpandedAddresses] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadOrders()
  }, [user, clearOrders])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // функции для управления раскрытием
  const toggleItems = (orderId: number) => {
    setExpandedItems((prev) => ({ ...prev, [orderId]: !prev[orderId] }))
  }

  const handleRefreshOrder = async (orderId: number) => {
    await refreshOrder(orderId)
    toast.success('Статус заказа обновлен')
  }

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full">
          <Package className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          История заказов
        </h2>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Заказов пока нет</h3>
            <p className="text-gray-500 text-center mb-6">
              Когда вы сделаете первый заказ, он появится здесь
            </p>
            <Button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
            >
              Перейти к покупкам
            </Button>
          </div>
        ) : (
          orders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon
            const isItemsExpanded = expandedItems[order.id] || false
            const isAddressExpanded = expandedAddresses[order.id] || false
            const isRefreshing = refreshingOrderId === order.id

            return (
              <Card
                key={order.id}
                className="shadow-lg border-0 bg-white/70 backdrop-blur-sm overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <StatusIcon className="h-5 w-5 text-gray-600" />
                      Заказ #{order.orderNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${status.color} text-white text-center hover:${status.color}`}
                      >
                        {status.label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefreshOrder(order.id)}
                        disabled={isRefreshing}
                        className="h-8 w-8 p-0"
                      >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items?.slice(0, isItemsExpanded ? undefined : 2).map((item, index) => {
                      const product = item.product as any
                      const media = product?.image as Media

                      return (
                        <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="relative w-12 h-12 overflow-hidden rounded-lg bg-white">
                            <Image
                              width={48}
                              height={48}
                              src={
                                media?.url ||
                                '/placeholder.svg?height=48&width=48&query=product-thumbnail'
                              }
                              alt={media?.alt || product?.title || 'Товар'}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {product?.title || 'Товар'}
                            </h4>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">
                                {item.quantity} × {item.price} ₽
                              </span>
                              <span className="font-semibold text-sm">
                                {(item.price || 0) * (item.quantity || 0)} ₽
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {order.items && order.items.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItems(order.id)}
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        {isItemsExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Скрыть товары
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Просмотреть остальные товары ({order.items.length - 2})
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <h4 className="font-medium text-sm text-gray-900">Адрес доставки:</h4>
                    </div>
                    <p className="text-sm text-gray-600">{getFullAddress(order.deliveryAddress)}</p>
                    {order.deliveryAddress?.comment && isAddressExpanded && (
                      <p className="text-xs text-gray-500 mt-1">
                        💬 {order.deliveryAddress.comment}
                      </p>
                    )}
                  </div>

                  {/* Order Total */}
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span>Товары:</span>
                      <span>{(order.totalAmount || 0) - (order.deliveryFee || 0)} ₽</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span>Доставка:</span>
                      <span>{order.deliveryFee} ₽</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between items-center font-bold">
                        <span>Итого:</span>
                        <span className="text-lg text-emerald-600">{order.totalAmount} ₽</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
