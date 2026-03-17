import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  FaTruck, FaUndo, FaLock, FaHeadset,
  FaStar, FaArrowRight, FaArrowLeft, FaChevronRight,
  FaShoppingBag, FaBolt, FaCheckCircle,
} from 'react-icons/fa'
import {
  MdLocalShipping, MdSupportAgent, MdVerified,
} from 'react-icons/md'
import {
  HiOutlineSparkles,
} from 'react-icons/hi'
import api from '@/services/api'
import ProductGrid from '@/components/product/ProductGrid'
import { DEMO_PRODUCTS } from '@/data/demoProducts'

// 6 fashion e-commerce hero banners
const HERO_SLIDES = [
  {
    badge: '✦ New Season',
    title: 'New Arrivals',
    titleHighlight: '2026',
    subtitle: 'Discover the latest premium fashion curated just for you — lawn, chiffon & more',
    cta: 'Shop Now',
    ctaLink: '/products',
    secondary: 'View Featured',
    secondaryLink: '/products?is_featured=true',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=85&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(10,10,30,0.80) 0%, rgba(10,10,30,0.45) 55%, rgba(10,10,30,0.15) 100%)',
    accentColor: '#f09c27',
    tag: 'Spring Collection',
  },
  {
    badge: '✦ Trending Now',
    title: "Women's",
    titleHighlight: 'Collection',
    subtitle: 'Elegant abayas, casual kameez & chic accessories — crafted with love',
    cta: 'Explore Women',
    ctaLink: '/products?category=women',
    secondary: 'All Products',
    secondaryLink: '/products',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=85&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(40,5,20,0.82) 0%, rgba(40,5,20,0.48) 55%, rgba(40,5,20,0.10) 100%)',
    accentColor: '#f472b6',
    tag: 'Exclusive Styles',
  },
  {
    badge: '⚡ Flash Sale',
    title: 'Up to 50%',
    titleHighlight: 'Off',
    subtitle: 'Limited time sale on selected items — shop the best deals before they\'re gone',
    cta: 'View Sale',
    ctaLink: '/products?has_discount=true',
    secondary: 'All Products',
    secondaryLink: '/products',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=85&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(80,25,0,0.82) 0%, rgba(80,25,0,0.48) 55%, rgba(80,25,0,0.10) 100%)',
    accentColor: '#fb923c',
    tag: 'Limited Offer',
  },
  {
    badge: '✦ Gentleman\'s Edit',
    title: "Men's Premium",
    titleHighlight: 'Wear',
    subtitle: 'Refined kameez, shalwar suits & formal wear — dress to impress every occasion',
    cta: "Shop Men's",
    ctaLink: '/products?category=men',
    secondary: 'All Products',
    secondaryLink: '/products',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&q=85&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(5,15,40,0.82) 0%, rgba(5,15,40,0.50) 55%, rgba(5,15,40,0.12) 100%)',
    accentColor: '#60a5fa',
    tag: 'Men Collection',
  },
  {
    badge: '✦ Accessories',
    title: 'Complete Your',
    titleHighlight: 'Look',
    subtitle: 'Handbags, jewellery, scarves & more — the finishing touch to every outfit',
    cta: 'Shop Accessories',
    ctaLink: '/products?category=accessories',
    secondary: 'All Products',
    secondaryLink: '/products',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1920&q=85&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(30,15,50,0.82) 0%, rgba(30,15,50,0.48) 55%, rgba(30,15,50,0.10) 100%)',
    accentColor: '#a78bfa',
    tag: 'Accessories',
  },
  {
    badge: '🇵🇰 Made in Pakistan',
    title: 'Premium Quality',
    titleHighlight: 'Fashion',
    subtitle: 'Proudly crafted by skilled Pakistani artisans — wear culture, wear pride',
    cta: 'Discover Now',
    ctaLink: '/products',
    secondary: 'Our Story',
    secondaryLink: '/about',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=85&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(10,30,15,0.82) 0%, rgba(10,30,15,0.48) 55%, rgba(10,30,15,0.10) 100%)',
    accentColor: '#34d399',
    tag: 'Local Pride',
  },
]

const FEATURES = [
  { Icon: FaTruck,       title: 'Free Shipping',   desc: 'On orders over PKR 2,000', color: 'bg-blue-50 text-blue-600' },
  { Icon: FaUndo,        title: 'Easy Returns',    desc: '7-day hassle-free returns', color: 'bg-green-50 text-green-600' },
  { Icon: FaLock,        title: 'Secure Payment',  desc: '100% safe checkout',        color: 'bg-purple-50 text-purple-600' },
  { Icon: FaHeadset,     title: '24/7 Support',    desc: 'Always here to help',       color: 'bg-orange-50 text-orange-600' },
]

