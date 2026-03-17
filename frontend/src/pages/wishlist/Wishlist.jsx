import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { toggleWishlist } from '@/store/slices/wishlistSlice'
import { addToCart } from '@/store/slices/cartSlice'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '@/utils/helpers'

export default function Wishlist() {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((s) => s.wishlist)

  return (
    <>
      <Helmet><title>My Wishlist – Cloth by AFS</title></Helmet>
      <div className="page-container">
        <h1 className="section-title mb-6">My Wishlist ({products.length} items)</h1>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love and shop later!</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="card overflow-hidden group">
                <div className="relative aspect-[3/4]">
                  <img src={product.primary_image || '/placeholder-product.jpg'} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button
                    onClick={() => dispatch(toggleWishlist(product.id))}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-50 rounded-full flex items-center justify-center hover:bg-red-100"
                  >
                    <HeartIcon className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                </div>
                <div className="p-3">
                  <Link to={`/products/${product.slug}`}
                    className="text-sm font-medium text-gray-800 hover:text-primary line-clamp-2">
                    {product.name}
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary font-bold text-sm">{formatPrice(product.effective_price)}</span>
                    <button
                      onClick={() => dispatch(addToCart({ product_id: product.id, quantity: 1 }))}
                      disabled={!product.in_stock}
                      className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-40"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
