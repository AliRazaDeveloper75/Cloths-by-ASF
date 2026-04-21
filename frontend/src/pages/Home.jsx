import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  FaTruck, FaUndo, FaLock, FaHeadset,
  FaStar, FaArrowRight, FaArrowLeft, FaChevronRight,
  FaShoppingBag, FaBolt, FaCheckCircle, FaQuoteLeft,
  FaShieldAlt, FaMedal, FaLeaf,
} from 'react-icons/fa'
import { MdLocalShipping, MdVerified } from 'react-icons/md'
import { HiOutlineSparkles, HiBadgeCheck } from 'react-icons/hi'
import api from '@/services/api'
import ProductGrid from '@/components/product/ProductGrid'
import { DEMO_PRODUCTS } from '@/data/demoProducts'

const HERO_SLIDES = [
  {
    badge: '✦ New Season 2026',
    title: 'New Arrivals',
    titleHighlight: '2026',
    subtitle: 'Discover the latest premium fashion curated just for you — lawn, chiffon & more',
    cta: 'Shop Now', ctaLink: '/products',
    secondary: 'View Featured', secondaryLink: '/products?is_featured=true',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=90&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(10,10,30,0.82) 0%, rgba(10,10,30,0.45) 55%, rgba(10,10,30,0.10) 100%)',
    accentColor: '#f09c27', tag: 'Spring Collection',
  },
  {
    badge: '✦ Trending Now',
    title: "Women's", titleHighlight: 'Collection',
    subtitle: 'Elegant abayas, casual kameez & chic accessories — crafted with love',
    cta: 'Explore Women', ctaLink: '/products?category=women',
    secondary: 'All Products', secondaryLink: '/products',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=90&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(50,5,25,0.82) 0%, rgba(50,5,25,0.45) 55%, rgba(50,5,25,0.08) 100%)',
    accentColor: '#f472b6', tag: 'Exclusive Styles',
  },
  {
    badge: '⚡ Flash Sale',
    title: 'Up to 50%', titleHighlight: 'Off',
    subtitle: "Limited time sale on selected items — shop the best deals before they're gone",
    cta: 'View Sale', ctaLink: '/products?has_discount=true',
    secondary: 'All Products', secondaryLink: '/products',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=90&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(80,20,0,0.82) 0%, rgba(80,20,0,0.45) 55%, rgba(80,20,0,0.08) 100%)',
    accentColor: '#fb923c', tag: 'Limited Offer',
  },
  {
    badge: "✦ Gentleman's Edit",
    title: "Men's Premium", titleHighlight: 'Wear',
    subtitle: 'Refined kameez, shalwar suits & formal wear — dress to impress every occasion',
    cta: "Shop Men's", ctaLink: '/products?category=men',
    secondary: 'All Products', secondaryLink: '/products',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=90&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(5,15,40,0.82) 0%, rgba(5,15,40,0.48) 55%, rgba(5,15,40,0.10) 100%)',
    accentColor: '#60a5fa', tag: 'Men Collection',
  },
  {
    badge: '🇵🇰 Made in Pakistan',
    title: 'Premium Quality', titleHighlight: 'Fashion',
    subtitle: 'Proudly crafted by skilled Pakistani artisans — wear culture, wear pride',
    cta: 'Discover Now', ctaLink: '/products',
    secondary: 'Our Story', secondaryLink: '/about',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=90&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(10,30,15,0.82) 0%, rgba(10,30,15,0.45) 55%, rgba(10,30,15,0.08) 100%)',
    accentColor: '#34d399', tag: 'Local Pride',
  },
]

const FEATURES = [
  { Icon: FaTruck,    title: 'Free Shipping',  desc: 'On orders over PKR 2,000', bg: '#eff6ff', icon: '#3b82f6' },
  { Icon: FaUndo,     title: 'Easy Returns',   desc: '7-day hassle-free returns', bg: '#f0fdf4', icon: '#22c55e' },
  { Icon: FaLock,     title: 'Secure Payment', desc: '100% safe checkout',       bg: '#faf5ff', icon: '#a855f7' },
  { Icon: FaHeadset,  title: '24/7 Support',   desc: 'Always here to help',      bg: '#fff7ed', icon: '#f09c27' },
]

