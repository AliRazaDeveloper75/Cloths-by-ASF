import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import logo from '@/components/assets/logo.png'
import { logout } from '@/store/slices/authSlice'
import { resetCart } from '@/store/slices/cartSlice'
import { resetWishlist } from '@/store/slices/wishlistSlice'
import {
  MdDashboard, MdShoppingBag, MdCategory, MdListAlt,
  MdPeople, MdLocalOffer, MdStorefront, MdLogout,
} from 'react-icons/md'

const NAV = [
  { to: '/admin',            label: 'Dashboard',  Icon: MdDashboard,   end: true },
  { to: '/admin/products',   label: 'Products',   Icon: MdShoppingBag },
  { to: '/admin/categories', label: 'Categories', Icon: MdCategory },
  { to: '/admin/orders',     label: 'Orders',     Icon: MdListAlt },
  { to: '/admin/users',      label: 'Users',      Icon: MdPeople },
  { to: '/admin/coupons',    label: 'Coupons',    Icon: MdLocalOffer },
]

export default function AdminSidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    dispatch(resetCart())
    dispatch(resetWishlist())
    navigate('/admin/login')
  }

  return (
    <aside className="w-64 shrink-0 bg-[#1a1a2e] text-white flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-3">
          <img src={logo} alt="Cloth by AFS"
            className="h-9 w-auto object-contain max-w-[120px]"
            style={{ filter: 'brightness(0) invert(1)' }} />
          <span className="text-[11px] text-gray-400 leading-none font-medium">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
               ${isActive ? 'bg-[#f09c27] text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`
            }>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link to="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
          <MdStorefront className="w-5 h-5 flex-shrink-0" />
          View Store
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors">
          <MdLogout className="w-5 h-5 flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  )
}
