import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import {
  FaFacebookF, FaInstagram, FaYoutube, FaTwitter,
  FaTruck, FaUndo, FaArrowRight,
} from 'react-icons/fa'
import { MdLock, MdLocationOn, MdPhone, MdEmail, MdAccessTime } from 'react-icons/md'

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a' }} className="text-gray-400">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #f09c27, #e07b00, #f09c27)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="Cloth by AFS" className="h-12 sm:h-14 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Premium Pakistani fashion for everyone. From classic kameez to modern abayas — quality clothing delivered to your doorstep nationwide.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {[
                { Icon: FaFacebookF,  name: 'Facebook',  hoverBg: 'hover:bg-blue-600' },
                { Icon: FaInstagram,  name: 'Instagram', hoverBg: 'hover:bg-pink-600' },
                { Icon: FaYoutube,    name: 'YouTube',   hoverBg: 'hover:bg-red-600' },
                { Icon: FaTwitter,    name: 'Twitter',   hoverBg: 'hover:bg-sky-500' },
              ].map(({ Icon, name, hoverBg }) => (
                <a key={name} href="#" title={name}
                  className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white transition-all hover:scale-110 ${hoverBg}`}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
                <MdLock className="w-3.5 h-3.5 text-[#f09c27]" /> Secure Payments
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
                <FaTruck className="w-3.5 h-3.5 text-[#f09c27]" /> COD Available
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
                <FaUndo className="w-3 h-3 text-[#f09c27]" /> 7-Day Returns
              </span>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm">
              {[
                ['/products',                    'All Products'],
                ['/products?is_featured=true',   'Featured Items'],
                ['/products?has_discount=true',  'Sale & Offers'],
                ['/products?ordering=-created_at','New Arrivals'],
                ['/products?category=men',        "Men's Collection"],
                ['/products?category=women',      "Women's Collection"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-[#f09c27] transition-colors hover:translate-x-1 inline-flex items-center gap-1 group">
                    <FaArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#f09c27]" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm">
              {[
                ['/about',    'About Us'],
                ['/contact',  'Contact Us'],
                ['/',         'Home'],
                ['/register', 'Create Account'],
                ['/login',    'Sign In'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-[#f09c27] transition-colors hover:translate-x-1 inline-flex items-center gap-1 group">
                    <FaArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#f09c27]" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2.5">
                <MdLocationOn className="w-4 h-4 text-[#f09c27] mt-0.5 flex-shrink-0" />
                <span>123 Fashion Street, Saddar, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MdPhone className="w-4 h-4 text-[#f09c27] flex-shrink-0" />
                <a href="tel:+923001234567" className="hover:text-[#f09c27] transition-colors">+92 300 1234567</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MdEmail className="w-4 h-4 text-[#f09c27] flex-shrink-0" />
                <a href="mailto:info@clothbyafs.com" className="hover:text-[#f09c27] transition-colors">info@clothbyafs.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MdAccessTime className="w-4 h-4 text-[#f09c27] flex-shrink-0" />
                <span>Mon–Sat: 10am – 8pm</span>
              </li>
            </ul>
            <Link to="/contact"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
              style={{ background: '#f09c27', color: '#1a1a2e' }}>
              Get in Touch <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Newsletter mini */}
        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-white font-semibold">Subscribe to our newsletter</p>
              <p className="text-gray-400 text-sm mt-0.5">Get exclusive deals and new arrival alerts</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Your email address"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27] focus:border-[#f09c27]" />
              <button type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all hover:scale-105"
                style={{ background: '#f09c27', color: '#1a1a2e' }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Cloth by AFS. All rights reserved. Made with love in Pakistan.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/about"   className="hover:text-[#f09c27] transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-[#f09c27] transition-colors">Contact</Link>
            <a href="#" className="hover:text-[#f09c27] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#f09c27] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#f09c27] transition-colors">Returns Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
