import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MdVerified, MdLocalShipping, MdStar } from 'react-icons/md'
import {
  FaStar, FaArrowRight, FaLeaf, FaHeart,
  FaRocket, FaUsers, FaCut, FaGlobe,
} from 'react-icons/fa'
import { HiOutlineSparkles } from 'react-icons/hi'

const TEAM = [
  { name: 'Ali Farhan Shaheen', role: 'Founder & CEO',       initial: 'A', bio: 'Passionate about bringing premium Pakistani fashion to every household across the country.' },
  { name: 'Sobia Ahmed',        role: 'Head of Design',       initial: 'S', bio: 'With 10+ years in fashion design, Sobia curates every collection with elegance and cultural pride.' },
  { name: 'Bilal Raza',         role: 'Operations Manager',   initial: 'B', bio: 'Ensures every order is packed with care and delivered on time, every time.' },
  { name: 'Nadia Malik',        role: 'Customer Relations',   initial: 'N', bio: 'Our customer happiness champion — always ready to help you find the perfect outfit.' },
]

const VALUES = [
  { Icon: HiOutlineSparkles, title: 'Quality First',    desc: 'We never compromise on fabric quality, stitching standards, or finish. Every item passes strict quality checks before shipping.' },
  { Icon: FaHeart,           title: 'Customer Trust',   desc: 'Our customers are our biggest asset. We build lasting relationships through honesty, transparency, and excellent service.' },
  { Icon: FaGlobe,           title: 'Supporting Local', desc: "We proudly source from local manufacturers and artisans, contributing to Pakistan's fashion industry and economy." },
  { Icon: FaLeaf,            title: 'Sustainable',      desc: "We're committed to responsible fashion — minimising waste, using eco-friendly packaging, and promoting conscious consumerism." },
  { Icon: FaRocket,          title: 'Innovation',       desc: 'From our online store to delivery experience, we continuously innovate to make fashion accessible and enjoyable.' },
  { Icon: FaUsers,           title: 'Inclusivity',      desc: 'Fashion is for everyone. We offer a wide range of sizes and styles for men, women, kids, and every body type.' },
]

const MILESTONES = [
  { year: '2020', title: 'Founded',            desc: 'Cloth by AFS launched with a small collection of premium kameez and abayas from Karachi.' },
  { year: '2021', title: 'Online Launch',      desc: 'Launched our e-commerce store, reaching customers across all major cities of Pakistan.' },
  { year: '2022', title: '5,000 Customers',   desc: 'Crossed 5,000 happy customers milestone and expanded our product range to 200+ items.' },
  { year: '2023', title: 'Nationwide Delivery', desc: 'Partnered with TCS and Leopard Courier to offer fast, reliable delivery to every corner of Pakistan.' },
  { year: '2026', title: '10,000+ Orders',    desc: 'Celebrating 10,000+ successful orders and launching exclusive designer collaborations.' },
]

