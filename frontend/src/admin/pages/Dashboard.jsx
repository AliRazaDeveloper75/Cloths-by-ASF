import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import api from '@/services/api'
import { formatPrice, formatDate, getOrderStatusColor } from '@/utils/helpers'
import { PageLoader } from '@/components/common/Loader'

function StatCard({ title, value, icon, bg, sub }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/orders/admin/dashboard/')
      .then((r) => setStats(r.data))
      .catch((e) => setError(e.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3">
        <span className="text-4xl">⚠️</span>
        <p className="text-gray-600 font-medium">{error}</p>
        <p className="text-sm text-gray-400">Make sure the backend server is running on port 8000</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-[#f09c27] text-white text-sm font-semibold rounded-lg hover:bg-[#d4821a]"
        >
          Retry
        </button>
      </div>
    )
  }

  const chartData = (stats?.monthly_revenue ?? []).map((m) => ({
    month: new Date(m.month).toLocaleDateString('en-PK', { month: 'short' }),
    revenue: Number(m.revenue ?? 0),
    orders: m.count ?? 0,
  }))

  return (
    <>
      <Helmet><title>Dashboard – Admin | Cloth by AFS</title></Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your store performance</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={formatPrice(stats?.total_revenue ?? 0)}
            icon="💰"
            bg="bg-green-50"
          />
          <StatCard
            title="Total Orders"
            value={stats?.total_orders ?? 0}
            icon="📦"
            bg="bg-blue-50"
            sub={`${stats?.pending_orders ?? 0} pending`}
          />
          <StatCard
            title="Customers"
            value={stats?.total_users ?? 0}
            icon="👥"
            bg="bg-purple-50"
          />
          <StatCard
            title="Active Products"
            value={stats?.total_products ?? 0}
            icon="👕"
            bg="bg-orange-50"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Revenue – Last 6 Months</h3>
            {chartData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                No revenue data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f09c27" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f09c27" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [formatPrice(v), 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#f09c27" strokeWidth={2}
                    fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Orders per Month</h3>
            {chartData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                No order data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#1a1a2e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/admin/products/new', label: 'Add Product', icon: '➕' },
            { to: '/admin/categories',   label: 'Categories',  icon: '🏷️' },
            { to: '/admin/orders',       label: 'All Orders',  icon: '📋' },
            { to: '/admin/coupons',      label: 'Coupons',     icon: '🎟️' },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-[#f09c27]/30 transition-all text-center"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-semibold text-gray-700">{a.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-medium text-[#f09c27] hover:underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {['Order #', 'Customer', 'Total', 'Payment', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(stats?.recent_orders ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  (stats?.recent_orders ?? []).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-gray-900 text-xs">
                        #{order.order_number}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{order.user_name ?? '—'}</td>
                      <td className="px-4 py-3 font-semibold text-[#f09c27]">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                          ${order.payment_method === 'cod'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'}`}>
                          {order.payment_method === 'cod' ? 'COD' : 'Online'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-xs text-[#f09c27] hover:underline font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
