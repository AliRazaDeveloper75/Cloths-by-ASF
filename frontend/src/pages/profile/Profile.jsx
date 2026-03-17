import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { updateProfile } from '@/store/slices/authSlice'
import api from '@/services/api'
import { formatPrice, formatDate, getOrderStatusColor } from '@/utils/helpers'
import { UserIcon, KeyIcon, MapPinIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'orders', label: 'My Orders', icon: ShoppingBagIcon },
  { id: 'password', label: 'Password', icon: KeyIcon },
  { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
]

export default function Profile() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const { register: regProfile, handleSubmit: handleProfile } = useForm({
    defaultValues: { first_name: user?.first_name, last_name: user?.last_name, phone: user?.phone },
  })
  const { register: regPass, handleSubmit: handlePass, reset: resetPass, watch } = useForm()
  const newPassword = watch('new_password')

  const onProfileSubmit = async (data) => {
    setLoading(true)
    await dispatch(updateProfile(data))
    setLoading(false)
  }

  const onPasswordSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/auth/change-password/', data)
      toast.success('Password changed successfully!')
      resetPass()
    } catch (err) {
      const errs = err.response?.data
      toast.error(errs?.old_password || errs?.detail || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet><title>My Profile – Cloth by AFS</title></Helmet>
      <div className="page-container max-w-4xl mx-auto">
        <h1 className="section-title mb-6">My Account</h1>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-48 shrink-0">
            {/* Avatar */}
            <div className="card p-4 text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-2">
                {user?.first_name?.[0]?.toUpperCase()}
              </div>
              <p className="font-medium text-sm">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>

            <nav className="space-y-1">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${tab === t.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <t.icon className="w-4 h-4" /> {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {tab === 'profile' && (
              <div className="card p-6">
                <h2 className="font-semibold mb-4">Personal Information</h2>
                <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input {...regProfile('first_name', { required: true })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input {...regProfile('last_name', { required: true })} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input value={user?.email} disabled className="input-field bg-gray-50 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input {...regProfile('phone')} className="input-field" placeholder="+92 300 1234567" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary px-6">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'password' && (
              <div className="card p-6">
                <h2 className="font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePass(onPasswordSubmit)} className="space-y-4 max-w-sm">
                  {[
                    { name: 'old_password', label: 'Current Password' },
                    { name: 'new_password', label: 'New Password' },
                    { name: 'new_password2', label: 'Confirm New Password',
                      validate: (v) => v === newPassword || 'Passwords do not match' },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium mb-1">{f.label}</label>
                      <input type="password"
                        {...regPass(f.name, { required: true, validate: f.validate })}
                        className="input-field" />
                    </div>
                  ))}
                  <button type="submit" disabled={loading} className="btn-primary px-6">
                    {loading ? 'Saving...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'orders' && <OrdersTab />}
            {tab === 'addresses' && <AddressesTab />}
          </div>
        </div>
      </div>
    </>
  )
}

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className={`text-2xl transition-colors ${s <= value ? 'text-[#f09c27]' : 'text-gray-300'}`}>
          ★
        </button>
      ))}
    </div>
  )
}

function ReviewForm({ productId, productName, onDone }) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/reviews/', { product: productId, rating, title, comment })
      toast.success('Review submitted!')
      onDone(true)
    } catch (err) {
      toast.error(err.response?.data?.product?.[0] || err.response?.data?.detail || 'Failed to submit review')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-2 bg-white border border-[#f09c27]/30 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-600">Review: <span className="text-gray-800">{productName}</span></p>
      <StarPicker value={rating} onChange={setRating} />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/40"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product…"
        rows={3}
        required
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/40 resize-none"
      />
      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="px-4 py-1.5 bg-[#f09c27] hover:bg-[#d4821a] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
          {saving ? 'Submitting…' : 'Submit Review'}
        </button>
        <button type="button" onClick={() => onDone(false)}
          className="px-4 py-1.5 border border-gray-300 text-gray-600 text-xs font-semibold rounded-lg hover:border-gray-400 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [reviewingItem, setReviewingItem] = useState(null) // key: `orderId-itemId`
  const [reviewed, setReviewed] = useState(new Set()) // set of product IDs already reviewed

  useEffect(() => {
    api.get('/orders/')
      .then((r) => setOrders(r.data?.results ?? r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cancelOrder = async (id) => {
    if (!window.confirm('Cancel this order?')) return
    try {
      const res = await api.post(`/orders/${id}/cancel/`)
      setOrders((prev) => prev.map((o) => o.id === id ? res.data : o))
      toast.success('Order cancelled')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Cannot cancel this order')
    }
  }

  if (loading) return <div className="py-10 text-center text-gray-400">Loading orders…</div>

  if (orders.length === 0) return (
    <div className="card p-10 text-center">
      <ShoppingBagIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="font-medium text-gray-500">No orders yet</p>
      <Link to="/products" className="mt-3 inline-block text-sm text-[#f09c27] hover:underline font-semibold">
        Start Shopping →
      </Link>
    </div>
  )

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const stepIdx = STATUS_STEPS.indexOf(order.status)
        const isExpanded = expanded === order.id
        return (
          <div key={order.id} className="card overflow-hidden">
            {/* Order header row */}
            <button
              type="button"
              onClick={() => setExpanded(isExpanded ? null : order.id)}
              className="w-full flex flex-wrap items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 font-mono text-sm">#{order.order_number}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getOrderStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    order.payment_method === 'cod' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {order.payment_method === 'cod' ? 'COD' : 'Online'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)} · {order.items?.length ?? 0} item(s)</p>
              </div>
              <span className="font-bold text-[#f09c27] text-sm">{formatPrice(order.total)}</span>
              <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
            </button>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">

                {/* Progress tracker */}
                {!['cancelled', 'refunded'].includes(order.status) && (
                  <div className="flex items-center justify-between">
                    {STATUS_STEPS.map((s, i) => (
                      <div key={s} className="flex flex-col items-center flex-1">
                        <div className="relative w-full flex items-center">
                          {i > 0 && <div className={`flex-1 h-1 ${i <= stepIdx ? 'bg-[#f09c27]' : 'bg-gray-200'}`} />}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 shrink-0
                            ${i <= stepIdx ? 'bg-[#f09c27] text-white' : 'bg-gray-200 text-gray-400'}`}>
                            {i < stepIdx ? '✓' : i + 1}
                          </div>
                          {i < STATUS_STEPS.length - 1 && <div className={`flex-1 h-1 ${i < stepIdx ? 'bg-[#f09c27]' : 'bg-gray-200'}`} />}
                        </div>
                        <span className={`text-[10px] mt-1 capitalize ${i <= stepIdx ? 'text-[#f09c27] font-medium' : 'text-gray-400'}`}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Items list */}
                <div className="space-y-2">
                  {order.items?.map((item) => {
                    const itemKey = `${order.id}-${item.id}`
                    const isReviewed = reviewed.has(item.product)
                    const isReviewing = reviewingItem === itemKey
                    return (
                      <div key={item.id}>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                          <img
                            src={item.product_image || '/placeholder-product.jpg'}
                            alt={item.product_name}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.product_name}</p>
                            {item.variant_info && <p className="text-xs text-gray-400">{item.variant_info}</p>}
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-bold text-gray-700">{formatPrice(item.line_total)}</span>
                            {order.status === 'delivered' && !isReviewed && !isReviewing && (
                              <button
                                onClick={() => setReviewingItem(itemKey)}
                                className="text-xs font-semibold text-[#f09c27] bg-[#f09c27]/10 hover:bg-[#f09c27]/20 px-2 py-1 rounded-lg transition-colors"
                              >
                                ★ Review
                              </button>
                            )}
                            {isReviewed && (
                              <span className="text-xs text-green-600 font-semibold">✓ Reviewed</span>
                            )}
                          </div>
                        </div>
                        {isReviewing && (
                          <ReviewForm
                            productId={item.product}
                            productName={item.product_name}
                            onDone={(submitted) => {
                              setReviewingItem(null)
                              if (submitted) setReviewed((prev) => new Set([...prev, item.product]))
                            }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Shipping + totals row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="font-semibold text-gray-700 mb-1.5">Shipping Address</p>
                    <p className="text-gray-600">{order.shipping_full_name}</p>
                    <p className="text-gray-500 text-xs">{order.shipping_phone}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {order.shipping_address_line1}, {order.shipping_city}, {order.shipping_state}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100 space-y-1.5">
                    <p className="font-semibold text-gray-700 mb-1.5">Order Summary</p>
                    <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                    <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{formatPrice(order.shipping_cost)}</span></div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600"><span>Discount</span><span>−{formatPrice(order.discount_amount)}</span></div>
                    )}
                    <div className="flex justify-between font-bold text-gray-800 border-t pt-1.5">
                      <span>Total</span><span className="text-[#f09c27]">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/orders/${order.id}`}
                    className="text-xs font-semibold text-[#f09c27] bg-[#f09c27]/10 hover:bg-[#f09c27]/20 px-3 py-1.5 rounded-lg transition-colors">
                    Full Details →
                  </Link>
                  {['pending', 'confirmed'].includes(order.status) && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function AddressesTab() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    api.get('/auth/addresses/').then((r) => setAddresses(r.data?.results ?? r.data ?? [])).finally(() => setLoading(false))
  }, [])

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/addresses/', data)
      setAddresses((prev) => [...prev, res.data])
      setShowForm(false)
      reset()
      toast.success('Address added!')
    } catch {
      toast.error('Failed to add address')
    }
  }

  const deleteAddress = async (id) => {
    await api.delete(`/auth/addresses/${id}/`)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    toast.info('Address removed')
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Saved Addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-outline text-sm px-4">+ Add New</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
          {[
            { name: 'full_name', label: 'Full Name', full: true },
            { name: 'phone', label: 'Phone' },
            { name: 'address_line1', label: 'Address', full: true },
            { name: 'city', label: 'City' },
            { name: 'state', label: 'State' },
            { name: 'postal_code', label: 'Postal Code' },
            { name: 'country', label: 'Country' },
          ].map((f) => (
            <div key={f.name} className={f.full ? 'col-span-2' : ''}>
              <label className="block text-xs font-medium mb-1">{f.label}</label>
              <input {...register(f.name, { required: true })}
                defaultValue={f.name === 'country' ? 'Pakistan' : ''}
                className="input-field text-sm" />
            </div>
          ))}
          <div className="col-span-2 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" {...register('is_default')} className="rounded text-primary" />
              Set as default
            </label>
          </div>
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="btn-primary text-sm px-4">Save Address</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className={`p-4 border-2 rounded-xl ${addr.is_default ? 'border-primary' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between">
              <div className="text-sm">
                <p className="font-medium">{addr.full_name} · {addr.phone}</p>
                <p className="text-gray-500">{addr.address_line1}, {addr.city}, {addr.state} {addr.postal_code}</p>
                {addr.is_default && <span className="badge bg-primary/10 text-primary mt-1">Default</span>}
              </div>
              <button onClick={() => deleteAddress(addr.id)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
            </div>
          </div>
        ))}
        {!loading && addresses.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">No saved addresses yet.</p>
        )}
      </div>
    </div>
  )
}

