import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import api from '@/services/api'
import { formatPrice, formatDate, getOrderStatusColor } from '@/utils/helpers'
import { PageLoader } from '@/components/common/Loader'

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    api.get(`/orders/${id}/`).then((r) => setOrder(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    setCancelling(true)
    try {
      const res = await api.post(`/orders/${id}/cancel/`)
      setOrder(res.data)
      toast.success('Order cancelled successfully')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Cannot cancel this order')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <div className="page-container"><PageLoader /></div>
  if (!order) return <div className="page-container text-center py-20"><p>Order not found</p></div>

  const stepIdx = STATUS_STEPS.indexOf(order.status)

  return (
    <>
      <Helmet><title>Order #{order.order_number} – Cloth by AFS</title></Helmet>
      <div className="page-container max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/orders" className="text-sm text-gray-500 hover:text-primary mb-1 block">← Back to Orders</Link>
            <h1 className="text-2xl font-heading font-bold">Order #{order.order_number}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge ${getOrderStatusColor(order.status)} text-sm`}>{order.status}</span>
            {['pending', 'confirmed'].includes(order.status) && (
              <button onClick={cancelOrder} disabled={cancelling}
                className="btn-ghost text-red-600 hover:bg-red-50 text-sm">
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Progress tracker */}
        {!['cancelled', 'refunded'].includes(order.status) && (
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex flex-col items-center flex-1">
                  <div className="relative w-full flex items-center">
                    {i > 0 && <div className={`flex-1 h-1 ${i <= stepIdx ? 'bg-primary' : 'bg-gray-200'}`} />}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10
                      ${i <= stepIdx ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {i < stepIdx ? '✓' : i + 1}
                    </div>
                    {i < STATUS_STEPS.length - 1 && <div className={`flex-1 h-1 ${i < stepIdx ? 'bg-primary' : 'bg-gray-200'}`} />}
                  </div>
                  <span className={`text-xs mt-1 capitalize ${i <= stepIdx ? 'text-primary font-medium' : 'text-gray-400'}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order info */}
          <div className="card p-5">
            <h3 className="font-semibold mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Order Date</span><span>{formatDate(order.created_at)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="capitalize">{order.payment_method}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment Status</span>
                <span className={order.is_paid ? 'text-green-600' : 'text-yellow-600'}>{order.is_paid ? 'Paid' : 'Pending'}</span>
              </div>
              {order.tracking_number && (
                <div className="flex justify-between"><span className="text-gray-500">Tracking</span><span className="font-mono">{order.tracking_number}</span></div>
              )}
            </div>
          </div>

          {/* Shipping address */}
          <div className="card p-5">
            <h3 className="font-semibold mb-3">Shipping Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">{order.shipping_full_name}</p>
              <p>{order.shipping_phone}</p>
              <p>{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
              <p>{order.shipping_country}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="card p-5 mb-6">
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.product_image || '/placeholder-product.jpg'} alt={item.product_name}
                  className="w-16 h-16 object-cover rounded-lg border" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product_name}</p>
                  {item.variant_info && <p className="text-xs text-gray-500">{item.variant_info}</p>}
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
                </div>
                <span className="font-bold text-sm">{formatPrice(item.line_total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="card p-5 max-w-sm ml-auto">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatPrice(order.shipping_cost)}</span></div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-600"><span>Discount ({order.coupon_code})</span><span>-{formatPrice(order.discount_amount)}</span></div>
            )}
            <hr />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span><span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
