import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import api from '@/services/api'
import { formatPrice, formatDate, getOrderStatusColor } from '@/utils/helpers'
import { PageLoader } from '@/components/common/Loader'

const STATUS_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export default function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')
  const [trackingNo, setTrackingNo] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    api.get(`/orders/admin/${id}/`)
      .then((r) => {
        setOrder(r.data)
        setNewStatus(r.data.status)
        setTrackingNo(r.data.tracking_number ?? '')
      })
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdateStatus = async () => {
    setUpdating(true)
    try {
      const res = await api.patch(`/orders/admin/${id}/status/`, {
        status: newStatus,
        tracking_number: trackingNo,
      })
      setOrder(res.data)
      toast.success('Order status updated!')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <PageLoader />
  if (!order) return <div className="text-center py-16 text-gray-500">Order not found</div>

  return (
    <>
      <Helmet><title>Order #{order.order_number} – Admin</title></Helmet>

      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">←</button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Order #{order.order_number}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.created_at)}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize ${getOrderStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Items + Status update */}
          <div className="lg:col-span-2 space-y-5">
            {/* Order Items */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-4">Order Items</h2>
              <div className="space-y-3">
                {(order.items ?? []).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                    {item.product_image
                      ? <img src={item.product_image} alt={item.product_name} className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                      : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">👕</div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.product_name}</p>
                      {item.variant_info && <p className="text-xs text-gray-400">{item.variant_info}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-900">{formatPrice(item.line_total)}</p>
                      <p className="text-xs text-gray-400">{formatPrice(item.unit_price)} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Totals */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                    <span>−{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{Number(order.shipping_cost) === 0 ? 'Free' : formatPrice(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
                  <span>Total</span>
                  <span className="text-[#f09c27]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-4">Update Status</h2>
              {/* Progress */}
              <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
                {STATUS_FLOW.map((s, i) => {
                  const curIdx = STATUS_FLOW.indexOf(order.status)
                  const done = i < curIdx
                  const active = i === curIdx
                  return (
                    <div key={s} className="flex items-center gap-1 shrink-0">
                      <div className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${active ? 'bg-[#f09c27] text-white' : done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {s}
                      </div>
                      {i < STATUS_FLOW.length - 1 && <span className={`text-xs ${done ? 'text-green-400' : 'text-gray-300'}`}>→</span>}
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">New Status</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50">
                    {['pending','confirmed','processing','shipped','delivered','cancelled','refunded'].map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Tracking Number</label>
                  <input value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)}
                    placeholder="e.g. TCS-12345678"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50" />
                </div>
              </div>
              <button onClick={handleUpdateStatus} disabled={updating || newStatus === order.status}
                className="mt-4 px-6 py-2.5 bg-[#f09c27] hover:bg-[#d4821a] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {updating ? 'Updating…' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Right: Customer + Payment + Shipping */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-3">Customer</h2>
              <p className="font-medium text-gray-900">{order.user_name ?? '—'}</p>
              <p className="text-sm text-gray-500">{order.user_email ?? '—'}</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-3">Shipping Address</h2>
              <div className="text-sm text-gray-600 space-y-0.5">
                <p className="font-medium text-gray-900">{order.shipping_full_name}</p>
                <p>{order.shipping_phone}</p>
                <p>{order.shipping_address_line1}</p>
                {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
                <p>{order.shipping_country}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-3">Payment</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${order.payment_method === 'cod' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment</span>
                  <span className={`font-semibold text-xs ${order.is_paid ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.is_paid ? '✓ Paid' : order.payment_method === 'cod' ? '⏳ Collect on Delivery' : '⏳ Pending'}
                  </span>
                </div>
                {order.tracking_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tracking</span>
                    <span className="font-mono text-xs font-semibold">{order.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>

            {order.notes && (
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <h2 className="font-semibold text-yellow-800 mb-1.5 text-sm">Customer Note</h2>
                <p className="text-sm text-yellow-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