const TESTIMONIALS = [
  { name: 'Ayesha Khan',  city: 'Karachi',     stars: 5, text: 'Amazing quality! The fabric is so soft and the stitching is perfect. Will definitely order again.', avatar: 'A' },
  { name: 'Fatima Ali',   city: 'Lahore',      stars: 5, text: 'Fast delivery and beautiful packaging. The abaya fits perfectly and the color is exactly as shown.', avatar: 'F' },
  { name: 'Sana Malik',   city: 'Islamabad',   stars: 5, text: 'Best online clothing store in Pakistan! Great variety, fair prices, and excellent service.', avatar: 'S' },
  { name: 'Zara Ahmed',   city: 'Faisalabad',  stars: 4, text: 'Very happy with my purchase. The kameez is elegant and comfortable. Highly recommended!', avatar: 'Z' },
]

const WHY_US = [
  { Icon: HiOutlineSparkles, title: 'Premium Fabrics',  desc: 'We source only the finest materials — lawn, chiffon, cotton — ensuring comfort with every wear.' },
  { Icon: MdVerified,        title: 'Expert Tailoring', desc: 'Each piece is crafted with precision by skilled artisans with decades of expertise.' },
  { Icon: FaStar,            title: 'Latest Trends',    desc: 'Stay ahead of fashion with our constantly updated collections inspired by local and international trends.' },
  { Icon: FaCheckCircle,     title: 'Made in Pakistan', desc: 'Proudly supporting local artisans and manufacturers while delivering world-class fashion.' },
]

const STAT_ITEMS = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '500+',    label: 'Products' },
  { value: '50+',     label: 'Brands' },
  { value: '4.8★',    label: 'Average Rating' },
]

const CAT_COLORS = [
  'from-blue-100 to-blue-200 hover:from-blue-500 hover:to-blue-600 hover:text-white',
  'from-pink-100 to-pink-200 hover:from-pink-500 hover:to-pink-600 hover:text-white',
  'from-yellow-100 to-yellow-200 hover:from-yellow-500 hover:to-yellow-600 hover:text-white',
  'from-purple-100 to-purple-200 hover:from-purple-500 hover:to-purple-600 hover:text-white',
  'from-green-100 to-green-200 hover:from-green-500 hover:to-green-600 hover:text-white',
  'from-orange-100 to-orange-200 hover:from-orange-500 hover:to-orange-600 hover:text-white',
]

