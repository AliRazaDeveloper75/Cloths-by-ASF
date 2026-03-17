/**
 * Format a number as currency (PKR)
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Truncate text to a given length
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

/**
 * Format date
 */
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Order status color classes
 */
export const getOrderStatusColor = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

/**
 * Build an image URL (handles relative paths)
 */
export const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.jpg'
  if (path.startsWith('http')) return path
  const base = import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'
  return `${base}${path}`
}

/**
 * Debounce a function
 */
export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
