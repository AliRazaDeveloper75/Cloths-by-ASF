import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import api from '@/services/api'
import { formatDate } from '@/utils/helpers'
import { PageLoader } from '@/components/common/Loader'
import Pagination from '@/components/common/Pagination'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async (p = 1, q = '') => {
    setLoading(true)
    try {
      const res = await api.get('/auth/admin/users/', { params: { page: p, search: q } })
      setUsers(res.data.results ?? res.data ?? [])
      setTotalPages(Math.ceil((res.data.count ?? 0) / 20) || 1)
    } catch {
      toast.error('Failed to load users')
      setUsers([])
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

  const toggleBlock = async (user) => {
    try {
      await api.patch(`/auth/admin/users/${user.id}/`, { is_active: !user.is_active })
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_active: !u.is_active } : u))
      toast.success(user.is_active ? 'User blocked' : 'User unblocked')
    } catch {
      toast.error('Failed to update user')
    }
  }

  const promoteToAdmin = async (user) => {
    if (!window.confirm(`Promote ${user.email} to admin?`)) return
    try {
      await api.patch(`/auth/admin/users/${user.id}/`, { role: 'admin' })
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: 'admin' } : u))
      toast.success('User promoted to admin!')
    } catch {
      toast.error('Failed to promote user')
    }
  }

  return (
    <>
      <Helmet><title>Users – Admin | Cloth by AFS</title></Helmet>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50"
            />
            <button type="submit" className="px-5 py-2.5 bg-[#1a1a2e] text-white text-sm font-semibold rounded-lg hover:bg-[#16213e] transition-colors">
              Search
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10"><PageLoader /></div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-5xl">👥</span>
              <p className="mt-3 text-gray-500 font-medium">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['User', 'Role', 'Joined', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {u.first_name?.[0]?.toUpperCase() ?? u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{u.first_name} {u.last_name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatDate(u.date_joined)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {u.is_active ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBlock(u)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                              u.is_active
                                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                            }`}
                          >
                            {u.is_active ? 'Block' : 'Unblock'}
                          </button>
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => promoteToAdmin(u)}
                              className="px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                              Make Admin
                            </button>
                          )}
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
