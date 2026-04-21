import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { FaWhatsapp, FaPhone } from 'react-icons/fa'

const WHATSAPP_NUMBER = '923134001623'
const CALL_NUMBER     = '+923134001623'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer /> 

      {/* ── Floating WhatsApp (bottom-left) ── */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%20need%20help%20with%20my%20order.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-5 z-50 group flex items-center gap-2"
      >
        {/* Tooltip */}
        <span className="absolute left-full ml-3 whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Chat on WhatsApp
        </span>
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
          <FaWhatsapp className="w-7 h-7 text-white" />
        </div>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ background: '#25D366' }} />
      </a>

      {/* ── Floating Call (bottom-right) ── */}
      <a
        href={`tel:${CALL_NUMBER}`}
        aria-label="Call us"
        className="fixed bottom-6 right-5 z-50 group flex items-center gap-2"
      >
        {/* Tooltip */}
        <span className="absolute right-full mr-3 whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          {CALL_NUMBER}
        </span>
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg, #f09c27, #e07b00)' }}>
          <FaPhone className="w-6 h-6 text-white" />
        </div>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ background: '#f09c27' }} />
      </a>
    </div>
  )
}