export default function AboutUs() {
  return (
    <>
      <Helmet>
        <title>About Us – Cloth by AFS</title>
        <meta name="description" content="Learn about Cloth by AFS — Pakistan's premium online fashion store. Our story, values, and the team behind the brand." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden text-white py-28" style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 35%, #7b2d8b 65%, #c0392b 100%)',
      }}>
        {/* Animated mesh blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #f09c27 0%, transparent 70%)', filter: 'blur(50px)' }} />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(45px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        {/* Dot mesh pattern */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 0)', backgroundSize: '28px 28px' }} />
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-[#f09c27] animate-pulse" />
              Our Story
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              About<br />
              <span style={{ color: '#f09c27' }}>Cloth by AFS</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl">
              We started with a simple dream — to make premium Pakistani fashion accessible to everyone, everywhere.
              Today, Cloth by AFS is trusted by thousands of customers across Pakistan.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/products"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
                style={{ background: '#f09c27', color: '#1a1a2e' }}>
                Shop Our Collection <FaArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}>
                Contact Us
              </Link>
            </div>
            {/* Trust numbers */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
              {[['10,000+', 'Happy Customers'], ['500+', 'Products'], ['4.8★', 'Rating']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-2xl font-heading font-extrabold" style={{ color: '#f09c27' }}>{val}</p>
                  <p className="text-white/60 text-sm mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '10,000+', label: 'Happy Customers',  Icon: FaUsers },
              { value: '500+',    label: 'Products',         Icon: FaCut },
              { value: '4.8/5',   label: 'Average Rating',   Icon: FaStar },
              { value: '3–5 Days',label: 'Delivery Time',    Icon: MdLocalShipping },
            ].map(({ value, label, Icon }) => (
              <div key={label} className="p-6 rounded-2xl bg-gray-50 hover:bg-[#f09c27]/5 transition-colors group">
                <Icon className="w-7 h-7 mx-auto mb-2 text-[#f09c27]" />
                <p className="text-3xl font-heading font-extrabold text-[#f09c27] mb-1">{value}</p>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                Bringing the Best of Pakistani Fashion to Your Doorstep
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Cloth by AFS was founded with a vision to revolutionise how Pakistanis shop for clothing.
                Every person deserves access to high-quality, stylish fashion — without compromise.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                From handcrafted embroidered abayas to premium cotton kameez, our curated collection celebrates
                the richness of Pakistani textile heritage while embracing modern fashion sensibilities.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every item is carefully selected and quality-checked by our team before it reaches you.
                We stand behind every product we sell — that's our promise.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: FaRocket,          bg: 'bg-[#f09c27]/10', border: 'border-[#f09c27]/20', title: 'Our Mission', text: 'Make quality fashion accessible and affordable for every Pakistani family.' },
                { Icon: MdStar,            bg: 'bg-blue-50',      border: 'border-blue-200',      title: 'Our Vision',  text: "Become Pakistan's most trusted and loved online fashion destination." },
                { Icon: MdVerified,        bg: 'bg-green-50',     border: 'border-green-200',     title: 'Our Quality', text: 'Zero compromise on fabric, stitching, and finishing — every single time.' },
                { Icon: FaHeart,           bg: 'bg-purple-50',    border: 'border-purple-200',    title: 'Our Values',  text: 'Customer first, quality always, community always at the heart of what we do.' },
              ].map(({ Icon, bg, border, title, text }) => (
                <div key={title} className={`p-5 rounded-2xl ${bg} border ${border}`}>
                  <Icon className="w-6 h-6 text-[#f09c27] mb-2" />
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">{title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-2">What We Believe In</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ Icon, title, desc }, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                <div className="w-14 h-14 rounded-2xl bg-[#f09c27]/10 flex items-center justify-center mb-4 group-hover:bg-[#f09c27]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#f09c27]" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2 group-hover:text-[#f09c27] transition-colors">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-2">Our Journey</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Milestones & Growth</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 md:-translate-x-0.5" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={i} className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
                  <div className={`hidden md:block flex-1 ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 inline-block max-w-xs ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <h4 className="font-bold text-gray-900 mb-1">{m.title}</h4>
                      <p className="text-gray-500 text-sm">{m.desc}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #f09c27, #e07b00)' }}>
                    {m.year}
                  </div>
                  <div className="flex-1 md:hidden">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-1">{m.title}</h4>
                      <p className="text-gray-500 text-sm">{m.desc}</p>
                    </div>
                  </div>
                  <div className={`hidden md:block flex-1 ${i % 2 === 0 ? 'pl-8' : 'pr-8'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#f09c27] font-semibold text-sm uppercase tracking-widest mb-2">The People Behind</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Meet Our Team</h2>
            <p className="text-gray-500 mt-3">Passionate individuals dedicated to bringing you the best fashion experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition-all border border-gray-100 group">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #f09c27, #e07b00)' }}>
                  {member.initial}
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-[#f09c27] text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #f09c27 0%, #e07b00 100%)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Explore?</h2>
          <p className="text-white/80 mb-8 text-lg">Discover our full collection — new arrivals added weekly.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-white text-[#f09c27] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
              Shop Now <FaArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-[#f09c27] transition-all">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