// SVG category icons — matched by keyword
const CatIcon = ({ name }) => {
  const n = (name || '').toLowerCase()
  // Men (not women)
  if ((n.includes('men') || n.includes('man') || n.includes('male') || n.includes('kameez') || n.includes('shalwar')) && !n.includes('women'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/></svg>
  // Women
  if (n.includes('women') || n.includes('woman') || n.includes('female') || n.includes('abaya') || n.includes('hijab') || n.includes('ladies'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm-1 12v2H8v2h3v4h2v-4h3v-2h-3v-2c3.31 0 6 2.69 6 4v2H6v-2c0-1.31 2.69-4 6-4z"/></svg>
  // Kids / Children
  if (n.includes('kid') || n.includes('child') || n.includes('boy') || n.includes('girl') || n.includes('baby'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 8c3.31 0 6 2.24 6 5v1h-2v5h-8v-5H6v-1c0-2.76 2.69-5 6-5z"/></svg>
  // Accessories / bags / shoes / jewellery
  if (n.includes('access') || n.includes('bag') || n.includes('shoe') || n.includes('jewel') || n.includes('watch') || n.includes('belt'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M19 7h-1V5a6 6 0 0 0-12 0v2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-7 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3-9H9V5a3 3 0 0 1 6 0v2z"/></svg>
  // Electronics / tech / phone
  if (n.includes('electron') || n.includes('tech') || n.includes('phone') || n.includes('gadget') || n.includes('device'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm-5 20a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5-4H7V4h10v13z"/></svg>
  // Fashion / clothes / cloth / wear / dress / shirt
  if (n.includes('fashion') || n.includes('cloth') || n.includes('wear') || n.includes('dress') || n.includes('shirt') || n.includes('suit'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M16 2.01 14 2c0 1.1-.9 2-2 2s-2-.9-2-2l-2 .01L6 6l1.5 1.5L9 6v13h6V6l1.5 1.5L18 6l-2-3.99z"/></svg>
  // Health / beauty / care / skin
  if (n.includes('health') || n.includes('beauty') || n.includes('care') || n.includes('skin') || n.includes('wellness') || n.includes('medical'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.518 3.467 2 6 2c1.988 0 4.276 1.31 5.999 4.073C13.714 3.31 16.012 2 18 2c2.537 0 5 1.518 5 5.191 0 4.105-5.371 8.863-11 14.402z"/></svg>
  // Winter / summer / season
  if (n.includes('winter') || n.includes('warm') || n.includes('jacket') || n.includes('coat'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z"/></svg>
  if (n.includes('summer') || n.includes('lawn') || n.includes('cotton') || n.includes('light'))
    return <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>
  // Default — shopping bag
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9"><path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1zm-9-1a2 2 0 0 1 4 0v1h-4V6zm8 14H6V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v11z"/></svg>
}

export default function Home() {
  const [slide, setSlide]           = useState(0)
  const [featured, setFeatured]     = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

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
      const feat = featRes.data?.results ?? featRes.data ?? []
      const cats = (catRes.data?.results ?? catRes.data ?? []).slice(0, 6)
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
        <title>Cloth by AFS – Premium Fashion Store Pakistan</title>
        <meta name="description" content="Shop the latest clothing, abayas, kameez, accessories and more at Cloth by AFS. Premium quality fashion delivered across Pakistan." />
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden text-white select-none" style={{ minHeight: '90vh' }}>

        {/* Background images — crossfade */}
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-[1200ms]"
            style={{ opacity: i === slide ? 1 : 0, zIndex: 0 }}>
            <img src={s.image} alt="" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0" style={{ background: s.overlay }} />
          </div>
        ))}

        {/* Dot-grid texture */}
        <div className="absolute inset-0 opacity-[0.06] z-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 0)', backgroundSize: '36px 36px' }} />

        {/* Slide number — top right */}
        <div className="absolute top-6 right-6 z-30 hidden md:flex items-center gap-2">
          <span className="text-3xl font-heading font-extrabold text-white/90 tabular-nums leading-none"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
            {String(slide + 1).padStart(2, '0')}
          </span>
          <span className="text-white/30 text-lg">/</span>
          <span className="text-white/40 text-base font-medium">{String(HERO_SLIDES.length).padStart(2, '0')}</span>
        </div>

        {/* Main content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center"
          style={{ minHeight: '90vh' }}>
          <div className="max-w-2xl pt-20 pb-32 md:pb-24">

            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: cur.accentColor }}>
              <HiOutlineSparkles className="w-3.5 h-3.5" /> {cur.badge}
            </span>

            {/* Title */}
            <h1 className="font-heading font-extrabold leading-none mb-6 drop-shadow-xl"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}>
              {cur.title}{' '}
              <span style={{ color: cur.accentColor }}>{cur.titleHighlight}</span>
            </h1>

            {/* Tag pill */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white/70"
              style={{ background: 'rgba(255,255,255,0.10)' }}>
              {cur.tag}
            </span>

            <p className="text-base md:text-lg text-white/75 mb-8 leading-relaxed max-w-lg">
              {cur.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link to={cur.ctaLink}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-xl"
                style={{ background: cur.accentColor, color: '#0f0f0f' }}>
                {cur.cta} <FaArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to={cur.secondaryLink}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border-2 border-white/35 text-white backdrop-blur-sm hover:bg-white hover:text-gray-900 transition-all">
                {cur.secondary}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8 text-xs text-white/55">
              <span className="flex items-center gap-1.5"><MdLocalShipping className="w-3.5 h-3.5" style={{ color: cur.accentColor }} /> Free shipping over PKR 2,000</span>
              <span className="flex items-center gap-1.5"><FaUndo className="w-3 h-3" style={{ color: cur.accentColor }} /> 7-day easy returns</span>
              <span className="flex items-center gap-1.5"><FaShoppingBag className="w-3 h-3" style={{ color: cur.accentColor }} /> Cash on delivery</span>
            </div>
          </div>
        </div>

        {/* Thumbnail strip — bottom (desktop) */}
        <div className="absolute bottom-0 left-0 right-0 z-30 hidden md:flex">
          {HERO_SLIDES.map((s, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className="relative flex-1 h-20 overflow-hidden transition-all duration-300 group"
              style={{ opacity: i === slide ? 1 : 0.55 }}>
              <img src={s.image} alt="" className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: i === slide ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.50)' }} />
              {/* Active accent line */}
              {i === slide && (
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: cur.accentColor }} />
              )}
              <p className="absolute bottom-2 left-0 right-0 text-center text-white text-[10px] font-semibold tracking-wide truncate px-1">
                {s.tag}
              </p>
            </button>
          ))}
        </div>

        {/* Mobile dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 md:hidden">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === slide ? '28px' : '8px',
                height: '8px',
                background: i === slide ? cur.accentColor : 'rgba(255,255,255,0.4)',
              }} />
          ))}
        </div>

        {/* Side arrows */}
        <button onClick={() => setSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-8 z-30 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hidden md:flex"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <FaArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setSlide((slide + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-8 z-30 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hidden md:flex"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <FaArrowRight className="w-3.5 h-3.5" />
        </button>

      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="bg-white border-y border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {FEATURES.map(({ Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-[#f09c27] transition-colors">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-2">Browse</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">From everyday casuals to special occasion wear — find your perfect style</p>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map((cat, idx) => (
                <Link key={cat.id} to={`/products?category=${cat.slug}`} className="group text-center">
                  <div className={`w-full aspect-square rounded-2xl overflow-hidden mb-3 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-105
                    ${cat.image ? '' : `bg-gradient-to-br ${CAT_COLORS[idx % CAT_COLORS.length]} flex items-center justify-center text-gray-600`}`}>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <CatIcon name={cat.name} />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-[#f09c27] transition-colors">{cat.name}</p>
                  {cat.product_count > 0 && <p className="text-xs text-gray-400 mt-0.5">{cat.product_count} items</p>}
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[['Men','men'],['Women','women'],['Kids','kids'],['Accessories','accessories'],['Winter','winter'],['Summer','summer']].map(([name, slug], idx) => (
                <Link key={name} to={`/products?category=${slug}`} className="group text-center">
                  <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${CAT_COLORS[idx]}
                    flex items-center justify-center mb-3 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-105 text-gray-600`}>
                    <CatIcon name={name} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-[#f09c27] transition-colors">{name}</p>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#f09c27] text-[#f09c27] font-semibold rounded-xl hover:bg-[#f09c27] hover:text-white transition-all duration-200">
              Browse All Categories <FaChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-2">Editor's Pick</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-2">Hand-picked favorites loved by our customers</p>
            </div>
            <Link to="/products?is_featured=true"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#f09c27] border border-[#f09c27] rounded-lg hover:bg-[#f09c27] hover:text-white transition-all">
              View All <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ProductGrid products={featured} loading={loading} />
          <div className="text-center mt-8 md:hidden">
            <Link to="/products?is_featured=true" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#f09c27] text-[#f09c27] font-semibold rounded-xl hover:bg-[#f09c27] hover:text-white transition-all">
              View All Featured <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DUAL PROMO BANNERS ── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-2xl text-white group cursor-pointer" style={{ minHeight: '240px' }}>
              <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80&fit=crop" alt="Men's Collection"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: 'rgba(15,20,50,0.65)' }} />
              <div className="relative z-10 p-8 flex flex-col justify-end h-full" style={{ minHeight: '240px' }}>
                <p className="text-[#f09c27] text-xs font-bold uppercase tracking-widest mb-2">New Season</p>
                <h3 className="text-2xl font-heading font-bold mb-2">Men's Premium<br />Kameez Collection</h3>
                <p className="text-white/70 text-sm mb-5">Latest cuts, finest fabrics — dress to impress</p>
                <Link to="/products?category=men"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm w-fit transition-all hover:scale-105"
                  style={{ background: '#f09c27', color: '#1a1a2e' }}>
                  Shop Men's <FaArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl text-white group cursor-pointer" style={{ minHeight: '240px' }}>
              <img src="https://images.unsplash.com/photo-1609802570143-bf97b6af4e37?w=800&q=80&fit=crop" alt="Women's Collection"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: 'rgba(60,10,30,0.65)' }} />
              <div className="relative z-10 p-8 flex flex-col justify-end h-full" style={{ minHeight: '240px' }}>
                <p className="text-pink-300 text-xs font-bold uppercase tracking-widest mb-2">Exclusive Offer</p>
                <h3 className="text-2xl font-heading font-bold mb-2">Women's Abaya &<br />Casual Collection</h3>
                <p className="text-white/70 text-sm mb-5">Elegant, modest, and timeless designs</p>
                <Link to="/products?category=women"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-lg font-semibold text-sm w-fit transition-all hover:scale-105">
                  Shop Women's <FaArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-2">Fresh Stock</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">New Arrivals</h2>
              <p className="text-gray-500 mt-2">Just landed — be the first to own them</p>
            </div>
            <Link to="/products?ordering=-created_at"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#f09c27] border border-[#f09c27] rounded-lg hover:bg-[#f09c27] hover:text-white transition-all">
              View All <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} loading={loading} />
        </div>
      </section>

      {/* ── BIG PROMO BANNER ── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl text-white text-center py-16 px-6"
            style={{ background: 'linear-gradient(135deg, #f09c27 0%, #e07b00 50%, #c96a00 100%)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            <div className="relative z-10">
              <FaBolt className="w-8 h-8 mx-auto mb-4 text-white/80" />
              <p className="text-sm font-bold uppercase tracking-widest text-white/80 mb-3">Limited Time Offer</p>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Get 10% Off Your First Order</h2>
              <p className="text-white/80 text-lg mb-2">Use code <strong className="bg-white/20 px-3 py-1 rounded-lg">WELCOME10</strong> at checkout</p>
              <p className="text-white/60 text-sm mb-8">Valid on all items. No minimum order required.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/products" className="inline-flex items-center gap-2 bg-white text-[#f09c27] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
                  Shop Now <FaArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-[#f09c27] transition-all">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-2">Our Promise</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Why Choose Cloth by AFS?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ Icon, title, desc }, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-[#f09c27]/40 hover:shadow-lg transition-all group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f09c27]/10 flex items-center justify-center group-hover:bg-[#f09c27]/20 transition-colors">
                  <Icon className="w-7 h-7 text-[#f09c27]" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2 group-hover:text-[#f09c27] transition-colors">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {STAT_ITEMS.map(s => (
              <div key={s.label} className="p-6">
                <p className="text-4xl md:text-5xl font-heading font-extrabold text-[#f09c27] mb-2">{s.value}</p>
                <p className="text-gray-300 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-gray-500 mt-3">Real reviews from real customers across Pakistan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#f09c27] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.city}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <FaStar key={j} className="w-3.5 h-3.5 text-[#f09c27]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO ORDER ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-2">Simple & Easy</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">How to Order</h2>
            <p className="text-gray-500 mt-3">Get your favourite outfits delivered in 4 easy steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', Icon: FaStar,        title: 'Browse Products',  desc: 'Explore hundreds of premium fashion items across all categories' },
              { step: '02', Icon: FaShoppingBag, title: 'Add to Cart',      desc: 'Pick your size, choose your quantity and add to cart' },
              { step: '03', Icon: FaCheckCircle, title: 'Place Order',      desc: 'Choose Cash on Delivery — no card or online payment needed' },
              { step: '04', Icon: FaTruck,       title: 'Delivered to You', desc: 'Your order arrives at your doorstep within 3–5 business days' },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                {i < 3 && <div className="hidden md:block absolute top-8 left-3/4 w-1/2 h-0.5 bg-gray-200 z-0" />}
                <div className="relative z-10 w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f09c27]/10 flex items-center justify-center border-2 border-[#f09c27]/20">
                  <s.Icon className="w-6 h-6 text-[#f09c27]" />
                </div>
                <span className="text-xs font-bold text-[#f09c27] tracking-widest">{s.step}</span>
                <h3 className="font-heading font-bold text-gray-900 mt-1 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white transition-all hover:scale-105 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #f09c27, #e07b00)' }}>
              Start Shopping Now <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
        <div className="max-w-2xl mx-auto text-center px-4 text-white">
          <MdSupportAgent className="w-12 h-12 mx-auto mb-4 text-[#f09c27]" />
          <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-3">Stay Updated</p>
          <h2 className="text-3xl font-heading font-bold mb-3">Get Exclusive Deals & Style Tips</h2>
          <p className="text-gray-400 mb-8">Subscribe and be the first to know about new arrivals, flash sales and special offers.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f09c27] text-sm" />
            <button type="submit"
              className="px-7 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105 flex-shrink-0"
              style={{ background: '#f09c27', color: '#1a1a2e' }}>
              Subscribe
            </button>
          </form>
          <p className="text-gray-500 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { Icon: FaShoppingBag, label: "Men's Wear",   link: '/products?category=men',          color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
              { Icon: FaShoppingBag, label: "Women's Wear", link: '/products?category=women',        color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
              { Icon: FaBolt,        label: 'Sale Items',   link: '/products?has_discount=true',     color: 'bg-red-50 hover:bg-red-100 text-red-700' },
              { Icon: FaStar,        label: 'Best Sellers', link: '/products?is_featured=true',      color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700' },
            ].map(({ Icon, label, link, color }) => (
              <Link key={label} to={link}
                className={`flex items-center gap-3 p-4 rounded-xl font-semibold text-sm transition-all ${color}`}>
                <Icon className="w-5 h-5" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