const TESTIMONIALS = [
  { name: 'Ayesha Khan',  city: 'Karachi',    stars: 5, verified: true,
    text: 'Amazing quality! The fabric is so soft and the stitching is perfect. Exactly as shown in pictures. Will definitely order again.', avatar: 'A', color: '#f09c27' },
  { name: 'Fatima Ali',   city: 'Lahore',     stars: 5, verified: true,
    text: 'Fast delivery and beautiful packaging. The abaya fits perfectly and the color matches exactly. Customer service was very helpful.', avatar: 'F', color: '#ec4899' },
  { name: 'Sana Malik',   city: 'Islamabad',  stars: 5, verified: true,
    text: 'Best online clothing store in Pakistan! Great variety, fair prices, and excellent service. My go-to shop for all occasions.', avatar: 'S', color: '#8b5cf6' },
  { name: 'Zara Ahmed',   city: 'Faisalabad', stars: 5, verified: true,
    text: 'Very happy with my purchase. The kameez is elegant and comfortable. Even better quality than expected. Highly recommended!', avatar: 'Z', color: '#06b6d4' },
]

const WHY_US = [
  { num: '01', Icon: FaLeaf,       title: 'Premium Fabrics',   desc: 'Finest lawn, chiffon & cotton — sourced for comfort, durability and style in every piece.' },
  { num: '02', Icon: FaMedal,      title: 'Expert Tailoring',  desc: 'Every item is precision-crafted by skilled artisans with decades of expertise.' },
  { num: '03', Icon: HiBadgeCheck, title: 'Verified Quality',  desc: 'Each product passes strict quality checks before reaching your doorstep.' },
  { num: '04', Icon: FaShieldAlt,  title: '100% Authentic',    desc: 'Proudly Pakistani — genuine products, no replicas, no compromise on standards.' },
]

const STATS = [
  { value: '10,000+', label: 'Happy Customers', icon: '😊' },
  { value: '500+',    label: 'Products',         icon: '👗' },
  { value: '4.8 ★',  label: 'Average Rating',   icon: '⭐' },
  { value: '3–5',    label: 'Days Delivery',     icon: '🚚' },
]

const CAT_COLORS = [
  'from-blue-50 to-blue-100',
  'from-rose-50 to-rose-100',
  'from-amber-50 to-amber-100',
  'from-purple-50 to-purple-100',
  'from-emerald-50 to-emerald-100',
  'from-sky-50 to-sky-100',
]

const CAT_ICON_COLORS = ['#3b82f6','#f43f5e','#f59e0b','#a855f7','#10b981','#0ea5e9']

