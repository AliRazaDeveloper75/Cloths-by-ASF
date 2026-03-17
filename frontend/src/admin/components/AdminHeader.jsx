import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function AdminHeader() {
  const { user } = useSelector((s) => s.auth)
  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() || 'A'

  return (
    <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between shrink-0">
      <p className="text-sm text-gray-500">
        Welcome back, <span className="font-semibold text-gray-800">{user?.first_name ?? 'Admin'}</span>
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/admin/orders"
          className="text-xs bg-yellow-100 text-yellow-800 font-semibold px-2.5 py-1 rounded-full hover:bg-yellow-200 transition-colors"
        >
          View Orders
        </Link>
        <div className="w-8 h-8 rounded-full bg-[#f09c27] text-white flex items-center justify-center font-bold text-sm">
          {initials}
        </div>
      </div>
    </header>
  )
}
