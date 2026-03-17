import ProductCard from './ProductCard'
import { SkeletonCard } from '@/components/common/Loader'

export default function ProductGrid({ products, loading, columns = 4 }) {
  const colClass = {
    2: 'grid-cols-2 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-4`}>
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!products?.length) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">🛍️</p>
        <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
        <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className={`grid ${colClass} gap-4`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
