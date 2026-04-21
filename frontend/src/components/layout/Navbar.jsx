import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import { resetCart } from '@/store/slices/cartSlice'
import { resetWishlist } from '@/store/slices/wishlistSlice'
import {
  ShoppingCartIcon, HeartIcon, UserIcon,
  MagnifyingGlassIcon, Bars3Icon, XMarkIcon, ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { ShoppingBagIcon } from '@heroicons/react/24/solid'
import api from '@/services/api'
import { debounce } from '@/utils/helpers'
import logo from '../assets/logo.png'

const NAV_LINKS = [
  { label: 'Home',     to: '/' },
  { label: 'Featured', to: '/products?is_featured=true' },
  { label: 'About',    to: '/about' },
  { label: 'Contact',  to: '/contact' },
]

export default function Navbar() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const location   = useLocation()
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const { total_items }           = useSelector(s => s.cart)
  const { count: wishlistCount }  = useSelector(s => s.wishlist)

  const [menuOpen,     setMenuOpen]     = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [shopOpen,     setShopOpen]     = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [categories,   setCategories]   = useState([])
  const [scrolled,     setScrolled]     = useState(false)

  const userMenuRef  = useRef(null)
  const searchRef    = useRef(null)

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Load categories
  useEffect(() => {
    api.get('/products/categories/').then(r => setCategories(r.data?.results ?? r.data ?? [])).catch(() => {})
  }, [])

  // Close menus on outside click
  useEffect(() => {
    const handler = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleSearch = debounce(async q => {
    if (!q.trim()) { setSearchResults([]); return }
    try {
      const res = await api.get(`/products/?search=${q}&page_size=6`)
      setSearchResults(res.data.results || [])
    } catch { setSearchResults([]) }
  }, 300)

  const handleLogout = async () => {
    try { await api.post('/auth/logout/', { refresh: localStorage.getItem('refresh_token') }) } catch {}
    dispatch(logout()); dispatch(resetCart()); dispatch(resetWishlist())
    navigate('/login')
  }

  const isActive = to => location.pathname === to || (to !== '/' && location.pathname.startsWith(to.split('?')[0]))

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? 'shadow-lg' : 'shadow-sm border-b border-gray-100'}`}>

      {/* ── Announcement bar ── */}
      <div className="text-white text-xs py-2 text-center font-medium tracking-wide" style={{ background: 'linear-gradient(90deg, #1a1a2e, #0f3460, #1a1a2e)' }}>
        🚚 Free shipping on orders over PKR 2,000 &nbsp;|&nbsp; Use code{' '}
        <span className="font-black px-1.5 py-0.5 rounded text-xs" style={{ color: '#f09c27' }}>WELCOME10</span>
        {' '}for 10% off
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <img src={logo} alt="Cloths by AFS"
              className="h-10 sm:h-11 w-auto object-contain max-w-[130px] sm:max-w-[160px] group-hover:opacity-90 transition-opacity" />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive('/') && location.pathname === '/' ? 'text-[#f09c27] bg-[#fff7ed]' : 'text-gray-600 hover:text-[#f09c27] hover:bg-gray-50'}`}>
              Home
            </Link>

            {/* Shop dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive('/products') ? 'text-[#f09c27] bg-[#fff7ed]' : 'text-gray-600 hover:text-[#f09c27] hover:bg-gray-50'}`}
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}>
                Shop <ChevronDownIcon className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-200" />
              </button>
              <div
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
                className={`absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 transition-all duration-200 ${shopOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <Link to="/products"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-[#fff7ed] hover:text-[#f09c27] transition-colors mx-2 rounded-xl">
                  <ShoppingBagIcon className="w-4 h-4 text-[#f09c27]" /> All Products
                </Link>
                <div className="h-px bg-gray-100 my-2 mx-4" />
                {categories.slice(0, 6).map(cat => (
                  <Link key={cat.id} to={`/products?category=${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-[#fff7ed] hover:text-[#f09c27] transition-colors mx-2 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f09c27]/40" /> {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {[{ label: 'Featured', to: '/products?is_featured=true' }, { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }].map(l => (
              <Link key={l.label} to={l.to}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive(l.to) ? 'text-[#f09c27] bg-[#fff7ed]' : 'text-gray-600 hover:text-[#f09c27] hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button onClick={() => setSearchOpen(o => !o)}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#f09c27]">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 p-3 z-50 animate-fade-in">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search products..." value={searchQuery} autoFocus
                      onChange={e => { setSearchQuery(e.target.value); handleSearch(e.target.value) }}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/30 focus:border-[#f09c27] transition-all" />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-72 overflow-y-auto">
                      {searchResults.map(p => (
                        <Link key={p.id} to={`/products/${p.slug}`}
                          onClick={() => { setSearchOpen(false); setSearchResults([]) }}
                          className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                          <img src={p.primary_image || '/placeholder-product.jpg'} alt={p.name}
                            className="w-11 h-11 object-cover rounded-lg border border-gray-100 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                            <p className="text-xs font-black" style={{ color: '#f09c27' }}>PKR {p.effective_price?.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchQuery && searchResults.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-4">No products found</p>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/wishlist" className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-500">
                <HeartIcon className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#f09c27]">
              <ShoppingCartIcon className="w-5 h-5" />
              {total_items > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1"
                  style={{ background: '#f09c27' }}>
                  {total_items}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 transition-colors ml-1">
                  {user?.avatar
                    ? <img src={user.avatar} alt={user.first_name} className="w-8 h-8 rounded-xl object-cover" />
                    : (
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#f09c27,#e07b00)' }}>
                        {user?.first_name?.[0]?.toUpperCase()}
                      </div>
                    )
                  }
                  <ChevronDownIcon className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white shadow-2xl rounded-2xl border border-gray-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-black text-gray-900">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                    </div>
                    {[
                      { label: '👤  My Profile', to: '/profile' },
                      { label: '📦  My Orders',  to: '/orders' },
                      { label: '❤️  Wishlist',   to: '/wishlist' },
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#f09c27] transition-colors mx-1 rounded-xl">
                        {item.label}
                      </Link>
                    ))}
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-bold mx-1 rounded-xl transition-colors"
                        style={{ color: '#f09c27' }}>
                        ⚙️  Admin Dashboard
                      </Link>
                    )}
                    <div className="h-px bg-gray-100 my-1 mx-3" />
                    <button onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors mx-1 rounded-xl font-semibold">
                      🚪  Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link to="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-[#f09c27] rounded-xl hover:bg-gray-50 transition-all">
                  Login
                </Link>
                <Link to="/register"
                  className="px-5 py-2 text-sm font-black text-white rounded-xl hover:scale-105 transition-all shadow-md"
                  style={{ background: 'linear-gradient(135deg,#f09c27,#e07b00)' }}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors ml-1 text-gray-600">
              {menuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">

            {/* Search */}
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/30 focus:border-[#f09c27]" />
            </div>

            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-800 hover:bg-[#fff7ed] hover:text-[#f09c27] transition-colors">
              🏠 Home
            </Link>
            <Link to="/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-800 hover:bg-[#fff7ed] hover:text-[#f09c27] transition-colors">
              🛍️ All Products
            </Link>

            {categories.slice(0, 6).map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-[#f09c27] transition-colors pl-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f09c27]/40 flex-shrink-0" /> {cat.name}
              </Link>
            ))}

            <Link to="/products?is_featured=true" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-800 hover:bg-[#fff7ed] hover:text-[#f09c27] transition-colors">
              ⭐ Featured
            </Link>
            <Link to="/about" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-[#f09c27] transition-colors">
              ℹ️ About
            </Link>
            <Link to="/contact" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-[#f09c27] transition-colors">
              📞 Contact
            </Link>

            {!isAuthenticated && (
              <div className="flex gap-3 pt-3">
                <Link to="/login"
                  className="flex-1 text-center py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-[#f09c27] hover:text-[#f09c27] transition-all">
                  Login
                </Link>
                <Link to="/register"
                  className="flex-1 text-center py-3 rounded-xl text-sm font-black text-white shadow-lg hover:scale-[1.02] transition-all"
                  style={{ background: 'linear-gradient(135deg,#f09c27,#e07b00)' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
