import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { addToCart } from '@/store/slices/cartSlice'
import { toggleWishlist } from '@/store/slices/wishlistSlice'
import Rating from '@/components/common/Rating'
import { formatPrice } from '@/utils/helpers'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const { products: wishlistProducts } = useSelector((s) => s.wishlist)
  const isWishlisted = wishlistProducts.some((p) => p.id === product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { window.location.href = '/login'; return }
    dispatch(addToCart({ product_id: product.id, quantity: 1 }))
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { window.location.href = '/login'; return }
    dispatch(toggleWishlist(product.id))
  }

  return (
    <Link to={`/products/${product.slug}`} className="group card overflow-hidden block">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
        <img
          src={product.primary_image || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount_percentage > 0 && (
            <span className="badge bg-red-500 text-white">{product.discount_percentage}% OFF</span>
          )}
          {product.is_featured && (
            <span className="badge bg-primary text-white">Featured</span>
          )}
          {!product.in_stock && (
            <span className="badge bg-gray-700 text-white">Out of Stock</span>
          )}
        </div>

        {/* Actions overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleWishlist}
            className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            {isWishlisted
              ? <HeartSolidIcon className="w-4 h-4 text-red-500" />
              : <HeartIcon className="w-4 h-4 text-gray-600" />
            }
          </button>
        </div>

        {/* Add to cart */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent
                        translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="w-full py-2 bg-white text-dark text-sm font-semibold rounded-lg
                       hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
          >
            <ShoppingCartIcon className="w-4 h-4 inline mr-1" />
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-gray-500 mb-1">{product.category_name}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <Rating value={product.avg_rating} count={product.review_count} />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-bold text-primary">{formatPrice(product.effective_price)}</span>
          {product.discount_price && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
