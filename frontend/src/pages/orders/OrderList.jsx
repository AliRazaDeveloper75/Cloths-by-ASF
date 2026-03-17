import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api from '@/services/api'
import { formatPrice, formatDate, getOrderStatusColor } from '@/utils/helpers'
import { PageLoader } from '@/components/common/Loader'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function OrderList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/').then((r) => setOrders(r.data.results || r.data))
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet><title>My Orders – Cloth by AFS</title></Helmet>
      <div className="page-container">
        <h1 className="section-title mb-6">My Orders</h1>

        {loading ? <PageLoader /> : orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <Link to="/products" className="btn-primary mt-4 inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900">#{order.order_number}</span>
                      <span className={`badge ${getOrderStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)} · {order.items?.length} items</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-bold">{formatPrice(order.total)}</span>
                    <Link to={`/orders/${order.id}`} className="btn-outline text-sm px-4 py-2">View Details</Link>
                  </div>
                </div>

                {/* Item thumbnails */}
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {order.items?.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex-shrink-0">
                      <img src={item.product_image || '/placeholder-product.jpg'} alt={item.product_name}
                        className="w-12 h-12 object-cover rounded-lg border" />
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
