import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api from '@/services/api'
import { formatPrice, formatDate, getOrderStatusColor } from '@/utils/helpers'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    api.get(`/orders/${id}/`).then((r) => setOrder(r.data)).catch(() => {})
  }, [id])

  return (
    <>
      <Helmet><title>Order Placed! – Cloth by AFS</title></Helmet>
      <div className="page-container max-w-2xl mx-auto text-center py-12">
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-600 mb-2">
          Thank you for your order. We'll send a confirmation email shortly.
        </p>
        {order && <p className="text-primary font-bold text-lg">Order #{order.order_number}</p>}

        {order && (
          <div className="card p-6 mt-8 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div><p className="text-gray-500">Order Number</p><p className="font-bold">{order.order_number}</p></div>
              <div><p className="text-gray-500">Date</p><p className="font-medium">{formatDate(order.created_at)}</p></div>
              <div><p className="text-gray-500">Payment</p><p className="font-medium capitalize">{order.payment_method}</p></div>
              <div><p className="text-gray-500">Status</p>
                <span className={`badge ${getOrderStatusColor(order.status)}`}>{order.status}</span>
              </div>
            </div>
            <hr className="my-4" />
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.line_total)}</span>
                </div>
              ))}
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center mt-8">
          <Link to="/orders" className="btn-primary">View My Orders</Link>
          <Link to="/products" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </>
  )
}
