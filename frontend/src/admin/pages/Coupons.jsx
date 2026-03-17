import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '@/services/api'
import { formatDate } from '@/utils/helpers'
import { PageLoader } from '@/components/common/Loader'

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { discount_type: 'percentage', is_active: true },
  })
  const discountType = watch('discount_type')

  const load = async () => {
    try {
      const res = await api.get('/coupons/admin/')
      setCoupons(res.data?.results ?? res.data ?? [])
    } catch {
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    reset({ discount_type: 'percentage', is_active: true, code: '', discount_value: '', min_order_amount: '', max_uses: '', expiry_date: '' })
    setShowForm(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    Object.entries(c).forEach(([k, v]) => setValue(k, v ?? ''))
    setShowForm(true)
  }

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      min_order_amount: data.min_order_amount || null,
      max_uses: data.max_uses || null,
      expiry_date: data.expiry_date || null,
    }
    try {
      if (editing) {
        await api.patch(`/coupons/admin/${editing.id}/`, payload)
        toast.success('Coupon updated!')
      } else {
        await api.post('/coupons/admin/', payload)
        toast.success('Coupon created!')
      }
      setShowForm(false)
      setEditing(null)
      reset()
      load()
    } catch (err) {
      const msg = err.response?.data?.code?.[0] || err.response?.data?.detail || 'Failed to save'
      toast.error(msg)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return
    try {
      await api.delete(`/coupons/admin/${id}/`)
      toast.success('Coupon deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const toggleActive = async (c) => {
    try {
      await api.patch(`/coupons/admin/${c.id}/`, { is_active: !c.is_active })
      setCoupons((prev) => prev.map((x) => x.id === c.id ? { ...x, is_active: !x.is_active } : x))
    } catch {
      toast.error('Failed to update')
    }
  }

  if (loading) return <PageLoader />

  return (
    <>
      <Helmet><title>Coupons – Admin | Cloth by AFS</title></Helmet>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Coupons</h1>
          <button onClick={openAdd} className="px-4 py-2 bg-[#f09c27] hover:bg-[#d4821a] text-white text-sm font-semibold rounded-lg transition-colors">
            ＋ Create Coupon
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f09c27]/30">
            <h2 className="font-semibold text-gray-800 mb-4">{editing ? `Edit: ${editing.code}` : 'New Coupon'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code <span className="text-red-500">*</span></label>
                <input
                  {...register('code', { required: 'Code is required' })}
                  placeholder="e.g. SUMMER20"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50 ${errors.code ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Type</label>
                <select {...register('discount_type')} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (PKR)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Discount Value <span className="text-red-500">*</span>
                  <span className="font-normal text-gray-400 ml-1">{discountType === 'percentage' ? '(%)' : '(PKR)'}</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('discount_value', { required: 'Value is required' })}
                  placeholder={discountType === 'percentage' ? '20' : '500'}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50 ${errors.discount_value ? 'border-red-400' : 'border-gray-300'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Min. Order (PKR)</label>
                <input
                  type="number"
                  min="0"
                  {...register('min_order_amount')}
                  placeholder="Leave blank for no minimum"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Uses</label>
                <input
                  type="number"
                  min="1"
                  {...register('max_uses')}
                  placeholder="Leave blank for unlimited"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                <input
                  type="date"
                  {...register('expiry_date')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded border-gray-300 accent-[#f09c27]" />
                  <span className="text-sm font-medium text-gray-700">Active (usable by customers)</span>
                </label>
              </div>

              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#f09c27] hover:bg-[#d4821a] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60">
                  {isSubmitting ? 'Saving…' : editing ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); reset() }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:border-gray-400 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Coupons list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {coupons.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-5xl">🎟️</span>
              <p className="mt-3 text-gray-500 font-medium">No coupons yet</p>
              <button onClick={openAdd} className="mt-3 text-sm text-[#f09c27] hover:underline font-semibold">Create first coupon →</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Code', 'Discount', 'Min. Order', 'Uses', 'Expiry', 'Active', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {coupons.map((c) => {
                    const expired = c.expiry_date && new Date(c.expiry_date) < new Date()
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-gray-900">{c.code}</td>
                        <td className="px-4 py-3 font-semibold text-[#f09c27]">
                          {c.discount_type === 'percentage' ? `${c.discount_value}%` : `PKR ${c.discount_value}`}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {c.min_order_amount ? `PKR ${c.min_order_amount}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {c.used_count ?? 0}{c.max_uses ? ` / ${c.max_uses}` : ''}
                        </td>
                        <td className="px-4 py-3">
                          {c.expiry_date ? (
                            <span className={`text-xs font-medium ${expired ? 'text-red-500' : 'text-gray-600'}`}>
                              {expired ? '⚠ ' : ''}{formatDate(c.expiry_date)}
                            </span>
                          ) : (
                            <span className="text-gray-400">No expiry</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleActive(c)}
                            className={`relative w-10 h-5 rounded-full transition-colors ${c.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${c.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(c)} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit</button>
                            <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
