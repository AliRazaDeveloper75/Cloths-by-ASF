import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '@/services/api'
import { resetCart } from '@/store/slices/cartSlice'
import { formatPrice } from '@/utils/helpers'
import { TagIcon, CheckCircleIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline'

const STEPS = ['Shipping', 'Payment', 'Review']

// Cash on Delivery is the primary/default payment method.
// Online payment via Stripe is only shown if VITE_STRIPE_ENABLED=true in .env
const STRIPE_ENABLED = import.meta.env.VITE_STRIPE_ENABLED === 'true'

export default function Checkout() {
  const navigate   = useNavigate()
  const dispatch   = useDispatch()
  const { items, subtotal } = useSelector((s) => s.cart)

  const [step, setStep]             = useState(0)
  const [addresses, setAddresses]   = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [useNewAddress, setUseNewAddress]     = useState(false)
  // COD is always the default — online is optional
  const [paymentMethod, setPaymentMethod]     = useState('cod')
  const [coupon, setCoupon]                   = useState('')
  const [couponData, setCouponData]           = useState(null)
  const [couponLoading, setCouponLoading]     = useState(false)
  const [placing, setPlacing]                 = useState(false)

  const { register, handleSubmit, formState: { errors }, trigger } = useForm()

  useEffect(() => {
    api.get('/auth/addresses/')
      .then((r) => {
        const list = r.data?.results ?? r.data ?? []
        setAddresses(list)
        const def = list.find((a) => a.is_default)
        if (def) { setSelectedAddress(def); setUseNewAddress(false) }
        else if (list.length === 0) setUseNewAddress(true)
      })
      .catch(() => setUseNewAddress(true))
  }, [])

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const shippingCost    = Number(subtotal) >= 2000 ? 0 : 200
  const discountAmount  = Number(couponData?.discount_amount || 0)
  const total           = Number(subtotal) + shippingCost - discountAmount

  // ── Coupon ────────────────────────────────────────────────────────────────
  const applyCoupon = async () => {
    if (!coupon.trim()) return
    setCouponLoading(true)
    try {
      const res = await api.post('/coupons/validate/', { code: coupon.trim(), subtotal })
      setCouponData({ ...res.data, code: coupon.trim() })
      toast.success(`Coupon applied! You save ${formatPrice(res.data.discount_amount)}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid coupon code')
      setCouponData(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => { setCoupon(''); setCouponData(null) }

  // ── Step navigation ───────────────────────────────────────────────────────
  const goToPayment = async () => {
    // If using new address form, validate the fields first
    if (useNewAddress) {
      const valid = await trigger([
        'full_name','phone','address_line1','city','state','postal_code',
      ])
      if (!valid) return
    }
    setStep(1)
  }

  // ── Place order ───────────────────────────────────────────────────────────
  const placeOrder = async (formData) => {
    setPlacing(true)
    try {
      const payload = {
        payment_method: paymentMethod,
        coupon_code: couponData?.code || '',
      }

      if (!useNewAddress && selectedAddress) {
        payload.shipping_address_id = selectedAddress.id
      } else {
        Object.assign(payload, {
          shipping_full_name:    formData.full_name,
          shipping_phone:        formData.phone,
          shipping_address_line1: formData.address_line1,
          shipping_address_line2: formData.address_line2 || '',
          shipping_city:         formData.city,
          shipping_state:        formData.state,
          shipping_postal_code:  formData.postal_code,
          shipping_country:      formData.country || 'Pakistan',
        })
      }

      const res = await api.post('/orders/place/', payload)
      const order = res.data

      if (paymentMethod === 'cod') {
        // COD — order is confirmed immediately, cart already cleared on backend
        dispatch(resetCart())
        toast.success('Order placed! We will call you to confirm delivery.')
        navigate(`/order-success/${order.id}`)
      } else {
        // Online — backend keeps cart; redirect to payment page
        navigate(`/checkout/pay/${order.id}`)
      }
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'object') {
        // Show first field error
        const msg = Object.values(data)[0]
        toast.error(Array.isArray(msg) ? msg[0] : msg)
      } else {
        toast.error('Failed to place order. Please try again.')
      }
    } finally {
      setPlacing(false)
    }
  }

  // ── UI helpers ────────────────────────────────────────────────────────────
  const addressCard = (addr, selected, onClick) => (
    <button type="button" key={addr.id} onClick={onClick}
      className={`w-full text-left p-4 border-2 rounded-xl transition-all
        ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-sm">{addr.full_name}</p>
          <p className="text-sm text-gray-600">{addr.phone}</p>
          <p className="text-sm text-gray-500 mt-1">
            {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}<br />
            {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
          </p>
        </div>
        {selected && <CheckCircleIcon className="w-5 h-5 text-primary shrink-0" />}
      </div>
    </button>
  )

  return (
    <>
      <Helmet><title>Checkout – Cloth by AFS</title></Helmet>

      <div className="page-container py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                ${i < step  ? 'bg-primary border-primary text-white'
                : i === step ? 'border-primary text-primary bg-white'
                             : 'border-gray-300 text-gray-400 bg-white'}`}>
                {i < step ? <CheckCircleIcon className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block
                ${i <= step ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
              {i < STEPS.length - 1 && (
                <div className={`w-10 sm:w-16 h-0.5 mx-2 sm:mx-3 transition-colors
                  ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(placeOrder)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Steps ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">

              {/* STEP 0 — Shipping Address */}
              {step === 0 && (
                <div className="card p-6">
                  <h2 className="font-heading font-semibold text-xl mb-5 flex items-center gap-2">
                    <TruckIcon className="w-5 h-5 text-primary" /> Shipping Address
                  </h2>

                  {/* Saved addresses */}
                  {addresses.length > 0 && !useNewAddress && (
                    <div className="space-y-3 mb-5">
                      {addresses.map((addr) =>
                        addressCard(addr, selectedAddress?.id === addr.id, () => {
                          setSelectedAddress(addr); setUseNewAddress(false)
                        })
                      )}
                      <button type="button"
                        onClick={() => { setSelectedAddress(null); setUseNewAddress(true) }}
                        className="text-sm text-primary hover:underline font-medium">
                        + Use a different address
                      </button>
                    </div>
                  )}

                  {/* New address form */}
                  {useNewAddress && (
                    <>
                      {addresses.length > 0 && (
                        <button type="button" onClick={() => { setUseNewAddress(false); setSelectedAddress(addresses.find(a => a.is_default) || addresses[0]) }}
                          className="text-sm text-primary hover:underline font-medium mb-4 block">
                          ← Use saved address
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: 'full_name',    label: 'Full Name',           required: true },
                          { name: 'phone',         label: 'Phone Number',        required: true },
                          { name: 'address_line1', label: 'Street Address',      required: true, full: true },
                          { name: 'address_line2', label: 'Apt / Suite (optional)', full: true },
                          { name: 'city',          label: 'City',                required: true },
                          { name: 'state',         label: 'State / Province',    required: true },
                          { name: 'postal_code',   label: 'Postal Code',         required: true },
                          { name: 'country',       label: 'Country',             required: false },
                        ].map((f) => (
                          <div key={f.name} className={f.full ? 'md:col-span-2' : ''}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}
                            </label>
                            <input
                              {...register(f.name, { required: f.required ? `${f.label} is required` : false })}
                              defaultValue={f.name === 'country' ? 'Pakistan' : ''}
                              className={`input-field ${errors[f.name] ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                            />
                            {errors[f.name] && (
                              <p className="text-red-500 text-xs mt-1">{errors[f.name].message}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <button type="button" onClick={goToPayment}
                    className="btn-primary mt-6 px-10 py-3">
                    Continue to Payment →
                  </button>
                </div>
              )}

              {/* STEP 1 — Payment Method */}
              {step === 1 && (
                <div className="card p-6">
                  <h2 className="font-heading font-semibold text-xl mb-5 flex items-center gap-2">
                    <CreditCardIcon className="w-5 h-5 text-primary" /> Payment Method
                  </h2>

                  <div className="space-y-3">
                    {/* ── Cash on Delivery (PRIMARY) ── */}
                    <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                      ${paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" className="mt-1" checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💵</span>
                          <div>
                            <p className="font-semibold text-sm">Cash on Delivery</p>
                            <p className="text-xs text-gray-500">Pay when your order arrives at your door — no card needed</p>
                          </div>
                          {/* Recommended badge */}
                          <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full shrink-0">
                            Recommended
                          </span>
                        </div>
                        {paymentMethod === 'cod' && (
                          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                            ✓ Your order will be confirmed immediately. Keep cash ready at the time of delivery.
                          </div>
                        )}
                      </div>
                    </label>

                    {/* ── Online Payment (OPTIONAL) — only shown if Stripe is enabled ── */}
                    {STRIPE_ENABLED && (
                      <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${paymentMethod === 'online'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" className="mt-1" checked={paymentMethod === 'online'}
                          onChange={() => setPaymentMethod('online')} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">💳</span>
                            <div>
                              <p className="font-semibold text-sm">Online Payment</p>
                              <p className="text-xs text-gray-500">Pay securely with credit / debit card via Stripe</p>
                            </div>
                          </div>
                          {paymentMethod === 'online' && (
                            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                              ✓ You will be taken to the secure payment page after reviewing your order.
                            </div>
                          )}
                        </div>
                      </label>
                    )}
                  </div>

                  {/* Coupon */}
                  <div className="mt-6 pt-5 border-t">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Have a coupon?</p>
                    {couponData ? (
                      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-700">{couponData.code}</p>
                          <p className="text-xs text-green-600">You save {formatPrice(discountAmount)}</p>
                        </div>
                        <button type="button" onClick={removeCoupon}
                          className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                          placeholder="PROMO CODE"
                          className="input-field flex-1 uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                        />
                        <button type="button" onClick={applyCoupon} disabled={couponLoading || !coupon.trim()}
                          className="btn-outline px-5 flex items-center gap-1 disabled:opacity-50">
                          <TagIcon className="w-4 h-4" />
                          {couponLoading ? '...' : 'Apply'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep(0)} className="btn-outline px-6 py-2.5">← Back</button>
                    <button type="button" onClick={() => setStep(2)} className="btn-primary flex-1 py-2.5">
                      Review Order →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 — Review & Place */}
              {step === 2 && (
                <div className="card p-6">
                  <h2 className="font-heading font-semibold text-xl mb-5">Review & Place Order</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                        <img
                          src={item.product_detail?.primary_image || '/placeholder-product.jpg'}
                          className="w-14 h-14 object-cover rounded-lg bg-gray-100"
                          alt={item.product_detail?.name}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.product_detail?.name}</p>
                          {item.variant_info && (
                            <p className="text-xs text-gray-400">{item.variant_info}</p>
                          )}
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-800 shrink-0">{formatPrice(item.line_total)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Payment summary row */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-5 flex items-center gap-3">
                    <span className="text-2xl">{paymentMethod === 'cod' ? '💵' : '💳'}</span>
                    <div>
                      <p className="text-sm font-semibold">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {paymentMethod === 'cod'
                          ? 'Pay when your order arrives'
                          : 'Complete payment on the next page'}
                      </p>
                    </div>
                    <button type="button" onClick={() => setStep(1)}
                      className="ml-auto text-xs text-primary hover:underline font-medium">Change</button>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline px-6 py-2.5">← Back</button>
                    <button type="submit" disabled={placing} className="btn-primary flex-1 py-3 text-base font-semibold">
                      {placing
                        ? 'Placing Order...'
                        : paymentMethod === 'cod'
                          ? `Place Order – ${formatPrice(total)}`
                          : `Proceed to Pay – ${formatPrice(total)}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Order Summary ────────────────────────────────────── */}
            <div>
              <div className="card p-5 sticky top-24">
                <h3 className="font-heading font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                      {shippingCost === 0 ? '🎉 Free' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon discount</span>
                      <span className="font-medium">−{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  {shippingCost === 0 && Number(subtotal) >= 2000 && (
                    <p className="text-xs text-green-600 bg-green-50 rounded-lg px-2 py-1">
                      ✓ Free shipping on orders over PKR 2,000
                    </p>
                  )}
                  {shippingCost > 0 && (
                    <p className="text-xs text-gray-400">
                      Add {formatPrice(2000 - Number(subtotal))} more for free shipping
                    </p>
                  )}

                  <hr className="my-1" />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary text-lg">{formatPrice(total)}</span>
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800 flex gap-2">
                      <span>💵</span>
                      <span>You will pay <strong>{formatPrice(total)}</strong> cash on delivery</span>
                    </div>
                  )}
                </div>

                {/* Security badges */}
                <div className="mt-5 pt-4 border-t flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span>🔒 Secure Checkout</span>
                  <span>📦 Fast Delivery</span>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </>
  )
}
