import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '@/services/api'
import { PageLoader } from '@/components/common/Loader'

const Field = ({ label, error, children, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

const inputCls = (err) =>
  `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50 transition-colors ${
    err ? 'border-red-400 bg-red-50' : 'border-gray-300'
  }`

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [categories, setCategories] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [newImageFiles, setNewImageFiles] = useState([])
  const [newImagePreviews, setNewImagePreviews] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { is_active: true, is_featured: false },
  })

  // Load categories + product (if editing)
  useEffect(() => {
    api.get('/products/admin/categories/')
      .then((r) => setCategories(r.data?.results ?? r.data ?? []))
      .catch(() => {})

    if (isEdit) {
      api.get(`/products/admin/products/${id}/`)
        .then((r) => {
          const p = r.data
          reset({
            name: p.name,
            short_description: p.short_description ?? '',
            description: p.description,
            category: p.category?.id ?? '',
            price: p.price,
            discount_price: p.discount_price ?? '',
            stock: p.stock,
            sku: p.sku ?? '',
            brand: p.brand ?? '',
            weight: p.weight ?? '',
            is_active: p.is_active,
            is_featured: p.is_featured,
          })
          setExistingImages(p.images ?? [])
        })
        .catch(() => toast.error('Failed to load product'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit, reset])

  // Handle new image file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setNewImageFiles(files)
    setNewImagePreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const removeNewImage = (idx) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const deleteExistingImage = async (imgId) => {
    try {
      await api.delete(`/products/admin/products/${id}/images/`, { data: { image_id: imgId } })
      setExistingImages((prev) => prev.filter((img) => img.id !== imgId))
      toast.success('Image removed')
    } catch {
      toast.error('Failed to remove image')
    }
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = {
        ...data,
        category: data.category || null,
        discount_price: data.discount_price || null,
        weight: data.weight || null,
      }

      // Step 1 – create / update product record
      let res
      if (isEdit) {
        res = await api.patch(`/products/admin/products/${id}/`, payload)
      } else {
        res = await api.post('/products/admin/products/', payload)
      }

      const productId = res.data.id
      if (!productId) throw new Error('Server did not return a product ID')

      // Step 2 – upload images only after product is confirmed saved
      if (newImageFiles.length > 0) {
        const formData = new FormData()
        newImageFiles.forEach((f) => formData.append('images', f))
        await api.post(`/products/admin/products/${productId}/images/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      toast.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!')
      navigate('/admin/products')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        // Show the first field-level error message from DRF
        const firstEntry = Object.entries(data)[0]
        const msg = Array.isArray(firstEntry[1]) ? firstEntry[1][0] : firstEntry[1]
        toast.error(`${firstEntry[0]}: ${msg}`)
      } else {
        toast.error(err.message || 'Failed to save product')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Product' : 'Add Product'} – Admin | Cloth by AFS</title></Helmet>

      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            title="Go back"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-sm text-gray-500">
              {isEdit ? 'Update product details and images' : 'Fill in the details below to add a product'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* ── Basic Info ───────────────────────────────────────── */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-800">Basic Information</h2>

            <Field label="Product Name" required error={errors.name?.message}>
              <input
                {...register('name', { required: 'Product name is required' })}
                placeholder="e.g. Premium Cotton Kameez"
                className={inputCls(errors.name)}
              />
            </Field>

            <Field label="Short Description">
              <input
                {...register('short_description')}
                placeholder="Brief one-line description (shown in listings)"
                maxLength={300}
                className={inputCls(false)}
              />
            </Field>

            <Field label="Full Description" required error={errors.description?.message}>
              <textarea
                {...register('description', { required: 'Description is required' })}
                placeholder="Detailed product description, material, care instructions…"
                rows={5}
                className={inputCls(errors.description)}
              />
            </Field>
          </section>

          {/* ── Pricing & Inventory ───────────────────────────────── */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-800">Pricing & Inventory</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Price (PKR)" required error={errors.price?.message}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { required: 'Price is required', min: { value: 0, message: 'Must be ≥ 0' } })}
                  placeholder="0.00"
                  className={inputCls(errors.price)}
                />
              </Field>

              <Field label="Discount Price (optional)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('discount_price')}
                  placeholder="Leave blank if no discount"
                  className={inputCls(false)}
                />
              </Field>

              <Field label="Stock Quantity" required error={errors.stock?.message}>
                <input
                  type="number"
                  min="0"
                  {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Must be ≥ 0' } })}
                  placeholder="0"
                  className={inputCls(errors.stock)}
                />
              </Field>

              <Field label="SKU (Stock Keeping Unit)">
                <input
                  {...register('sku')}
                  placeholder="e.g. AFS-KMZ-001"
                  className={inputCls(false)}
                />
              </Field>
            </div>
          </section>

          {/* ── Details ──────────────────────────────────────────── */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-800">Category & Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category">
                <select {...register('category')} className={inputCls(false)}>
                  <option value="">— Select category —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Brand">
                <input
                  {...register('brand')}
                  placeholder="e.g. Cloth by AFS"
                  className={inputCls(false)}
                />
              </Field>

              <Field label="Weight (kg)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('weight')}
                  placeholder="0.5"
                  className={inputCls(false)}
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-6 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="w-4 h-4 rounded border-gray-300 accent-[#f09c27]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active <span className="font-normal text-gray-400">(visible in store)</span>
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('is_featured')}
                  className="w-4 h-4 rounded border-gray-300 accent-[#f09c27]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured <span className="font-normal text-gray-400">(shown on homepage)</span>
                </span>
              </label>
            </div>
          </section>

          {/* ── Images ───────────────────────────────────────────── */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-800">Product Images</h2>

            {/* Existing images (edit mode) */}
            {isEdit && existingImages.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Current images</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group w-20 h-20">
                      <img
                        src={img.image}
                        alt=""
                        className="w-full h-full object-cover rounded-xl border border-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => deleteExistingImage(img.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      {img.is_primary && (
                        <span className="absolute bottom-0 inset-x-0 bg-[#f09c27] text-white text-[10px] text-center py-0.5 rounded-b-xl">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {newImagePreviews.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Images to upload ({newImagePreviews.length})</p>
                <div className="flex flex-wrap gap-3">
                  {newImagePreviews.map((src, i) => (
                    <div key={i} className="relative group w-20 h-20">
                      <img src={src} alt="" className="w-full h-full object-cover rounded-xl border-2 border-[#f09c27]/40" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload area */}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#f09c27] hover:bg-[#f09c27]/5 transition-colors">
              <span className="text-3xl mb-1">📷</span>
              <span className="text-sm font-medium text-gray-600">Click to upload images</span>
              <span className="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP — up to 5 MB each</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </section>

          {/* ── Actions ─────────────────────────────────────────── */}
          <div className="flex items-center gap-3 pb-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-[#f09c27] hover:bg-[#d4821a] text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg text-sm hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
