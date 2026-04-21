import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid'
import { addToCart } from '@/store/slices/cartSlice'
import { toggleWishlist } from '@/store/slices/wishlistSlice'
import { formatPrice } from '@/utils/helpers'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(s => s.auth)
  const { products: wishlistProducts } = useSelector(s => s.wishlist)
  const isWishlisted = wishlistProducts.some(p => p.id === product.id)

  const handleAddToCart = e => {
    e.preventDefault()
    if (!isAuthenticated) { window.location.href = '/login'; return }
    dispatch(addToCart({ product_id: product.id, quantity: 1 }))
  }

  const handleToggleWishlist = e => {
    e.preventDefault()
    if (!isAuthenticated) { window.location.href = '/login'; return }
    dispatch(toggleWishlist(product.id))
  }

  const hasDiscount = product.discount_percentage > 0

  return (
    <Link to={`/products/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#f09c27]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      {/* ── Image ── */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-50 flex-shrink-0">
        <img
          src={product.primary_image || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
              -{product.discount_percentage}%
            </span>
          )}
          {product.is_featured && !hasDiscount && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg,#f09c27,#e07b00)' }}>
              ⭐ Featured
            </span>
          )}
          {!product.in_stock && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black text-white shadow-lg bg-gray-600">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist button — top right, always visible */}
        <button onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95"
          style={{ background: isWishlisted ? '#fff1f2' : 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
          {isWishlisted
            ? <HeartSolidIcon className="w-4 h-4 text-red-500" />
            : <HeartIcon className="w-4 h-4 text-gray-500" />
          }
        </button>

        {/* Add to Cart — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={handleAddToCart} disabled={!product.in_stock}
            className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{
              background: product.in_stock ? 'rgba(255,255,255,0.95)' : 'rgba(200,200,200,0.95)',
              color: product.in_stock ? '#1a1a2e' : '#666',
              backdropFilter: 'blur(8px)',
            }}>
            <ShoppingCartIcon className="w-4 h-4" style={{ color: product.in_stock ? '#f09c27' : '#999' }} />
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Category */}
        {product.category_name && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">{product.category_name}</p>
        )}

        {/* Name */}
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug mb-2 group-hover:text-[#f09c27] transition-colors flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avg_rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-3 h-3 ${i < Math.round(product.avg_rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
              ))}
            </div>
            {product.review_count > 0 && (
              <span className="text-[11px] text-gray-400">({product.review_count})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="text-base font-black" style={{ color: '#f09c27' }}>
            {formatPrice(product.effective_price)}
          </span>
          {hasDiscount && product.price && (
            <span className="text-xs text-gray-400 line-through font-medium">
              {formatPrice(product.price)}
            </span>
          )}
          {hasDiscount && (
            <span className="ml-auto text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
              Save {formatPrice(product.price - product.effective_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
