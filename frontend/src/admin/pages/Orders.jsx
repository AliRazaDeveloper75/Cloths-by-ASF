import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import api from '@/services/api'
import { formatPrice, formatDate, getOrderStatusColor } from '@/utils/helpers'
import { PageLoader } from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'

const STATUS_OPTS = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async (p = 1, s = '') => {
    setLoading(true)
    try {
      const params = { page: p }
      if (s) params.status = s
      const res = await api.get('/orders/admin/', { params })
      setOrders(res.data.results ?? res.data ?? [])
      setTotalPages(Math.ceil((res.data.count ?? 0) / 20) || 1)
    } catch {
      toast.error('Failed to load orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(1, '') }, [load])

  const handleFilterChange = (s) => {
    setStatus(s)
    setPage(1)
    load(1, s)
  }

  return (
    <>
      <Helmet><title>Orders – Admin | Cloth by AFS</title></Helmet>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <span className="text-sm text-gray-500">{orders.length} result(s)</span>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-2">
          {STATUS_OPTS.map((s) => (
            <button
              key={s || 'all'}
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors ${
                status === s
                  ? 'bg-[#1a1a2e] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s || 'All Orders'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10"><PageLoader /></div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-5xl">📦</span>
              <p className="mt-3 text-gray-500 font-medium">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Order #', 'Customer', 'Total', 'Payment', 'Status', 'Date', ''].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-gray-900 text-xs">
                          #{order.order_number}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{order.user_name ?? order.shipping_full_name}</p>
                        <p className="text-xs text-gray-400">{order.user_email}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#f09c27]">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          order.payment_method === 'cod'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {order.payment_method === 'cod' ? 'COD' : 'Online'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="px-3 py-1.5 text-xs font-semibold text-[#f09c27] bg-[#f09c27]/10 hover:bg-[#f09c27]/20 rounded-lg transition-colors"
                        >
                          Manage
                        </Link>
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
          onPageChange={(p) => { setPage(p); load(p, status) }}
        />
      </div>
    </>
  )
}
