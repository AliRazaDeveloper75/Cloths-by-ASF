import { useState, useEffect } from 'react'
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'
import api from '@/services/api'

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
]

export default function ProductFilters({ filters, onChange }) {
  const [categories, setCategories] = useState([])
  const [showMobile, setShowMobile] = useState(false)

  useEffect(() => {
    api.get('/products/categories/').then((r) => setCategories(r.data?.results ?? r.data ?? [])).catch(() => {})
  }, [])

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 })
  }

  const clearAll = () => {
    onChange({ page: 1 })
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h4 className="font-semibold text-sm text-gray-800 mb-2">Sort By</h4>
        <select
          value={filters.ordering || '-created_at'}
          onChange={(e) => handleChange('ordering', e.target.value)}
          className="input-field text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-sm text-gray-800 mb-2">Category</h4>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="category" value=""
              checked={!filters.category}
              onChange={() => handleChange('category', '')}
              className="text-primary" />
            <span className="text-sm">All Categories</span>
          </label>
          {categories.map((cat) => (
            <div key={cat.id}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="category" value={cat.slug}
                  checked={filters.category === cat.slug}
                  onChange={() => handleChange('category', cat.slug)}
                  className="text-primary" />
                <span className="text-sm font-medium">{cat.name}</span>
              </label>
              {cat.subcategories?.map((sub) => (
                <label key={sub.id} className="flex items-center gap-2 cursor-pointer pl-4">
                  <input type="radio" name="category" value={sub.slug}
                    checked={filters.category === sub.slug}
                    onChange={() => handleChange('category', sub.slug)}
                    className="text-primary" />
                  <span className="text-sm text-gray-600">{sub.name}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="font-semibold text-sm text-gray-800 mb-2">Price Range (PKR)</h4>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.min_price || ''}
            onChange={(e) => handleChange('min_price', e.target.value)}
            className="input-field text-sm w-1/2" />
          <input type="number" placeholder="Max" value={filters.max_price || ''}
            onChange={(e) => handleChange('max_price', e.target.value)}
            className="input-field text-sm w-1/2" />
        </div>
      </div>

      {/* In stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox"
            checked={filters.in_stock === 'true'}
            onChange={(e) => handleChange('in_stock', e.target.checked ? 'true' : '')}
            className="rounded text-primary" />
          <span className="text-sm font-medium">In Stock Only</span>
        </label>
      </div>

      {/* Featured */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox"
            checked={filters.is_featured === 'true'}
            onChange={(e) => handleChange('is_featured', e.target.checked ? 'true' : '')}
            className="rounded text-primary" />
          <span className="text-sm font-medium">Featured Only</span>
        </label>
      </div>

      <button onClick={clearAll} className="text-sm text-red-500 hover:underline">Clear all filters</button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="card p-5 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-gray-900">Filters</h3>
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile filter button */}
      <div className="lg:hidden">
        <button onClick={() => setShowMobile(true)}
          className="flex items-center gap-2 btn-outline text-sm">
          <AdjustmentsHorizontalIcon className="w-4 h-4" /> Filters
        </button>

        {showMobile && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobile(false)} />
            <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold">Filters</h3>
                <button onClick={() => setShowMobile(false)}><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <FilterContent />
              <button onClick={() => setShowMobile(false)} className="btn-primary w-full mt-6">Apply Filters</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
