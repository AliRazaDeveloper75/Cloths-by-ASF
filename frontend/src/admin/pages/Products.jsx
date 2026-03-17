import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import api from '@/services/api'
import { formatPrice } from '@/utils/helpers'
import { PageLoader } from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async (p = 1, q = '') => {
    setLoading(true)
    try {
      const res = await api.get('/products/admin/products/', { params: { page: p, search: q } })
      setProducts(res.data.results ?? [])
      setTotalPages(Math.ceil((res.data.count ?? 0) / 12) || 1)
    } catch {
      toast.error('Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(1, '') }, [load])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    load(1, search)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    try {
      await api.delete(`/products/admin/products/${id}/`)
      toast.success('Product deleted')
      load(page, search)
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const toggleActive = async (product) => {
    try {
      await api.patch(`/products/admin/products/${product.id}/`, { is_active: !product.is_active })
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      )
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <>
      <Helmet><title>Products – Admin | Cloth by AFS</title></Helmet>

      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#f09c27] text-white text-sm font-semibold rounded-lg hover:bg-[#d4821a] transition-colors"
          >
            ＋ Add Product
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU, brand…"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1a1a2e] text-white text-sm font-semibold rounded-lg hover:bg-[#16213e] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10"><PageLoader /></div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-5xl">📦</span>
              <p className="mt-3 text-gray-500 font-medium">No products found</p>
              <Link to="/admin/products/new"
                className="mt-4 inline-block text-sm text-[#f09c27] hover:underline font-semibold">
                Add your first product →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Product', 'Category', 'Price', 'Stock', 'Active', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.primary_image || '/placeholder-product.jpg'}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                            onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
                          />
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.sku || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.category_name || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(p.effective_price ?? p.price)}
                        </span>
                        {p.discount_price && (
                          <span className="block text-xs text-gray-400 line-through">
                            {formatPrice(p.price)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold text-sm ${
                          p.stock === 0 ? 'text-red-500' :
                          p.stock < 10 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(p)}
                          className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none ${
                            p.is_active ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                            p.is_active ? 'translate-x-5' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => { setPage(p); load(p, search) }}
        />
      </div>
    </>
  )
}
