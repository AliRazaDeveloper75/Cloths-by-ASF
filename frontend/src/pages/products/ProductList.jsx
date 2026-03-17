import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api from '@/services/api'
import ProductGrid from '@/components/product/ProductGrid'
import ProductFilters from '@/components/product/ProductFilters'
import Pagination from '@/components/common/Pagination'
import { DEMO_PRODUCTS } from '@/data/demoProducts'

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ count: 0, totalPages: 1, currentPage: 1 })

  const getFilters = useCallback(() => ({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    in_stock: searchParams.get('in_stock') || '',
    is_featured: searchParams.get('is_featured') || '',
    ordering: searchParams.get('ordering') || '-created_at',
    page: parseInt(searchParams.get('page') || '1'),
  }), [searchParams])

  const [filters, setFilters] = useState(getFilters)

  useEffect(() => {
    setFilters(getFilters())
  }, [getFilters])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const params = {}
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
      try {
        const res = await api.get('/products/', { params })
        const data = res.data
        const results = data.results || []
        setProducts(results.length ? results : DEMO_PRODUCTS)
        setPagination({
          count: results.length ? data.count : DEMO_PRODUCTS.length,
          totalPages: results.length ? Math.ceil(data.count / 12) : 1,
          currentPage: filters.page,
        })
      } catch {
        setProducts(DEMO_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    const params = {}
    Object.entries(newFilters).forEach(([k, v]) => { if (v && v !== '1') params[k] = v })
    if (newFilters.page > 1) params.page = newFilters.page
    setSearchParams(params)
  }

  return (
    <>
      <Helmet>
        <title>Shop All Products – Cloth by AFS</title>
      </Helmet>

      <div className="page-container">
        {/* Header */}
        <div className="mb-6">
          <h1 className="section-title">
            {filters.category ? filters.category.replace(/-/g, ' ') : filters.search ? `Search: "${filters.search}"` : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.count} products found</p>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          <ProductFilters filters={filters} onChange={handleFilterChange} />

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter + sort row */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <ProductFilters filters={filters} onChange={handleFilterChange} />
              <span className="text-sm text-gray-500">{pagination.count} items</span>
            </div>

            <ProductGrid products={products} loading={loading} />
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(p) => handleFilterChange({ ...filters, page: p })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