const CatIcon = ({ name }) => {
  const n = (name || '').toLowerCase()
  if ((n.includes('men') || n.includes('kameez') || n.includes('shalwar')) && !n.includes('women'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/></svg>
  if (n.includes('women') || n.includes('abaya') || n.includes('ladies'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm-1 12v2H8v2h3v4h2v-4h3v-2h-3v-2c3.31 0 6 2.69 6 4v2H6v-2c0-1.31 2.69-4 6-4z"/></svg>
  if (n.includes('kid') || n.includes('child') || n.includes('boy') || n.includes('girl'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 8c3.31 0 6 2.24 6 5v1h-2v5h-8v-5H6v-1c0-2.76 2.69-5 6-5z"/></svg>
  if (n.includes('access') || n.includes('bag') || n.includes('jewel'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M19 7h-1V5a6 6 0 0 0-12 0v2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-7 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3-9H9V5a3 3 0 0 1 6 0v2z"/></svg>
  if (n.includes('winter') || n.includes('jacket') || n.includes('coat'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z"/></svg>
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M16 2.01 14 2c0 1.1-.9 2-2 2s-2-.9-2-2l-2 .01L6 6l1.5 1.5L9 6v13h6V6l1.5 1.5L18 6l-2-3.99z"/></svg>
}

export default function Home() {
  const [slide, setSlide]             = useState(0)
  const [featured, setFeatured]       = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [categories, setCategories]   = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    Promise.all([
      api.get('/products/featured/'),
      api.get('/products/categories/'),
      api.get('/products/?ordering=-created_at&page_size=8'),
    ]).then(([featRes, catRes, newRes]) => {
      const feat   = featRes.data?.results ?? featRes.data ?? []
      const cats   = (catRes.data?.results ?? catRes.data ?? []).slice(0, 6)
      const newest = (newRes.data?.results ?? newRes.data ?? []).slice(0, 8)
      setFeatured(feat.length ? feat : DEMO_PRODUCTS.filter(p => p.is_featured))
      setCategories(cats)
      setNewArrivals(newest.length ? newest : DEMO_PRODUCTS)
    }).catch(() => {
      setFeatured(DEMO_PRODUCTS.filter(p => p.is_featured))
      setNewArrivals(DEMO_PRODUCTS)
    }).finally(() => setLoading(false))
  }, [])

  const cur = HERO_SLIDES[slide]

  return (
    <>
      <Helmet>
        <title>Cloths by AFS – Premium Fashion Store Pakistan</title>
        <meta name="description" content="Shop the latest clothing, abayas, kameez, accessories and more at Cloths by AFS. Premium quality fashion delivered across Pakistan." />
      </Helmet>

      {/* ═══════════════════════════════════════
          HERO SLIDER
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden text-white select-none" style={{ height: '100svh', minHeight: '640px', maxHeight: '960px' }}>

        {/* Background slides */}
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className="absolute inset-0"
            style={{ opacity: i === slide ? 1 : 0, transition: 'opacity 1200ms cubic-bezier(0.4,0,0.2,1)', zIndex: 1 }}>
            <img src={s.image} alt="" className="w-full h-full object-cover"
              style={{ objectPosition: 'center 20%', transform: i === slide ? 'scale(1.04)' : 'scale(1)', transition: 'transform 6000ms ease-out' }} />
            <div className="absolute inset-0" style={{ background: s.overlay }} />
            {/* Bottom vignette */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 45%)' }} />
          </div>
        ))}

        {/* Animated noise texture */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")', opacity: 0.4 }} />

        {/* ── Left vertical progress rail (desktop) ── */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-4">
          {HERO_SLIDES.map((s, i) => (
            <button key={i} onClick={() => setSlide(i)} className="group flex items-center gap-2.5">
              <div className="relative overflow-hidden rounded-full"
                style={{ width: i === slide ? '3px' : '2px', height: i === slide ? '56px' : '28px', background: 'rgba(255,255,255,0.20)', transition: 'all 400ms ease' }}>
                {i === slide && (
                  <div className="absolute inset-x-0 top-0 rounded-full" style={{ height: '100%', background: cur.accentColor }} />
                )}
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold tracking-widest uppercase text-white/70 whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{s.tag}</span>
            </button>
          ))}
        </div>

        {/* ── Main content ── */}
        <div className="relative z-20 h-full flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 grid lg:grid-cols-2 gap-8 items-center">

            {/* Text column */}
            <div className="pt-24 pb-44 lg:pt-0 lg:pb-0 lg:pl-10">

              {/* Badge */}
              <div key={`badge-${slide}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-extrabold uppercase tracking-[0.18em]"
                style={{
                  background: `${cur.accentColor}22`,
                  border: `1px solid ${cur.accentColor}55`,
                  color: cur.accentColor,
                  animation: 'slideDown 0.5s ease both',
                }}>
                <HiOutlineSparkles className="w-3.5 h-3.5" /> {cur.badge}
              </div>

              {/* Headline */}
              <h1 key={`title-${slide}`} className="font-heading font-black tracking-tight leading-[0.9] mb-4 drop-shadow-2xl"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', animation: 'slideUp 0.55s 0.08s ease both' }}>
                {cur.title}<br />
                <span style={{ color: cur.accentColor }}>{cur.titleHighlight}</span>
              </h1>

              {/* Accent line */}
              <div key={`line-${slide}`} className="mb-5 rounded-full"
                style={{ width: '64px', height: '4px', background: `linear-gradient(90deg, ${cur.accentColor}, ${cur.accentColor}44)`, animation: 'expandWidth 0.5s 0.2s ease both' }} />

              {/* Subtitle */}
              <p key={`sub-${slide}`} className="text-white/70 leading-relaxed mb-8 max-w-md"
                style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', animation: 'slideUp 0.55s 0.18s ease both' }}>
                {cur.subtitle}
              </p>

              {/* CTAs */}
              <div key={`cta-${slide}`} className="flex flex-wrap gap-3 mb-8"
                style={{ animation: 'slideUp 0.55s 0.26s ease both' }}>
                <Link to={cur.ctaLink}
                  className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                  style={{ background: cur.accentColor, color: '#0f0f0f', boxShadow: `0 10px 40px ${cur.accentColor}50` }}>
                  {cur.cta}
                  <span className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <FaArrowRight className="w-2.5 h-2.5" />
                  </span>
                </Link>
                <Link to={cur.secondaryLink}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm border text-white hover:bg-white hover:text-gray-900 transition-all active:scale-95"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.07)' }}>
                  {cur.secondary}
                </Link>
              </div>

              {/* Trust row */}
              <div key={`trust-${slide}`} className="flex flex-wrap gap-x-6 gap-y-2"
                style={{ animation: 'slideUp 0.55s 0.34s ease both' }}>
                {[
                  [MdLocalShipping, 'Free shipping'],
                  [FaUndo, '7-day returns'],
                  [FaLock, 'Secure pay'],
                  [FaShoppingBag, 'COD available'],
                ].map(([Icon, label]) => (
                  <span key={label} className="flex items-center gap-1.5 text-xs text-white/50">
                    <Icon className="w-3 h-3" style={{ color: `${cur.accentColor}cc` }} /> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: floating product highlight panel (desktop only) */}
            <div className="hidden lg:flex justify-end items-center pr-4">
              <div key={`panel-${slide}`} className="relative w-72 xl:w-80"
                style={{ animation: 'panelIn 0.65s 0.1s ease both' }}>
                {/* Main image frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl"
                  style={{ aspectRatio: '3/4', border: `1px solid ${cur.accentColor}33` }}>
                  <img src={cur.image} alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center 15%' }} />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cur.accentColor}22 0%, transparent 50%)` }} />

                  {/* Tag pill on image */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', color: cur.accentColor, border: `1px solid ${cur.accentColor}44` }}>
                    {cur.tag}
                  </div>

                  {/* Bottom overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                    <p className="text-white text-sm font-bold leading-tight">{cur.title} {cur.titleHighlight}</p>
                    <p className="text-white/60 text-xs mt-0.5">Explore Collection →</p>
                  </div>
                </div>

                {/* Floating stats badge */}
                <div className="absolute -bottom-5 -left-8 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
                  style={{ background: 'rgba(15,15,25,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.10)' }}>
                  <span className="text-2xl font-black" style={{ color: cur.accentColor }}>4.9</span>
                  <div>
                    <div className="flex gap-0.5 mb-0.5">
                      {[...Array(5)].map((_, k) => <FaStar key={k} className="w-2.5 h-2.5 text-yellow-400" />)}
                    </div>
                    <p className="text-white/50 text-[10px]">10k+ reviews</p>
                  </div>
                </div>

                {/* Decorative glow ring */}
                <div className="absolute -inset-3 rounded-[2rem] -z-10 opacity-20 blur-2xl"
                  style={{ background: cur.accentColor }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom thumbnail nav (desktop) ── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 hidden md:block lg:hidden">
          <div className="flex">
            {HERO_SLIDES.map((s, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className="relative flex-1 overflow-hidden transition-all duration-500 group"
                style={{ height: i === slide ? '76px' : '64px', opacity: i === slide ? 1 : 0.5 }}>
                <img src={s.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" style={{ objectPosition: 'center 20%' }} />
                <div className="absolute inset-0" style={{ background: i === slide ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.52)' }} />
                <div className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-300"
                  style={{ background: i === slide ? cur.accentColor : 'transparent' }} />
                <p className="absolute inset-0 flex items-end justify-center pb-2 text-white text-[9px] font-black tracking-widest uppercase">{s.tag}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Bottom left: large slide nav (large desktop) ── */}
        <div className="absolute bottom-8 right-10 z-30 hidden lg:flex items-center gap-4">
          <button onClick={() => setSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 text-white hover:border-white/50 transition-all hover:scale-105 active:scale-95"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(16px)' }}>
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-white/40 font-mono text-sm">{String(slide + 1).padStart(2,'0')} / {String(HERO_SLIDES.length).padStart(2,'0')}</span>
          <button onClick={() => setSlide((slide + 1) % HERO_SLIDES.length)}
            className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 text-white hover:border-white/50 transition-all hover:scale-105 active:scale-95"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(16px)' }}>
            <FaArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile dots */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 md:hidden">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className="rounded-full transition-all duration-300"
              style={{ width: i === slide ? '32px' : '7px', height: '7px', background: i === slide ? cur.accentColor : 'rgba(255,255,255,0.30)' }} />
          ))}
        </div>

        {/* ── CSS keyframe animations ── */}
        <style>{`
          @keyframes slideDown { from { opacity:0; transform:translateY(-12px) } to { opacity:1; transform:translateY(0) } }
          @keyframes slideUp   { from { opacity:0; transform:translateY(18px)  } to { opacity:1; transform:translateY(0) } }
          @keyframes expandWidth { from { width:0 } to { width:64px } }
          @keyframes panelIn   { from { opacity:0; transform:translateX(24px) scale(0.96) } to { opacity:1; transform:translateX(0) scale(1) } }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES STRIP
      ═══════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {FEATURES.map(({ Icon, title, desc, bg, icon }) => (
              <div key={title} className="flex items-center gap-4 p-5 md:p-6 hover:bg-gray-50/70 transition-colors group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color: icon }} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm leading-tight">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SHOP BY CATEGORY
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
              style={{ background: '#fff7ed', color: '#f09c27' }}>Browse Collections</span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-gray-400 max-w-lg mx-auto">From everyday casuals to special occasion wear — find your perfect style</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-5">
            {(categories.length > 0
              ? categories
              : [{ name:'Men', slug:'men' },{ name:'Women', slug:'women' },{ name:'Kids', slug:'kids' },
                 { name:'Accessories', slug:'accessories' },{ name:'Winter', slug:'winter' },{ name:'Summer', slug:'summer' }]
            ).map((cat, idx) => (
              <Link key={cat.id ?? cat.name} to={`/products?category=${cat.slug ?? cat.name.toLowerCase()}`}
                className="group text-center">
                <div className={`w-full aspect-square rounded-3xl mb-3 transition-all duration-300 shadow-sm
                  group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden relative
                  ${cat.image ? '' : `bg-gradient-to-br ${CAT_COLORS[idx % CAT_COLORS.length]}`}`}>
                  {cat.image
                    ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ color: CAT_ICON_COLORS[idx % CAT_ICON_COLORS.length] }}>
                        <CatIcon name={cat.name} />
                      </div>
                    )
                  }
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(240,156,39,0.08)' }} />
                </div>
                <p className="text-sm font-bold text-gray-700 group-hover:text-[#f09c27] transition-colors leading-tight">{cat.name}</p>
                {cat.product_count > 0 && <p className="text-xs text-gray-400 mt-0.5">{cat.product_count} items</p>}
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/products"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border-2 border-[#f09c27] text-[#f09c27] font-bold text-sm hover:bg-[#f09c27] hover:text-white transition-all duration-200">
              Browse All <FaChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
                style={{ background: '#fff7ed', color: '#f09c27' }}>Editor's Pick</span>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-gray-900">Featured Products</h2>
              <p className="text-gray-400 mt-2 text-sm">Hand-picked favorites loved by our customers</p>
            </div>
            <Link to="/products?is_featured=true"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#f09c27] border-2 border-[#f09c27] rounded-xl hover:bg-[#f09c27] hover:text-white transition-all">
              View All <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ProductGrid products={featured} loading={loading} />
          <div className="text-center mt-8 md:hidden">
            <Link to="/products?is_featured=true"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#f09c27] text-[#f09c27] font-bold rounded-xl hover:bg-[#f09c27] hover:text-white transition-all">
              View All Featured <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROMO BANNERS (editorial style)
      ═══════════════════════════════════════ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Men */}
            <div className="relative overflow-hidden rounded-3xl text-white group cursor-pointer" style={{ minHeight: '280px' }}>
              <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80&fit=crop"
                alt="Men's Collection" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,50,0.90) 0%, rgba(10,15,50,0.50) 60%, transparent 100%)' }} />
              <div className="relative z-10 p-8 md:p-10 flex flex-col justify-end h-full" style={{ minHeight: '280px' }}>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ background: 'rgba(240,156,39,0.20)', color: '#f09c27', border: '1px solid rgba(240,156,39,0.30)' }}>
                  New Season
                </span>
                <h3 className="text-2xl md:text-3xl font-heading font-black mb-2 leading-tight">Men's Premium<br/>Kameez Collection</h3>
                <p className="text-white/60 text-sm mb-6">Latest cuts, finest fabrics — dress to impress every occasion</p>
                <Link to="/products?category=men"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm w-fit transition-all hover:scale-105 active:scale-95"
                  style={{ background: '#f09c27', color: '#0f172a' }}>
                  Shop Men's <FaArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Women */}
            <div className="relative overflow-hidden rounded-3xl text-white group cursor-pointer" style={{ minHeight: '280px' }}>
              <img src="https://images.unsplash.com/photo-1609802570143-bf97b6af4e37?w=800&q=80&fit=crop"
                alt="Women's Collection" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(80,5,30,0.90) 0%, rgba(80,5,30,0.50) 60%, transparent 100%)' }} />
              <div className="relative z-10 p-8 md:p-10 flex flex-col justify-end h-full" style={{ minHeight: '280px' }}>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ background: 'rgba(244,114,182,0.20)', color: '#f9a8d4', border: '1px solid rgba(244,114,182,0.30)' }}>
                  Exclusive Styles
                </span>
                <h3 className="text-2xl md:text-3xl font-heading font-black mb-2 leading-tight">Women's Abaya &<br/>Casual Collection</h3>
                <p className="text-white/60 text-sm mb-6">Elegant, modest & timeless — designed for every woman</p>
                <Link to="/products?category=women"
                  className="inline-flex items-center gap-2.5 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm w-fit transition-all hover:scale-105 active:scale-95">
                  Shop Women's <FaArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          NEW ARRIVALS
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
                style={{ background: '#f0fdf4', color: '#16a34a' }}>Fresh Stock</span>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-gray-900">New Arrivals</h2>
              <p className="text-gray-400 mt-2 text-sm">Just landed — be the first to own them</p>
            </div>
            <Link to="/products?ordering=-created_at"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#f09c27] border-2 border-[#f09c27] rounded-xl hover:bg-[#f09c27] hover:text-white transition-all">
              View All <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} loading={loading} />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OFFER BANNER
      ═══════════════════════════════════════ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl py-16 px-6 md:px-16 text-white"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)' }}>
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
            {/* Decorative gold circle */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #f09c27, transparent)' }} />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #f09c27, transparent)' }} />
            <div className="relative z-10 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                style={{ background: 'rgba(240,156,39,0.15)', color: '#f09c27', border: '1px solid rgba(240,156,39,0.25)' }}>
                <FaBolt className="w-3 h-3" /> Limited Time Offer
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-black mb-4 leading-tight">
                Get <span style={{ color: '#f09c27' }}>10% Off</span> Your First Order
              </h2>
              <p className="text-gray-300 text-base mb-2">
                Use code <span className="font-black text-white px-3 py-1 rounded-lg mx-1" style={{ background: 'rgba(240,156,39,0.20)', border: '1px solid rgba(240,156,39,0.30)' }}>WELCOME10</span> at checkout
              </p>
              <p className="text-gray-500 text-sm mb-10">Valid on all items · No minimum order required</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/products"
                  className="inline-flex items-center gap-2.5 font-black px-9 py-4 rounded-xl hover:scale-105 transition-all shadow-xl active:scale-95"
                  style={{ background: '#f09c27', color: '#0f172a' }}>
                  Shop Now <FaArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/register"
                  className="inline-flex items-center gap-2.5 border-2 border-white/30 text-white font-bold px-9 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY CHOOSE US
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
              style={{ background: '#fff7ed', color: '#f09c27' }}>Our Promise</span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-gray-900">Why Customers Trust Us</h2>
            <p className="text-gray-400 mt-3 max-w-lg mx-auto">We don't just sell clothes — we deliver confidence, quality and care</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ num, Icon, title, desc }) => (
              <div key={num}
                className="relative p-8 rounded-3xl border border-gray-100 hover:border-[#f09c27]/30 hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white">
                {/* Number watermark */}
                <div className="absolute top-4 right-5 font-black text-6xl text-gray-50 group-hover:text-[#f09c27]/8 transition-colors leading-none select-none">
                  {num}
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                  style={{ background: '#fff7ed' }}>
                  <Icon className="w-7 h-7 text-[#f09c27]" />
                </div>
                <h3 className="font-heading font-black text-gray-900 mb-2 group-hover:text-[#f09c27] transition-colors">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS SECTION
      ═══════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-white/5 hover:border-[#f09c27]/30 transition-colors group">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-4xl md:text-5xl font-heading font-black mb-1" style={{ color: '#f09c27' }}>{s.value}</p>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
              style={{ background: '#fef9c3', color: '#a16207' }}>Customer Reviews</span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-gray-900">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => <FaStar key={i} className="w-4 h-4 text-yellow-400" />)}
              <span className="ml-2 text-gray-500 text-sm font-medium">4.8 out of 5 — based on 1,200+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <FaQuoteLeft className="w-6 h-6 text-[#f09c27]/30 mb-4 flex-shrink-0" />
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">"{t.text}"</p>
                <div className="border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-base flex-shrink-0"
                      style={{ background: t.color }}>
                      {t.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                        {t.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-600">
                            <MdVerified className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[...Array(t.stars)].map((_, j) => <FaStar key={j} className="w-2.5 h-2.5 text-yellow-400" />)}
                        </div>
                        <span className="text-xs text-gray-400">· {t.city}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST & PAYMENT SECTION (new)
      ═══════════════════════════════════════ */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-lg font-heading font-bold text-gray-500 uppercase tracking-widest text-sm">
              Trusted · Secure · Nationwide Delivery
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🔒', title: 'SSL Secured', desc: '256-bit encryption on all transactions' },
              { icon: '🚚', title: 'Nationwide', desc: 'Delivering to all cities across Pakistan' },
              { icon: '💳', title: 'COD Available', desc: 'Pay cash on delivery — no card needed' },
              { icon: '↩️', title: '7-Day Returns', desc: 'Easy returns & full refund guarantee' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-5 rounded-2xl bg-gray-50 hover:bg-[#fff7ed] border border-transparent hover:border-[#f09c27]/20 transition-all group">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-bold text-gray-800 text-sm group-hover:text-[#f09c27] transition-colors">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Payment methods */}
          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accepted Payment Methods</p>
            <div className="flex flex-wrap justify-center items-center gap-3">
              {['Cash on Delivery', 'JazzCash', 'EasyPaisa', 'Bank Transfer', 'Credit Card'].map(pm => (
                <span key={pm} className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 bg-white hover:border-[#f09c27]/40 hover:text-[#f09c27] transition-all">
                  {pm}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW TO ORDER
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
              style={{ background: '#eff6ff', color: '#3b82f6' }}>Simple & Easy</span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-gray-900">How to Order</h2>
            <p className="text-gray-400 mt-3">Get your favourite outfits delivered in 4 easy steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#f09c27]/20 via-[#f09c27]/50 to-[#f09c27]/20" />
            {[
              { step:'01', emoji:'🔍', title:'Browse Products',  desc:'Explore hundreds of premium fashion items across all categories' },
              { step:'02', emoji:'🛒', title:'Add to Cart',      desc:'Pick your size, choose your quantity and add to cart' },
              { step:'03', emoji:'📦', title:'Place Your Order', desc:'Choose Cash on Delivery — no card or online payment needed' },
              { step:'04', emoji:'🚚', title:'Fast Delivery',    desc:'Your order arrives at your doorstep within 3–5 business days' },
            ].map((s, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative z-10 w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 border-2 border-[#f09c27]/20 bg-white">
                  <span className="text-3xl">{s.emoji}</span>
                </div>
                <span className="text-xs font-black text-[#f09c27] tracking-widest">{s.step}</span>
                <h3 className="font-heading font-black text-gray-900 mt-1 mb-2 text-base">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[180px] mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-base text-white transition-all hover:scale-105 shadow-xl active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f09c27, #e07b00)', boxShadow: '0 8px 32px rgba(240,156,39,0.40)' }}>
              Start Shopping Now <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          NEWSLETTER
      ═══════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
        <div className="absolute -right-20 top-0 w-80 h-80 rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #f09c27, transparent)' }} />
        <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #f09c27, transparent)' }} />
        <div className="max-w-2xl mx-auto text-center px-4 relative z-10 text-white">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(240,156,39,0.15)', color: '#f09c27', border: '1px solid rgba(240,156,39,0.25)' }}>
            Stay Updated
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-black mb-3">Get Exclusive Deals & Style Tips</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Subscribe and be the first to know about new arrivals, flash sales and special offers across Pakistan.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27] transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }} />
            <button type="submit"
              className="px-8 py-4 rounded-xl font-black text-sm flex-shrink-0 hover:scale-105 transition-all active:scale-95 shadow-lg"
              style={{ background: '#f09c27', color: '#0f172a', boxShadow: '0 4px 20px rgba(240,156,39,0.40)' }}>
              Subscribe
            </button>
          </form>
          <p className="text-gray-600 text-xs mt-4">No spam · Unsubscribe anytime · Join 10,000+ subscribers</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          QUICK LINKS
      ═══════════════════════════════════════ */}
      <section className="bg-white py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { emoji:'👔', label:"Men's Wear",   link:'/products?category=men',      bg:'#eff6ff', text:'#3b82f6' },
              { emoji:'👗', label:"Women's Wear", link:'/products?category=women',    bg:'#fdf2f8', text:'#ec4899' },
              { emoji:'⚡', label:'Sale Items',   link:'/products?has_discount=true', bg:'#fff1f2', text:'#f43f5e' },
              { emoji:'⭐', label:'Best Sellers', link:'/products?is_featured=true',  bg:'#fefce8', text:'#ca8a04' },
            ].map(({ emoji, label, link, bg, text }) => (
              <Link key={label} to={link}
                className="flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-md"
                style={{ background: bg, color: text }}>
                <span className="text-xl">{emoji}</span> {label}
                <FaArrowRight className="w-3 h-3 ml-auto opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
