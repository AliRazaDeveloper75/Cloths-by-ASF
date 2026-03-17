import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCartIcon, HeartIcon, TruckIcon, ArrowPathIcon, BoltIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import api from '@/services/api'
import { addToCart } from '@/store/slices/cartSlice'
import { toggleWishlist } from '@/store/slices/wishlistSlice'
import Rating from '@/components/common/Rating'
import { PageLoader } from '@/components/common/Loader'
import { formatPrice, formatDate } from '@/utils/helpers'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const { products: wishlistProducts } = useSelector((s) => s.wishlist)

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)

  const isWishlisted = wishlistProducts.some((p) => p.id === product?.id)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [pRes, rRes] = await Promise.all([
          api.get(`/products/${slug}/`),
          api.get(`/reviews/products/${slug}/reviews/`),
        ])
        setProduct(pRes.data)
        setReviews(rRes.data.results || rRes.data)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) return <div className="page-container"><PageLoader /></div>
  if (!product) return <div className="page-container text-center py-20"><h2>Product not found</h2></div>

  const primaryImg = product.images?.[selectedImage]?.image || '/placeholder-product.jpg'
  const effectivePrice = product.discount_price || product.price

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate('/login'); return }
    dispatch(addToCart({
      product_id: product.id,
      variant_id: selectedVariant?.id || null,
      quantity,
    }))
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    await dispatch(addToCart({
      product_id: product.id,
      variant_id: selectedVariant?.id || null,
      quantity,
    }))
    navigate('/checkout')
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { window.location.href = '/login'; return }
    setReviewLoading(true)
    try {
      const res = await api.post('/reviews/', { ...reviewForm, product: product.id })
      setReviews((prev) => [res.data, ...prev])
      setReviewForm({ rating: 5, title: '', comment: '' })
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{product.name} – Cloth by AFS</title>
        <meta name="description" content={product.short_description || product.description?.slice(0, 150)} />
      </Helmet>

      <div className="page-container">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link> {' / '}
          <Link to="/products" className="hover:text-primary">Products</Link> {' / '}
          {product.category && <Link to={`/products?category=${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>}
          {' / '}<span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div className="flex flex-col gap-3">
            {/* Main image — contains full image regardless of aspect ratio */}
            <div className="w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center"
              style={{ minHeight: '360px', maxHeight: '560px' }}>
              <img
                src={primaryImg}
                alt={product.name}
                className="w-full h-full object-contain"
                style={{ maxHeight: '560px' }}
              />
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-gray-50 flex items-center justify-center
                      ${i === selectedImage ? 'border-[#f09c27] ring-2 ring-[#f09c27]/30' : 'border-gray-200 hover:border-gray-400'}`}
                  >
                    <img src={img.image} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.category?.name} · {product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <Rating value={product.avg_rating} count={product.review_count} size="md" />
              <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">{formatPrice(effectivePrice)}</span>
              {product.discount_price && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="badge bg-red-100 text-red-700">{product.discount_percentage}% OFF</span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-medium text-gray-700 mb-2">Select Option</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button key={v.id} onClick={() => setSelectedVariant(v)}
                      disabled={v.stock === 0}
                      className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all
                        ${selectedVariant?.id === v.id ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary'}
                        ${v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                      {v.value} {v.price_adjustment > 0 && `(+${formatPrice(v.price_adjustment)})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-lg font-bold">−</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-lg font-bold">+</button>
              </div>
              <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'} font-medium`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} disabled={!product.in_stock}
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-[#f09c27] text-[#f09c27] font-semibold rounded-lg hover:bg-[#f09c27]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingCartIcon className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={!product.in_stock}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#f09c27] hover:bg-[#d4821a] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <BoltIcon className="w-5 h-5" /> Buy Now
              </button>
              <button onClick={() => isAuthenticated && dispatch(toggleWishlist(product.id))}
                className="w-12 h-12 border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-red-300 transition-colors shrink-0">
                {isWishlisted ? <HeartSolidIcon className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6 text-gray-600" />}
              </button>
            </div>

            {/* Info chips */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
              {[
                { icon: <TruckIcon className="w-5 h-5" />, text: 'Free delivery over PKR 2,000' },
                { icon: <ArrowPathIcon className="w-5 h-5" />, text: '7-day easy return' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-primary">{item.icon}</span> {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex gap-6">
            {['description', 'reviews'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}>
                {tab} {tab === 'reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'description' ? (
          <div className="prose prose-sm max-w-none text-gray-700">
            <p>{product.description}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Review form */}
            {isAuthenticated && (
              <form onSubmit={handleSubmitReview} className="card p-6">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <Rating value={reviewForm.rating} size="lg" interactive onChange={(r) => setReviewForm((f) => ({ ...f, rating: r }))} />
                <input type="text" placeholder="Review title (optional)" value={reviewForm.title}
                  onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                  className="input-field mt-3" />
                <textarea rows={3} placeholder="Share your experience..." value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  className="input-field mt-3" required />
                <button type="submit" disabled={reviewLoading} className="btn-primary mt-3">
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                      {review.user_name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{review.user_name}</span>
                        <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                      </div>
                      <Rating value={review.rating} size="sm" />
                      {review.title && <p className="font-medium text-sm mt-1">{review.title}</p>}
                      <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  )
}
