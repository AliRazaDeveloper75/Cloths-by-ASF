// Demo products shown when no real products exist in the database yet.
// All images are from Unsplash (free, no attribution required for display).

export const DEMO_PRODUCTS = [
  {
    id: 'd1', slug: 'demo-premium-lawn-kameez',
    name: 'Premium Lawn Kameez – Floral Print',
    category_name: "Women's Fashion",
    primary_image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80&fit=crop',
    price: '2500.00', effective_price: '1999.00', discount_price: '1999.00',
    discount_percentage: 20, is_featured: true, in_stock: true, avg_rating: 4.8, review_count: 124,
  },
  {
    id: 'd2', slug: 'demo-mens-shalwar-kameez',
    name: 'Classic Men\'s Shalwar Kameez – White',
    category_name: "Men's Fashion",
    primary_image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80&fit=crop',
    price: '3200.00', effective_price: '3200.00', discount_price: null,
    discount_percentage: 0, is_featured: true, in_stock: true, avg_rating: 4.6, review_count: 89,
  },
  {
    id: 'd3', slug: 'demo-embroidered-abaya',
    name: 'Embroidered Abaya – Black Gold',
    category_name: "Women's Fashion",
    primary_image: 'https://images.unsplash.com/photo-1609902726285-00668009f004?w=600&q=80&fit=crop',
    price: '5500.00', effective_price: '4400.00', discount_price: '4400.00',
    discount_percentage: 20, is_featured: false, in_stock: true, avg_rating: 5.0, review_count: 56,
  },
  {
    id: 'd4', slug: 'demo-chiffon-dupatta',
    name: 'Chiffon Dupatta – Royal Blue',
    category_name: 'Accessories',
    primary_image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80&fit=crop',
    price: '900.00', effective_price: '650.00', discount_price: '650.00',
    discount_percentage: 28, is_featured: false, in_stock: true, avg_rating: 4.4, review_count: 33,
  },
  {
    id: 'd5', slug: 'demo-kids-kurta-set',
    name: 'Kids Festive Kurta Set – Maroon',
    category_name: "Kids' Wear",
    primary_image: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&q=80&fit=crop',
    price: '1800.00', effective_price: '1800.00', discount_price: null,
    discount_percentage: 0, is_featured: false, in_stock: true, avg_rating: 4.7, review_count: 21,
  },
  {
    id: 'd6', slug: 'demo-casual-cotton-shirt',
    name: 'Casual Cotton Shirt – Sky Blue',
    category_name: "Men's Fashion",
    primary_image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80&fit=crop',
    price: '1500.00', effective_price: '1200.00', discount_price: '1200.00',
    discount_percentage: 20, is_featured: true, in_stock: true, avg_rating: 4.3, review_count: 67,
  },
  {
    id: 'd7', slug: 'demo-bridal-lehenga',
    name: 'Bridal Lehenga – Crimson Red',
    category_name: "Women's Fashion",
    primary_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&fit=crop',
    price: '18000.00', effective_price: '14999.00', discount_price: '14999.00',
    discount_percentage: 17, is_featured: true, in_stock: true, avg_rating: 4.9, review_count: 12,
  },
  {
    id: 'd8', slug: 'demo-winter-shawl',
    name: 'Pashmina Winter Shawl – Camel Brown',
    category_name: 'Accessories',
    primary_image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&q=80&fit=crop',
    price: '2200.00', effective_price: '2200.00', discount_price: null,
    discount_percentage: 0, is_featured: false, in_stock: true, avg_rating: 4.5, review_count: 44,
  },
]

export const DEMO_CATEGORIES = [
  { id: 'dc1', name: "Women's Fashion", slug: 'women-fashion' },
  { id: 'dc2', name: "Men's Fashion",   slug: 'men-fashion' },
  { id: 'dc3', name: "Kids' Wear",      slug: 'kids-wear' },
  { id: 'dc4', name: 'Accessories',     slug: 'accessories' },
  { id: 'dc5', name: 'Winter Wear',     slug: 'winter-wear' },
  { id: 'dc6', name: 'Summer Lawn',     slug: 'summer-lawn' },
]
