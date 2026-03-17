import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { updateCartItem, removeCartItem, clearCart } from '@/store/slices/cartSlice'
import { TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '@/utils/helpers'

export default function Cart() {
  const dispatch = useDispatch()
  const { items, subtotal, loading } = useSelector((s) => s.cart)
  const { isAuthenticated } = useSelector((s) => s.auth)

  if (!isAuthenticated) {
    return (
      <div className="page-container text-center py-20">
        <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Sign in to view your cart or start shopping!</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="page-container text-center py-20">
        <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse our collection and add something you love!</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    )
  }

  const shippingCost = subtotal >= 2000 ? 0 : 200
  const total = Number(subtotal) + shippingCost

  return (
    <>
      <Helmet><title>Shopping Cart – Cloth by AFS</title></Helmet>
      <div className="page-container">
        <h1 className="section-title mb-6">Shopping Cart ({items.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 flex gap-4">
                <img
                  src={item.product_detail?.primary_image || '/placeholder-product.jpg'}
                  alt={item.product_detail?.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product_detail?.slug}`}
                    className="font-medium text-gray-900 hover:text-primary line-clamp-2 text-sm">
                    {item.product_detail?.name}
                  </Link>
                  {item.variant && <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>}
                  <p className="text-primary font-bold mt-1">{formatPrice(item.unit_price)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => dispatch(item.quantity > 1
                          ? updateCartItem({ itemId: item.id, quantity: item.quantity - 1 })
                          : removeCartItem(item.id)
                        )}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-lg leading-none"
                      >−</button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateCartItem({ itemId: item.id, quantity: item.quantity + 1 }))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-lg leading-none"
                      >+</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{formatPrice(item.line_total)}</span>
                      <button onClick={() => dispatch(removeCartItem(item.id))}
                        className="text-red-400 hover:text-red-600 p-1">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => dispatch(clearCart())}
              className="text-sm text-red-500 hover:underline flex items-center gap-1">
              <TrashIcon className="w-4 h-4" /> Clear Cart
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-gray-400">Add {formatPrice(2000 - subtotal)} more for free shipping</p>
                )}
                <hr />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center block mt-6 py-3">
                Proceed to Checkout
              </Link>
              <Link to="/products" className="btn-ghost w-full text-center block mt-2 text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
