import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { MdCategory, MdUpload, MdClose } from 'react-icons/md'
import api from '@/services/api'
import { PageLoader } from '@/components/common/Loader'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef()

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm()

  const load = async () => {
    try {
      const res = await api.get('/products/admin/categories/')
      setCategories(res.data?.results ?? res.data ?? [])
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setImageFile(null)
    setImagePreview(null)
    reset({ name: '', description: '', is_active: true })
    setShowForm(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setImageFile(null)
    setImagePreview(cat.image || null)
    setValue('name', cat.name)
    setValue('description', cat.description ?? '')
    setValue('is_active', cat.is_active)
    setShowForm(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description || '')
      formData.append('is_active', data.is_active ? 'true' : 'false')
      if (imageFile) {
        formData.append('image', imageFile)
      } else if (!imagePreview && editing?.image) {
        // user removed existing image
        formData.append('image', '')
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } }

      if (editing) {
        await api.patch(`/products/admin/categories/${editing.id}/`, formData, config)
        toast.success('Category updated!')
      } else {
        await api.post('/products/admin/categories/', formData, config)
        toast.success('Category created!')
      }
      setShowForm(false)
      setEditing(null)
      setImageFile(null)
      setImagePreview(null)
      reset()
      load()
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || err.response?.data?.detail || 'Failed to save'
      toast.error(msg)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Products using it will be uncategorised.')) return
    try {
      await api.delete(`/products/admin/categories/${id}/`)
      toast.success('Category deleted')
      load()
    } catch {
      toast.error('Cannot delete — category may be in use')
    }
  }

  const closeForm = () => { setShowForm(false); setEditing(null); setImageFile(null); setImagePreview(null); reset() }

  if (loading) return <PageLoader />

  return (
    <>
      <Helmet><title>Categories – Admin | Cloth by AFS</title></Helmet>

      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Categories</h1>
          <button onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f09c27] hover:bg-[#d4821a] text-white text-sm font-semibold rounded-lg transition-colors">
            + Add Category
          </button>
        </div>

        {/* Form Panel */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f09c27]/30">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-800">
                {editing ? `Edit: ${editing.name}` : 'New Category'}
              </h2>
              <button onClick={closeForm} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <MdClose className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left — fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      placeholder="e.g. Kameez, Abayas, Accessories"
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      placeholder="Short description (optional)"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f09c27]/50 resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('is_active')}
                      className="w-4 h-4 rounded border-gray-300 accent-[#f09c27]"
                    />
                    <span className="text-sm font-medium text-gray-700">Active (visible in store)</span>
                  </label>
                </div>

                {/* Right — image upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category Image
                    <span className="text-gray-400 font-normal ml-1">(shown on homepage)</span>
                  </label>

                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ height: '160px' }}>
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow">
                        <MdClose className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/40 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="text-white text-xs font-medium hover:underline">
                          Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full rounded-xl border-2 border-dashed border-gray-300 hover:border-[#f09c27] transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#f09c27] bg-gray-50"
                      style={{ height: '160px' }}>
                      <MdUpload className="w-8 h-8" />
                      <span className="text-sm font-medium">Click to upload image</span>
                      <span className="text-xs">PNG, JPG, WEBP — max 5MB</span>
                    </button>
                  )}

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#f09c27] hover:bg-[#d4821a] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60">
                  {isSubmitting ? 'Saving…' : editing ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:border-gray-400 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {categories.length === 0 ? (
            <div className="py-16 text-center">
              <MdCategory className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No categories yet</p>
              <button onClick={openAdd} className="mt-3 text-sm text-[#f09c27] hover:underline font-semibold">
                Create your first category →
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Image', 'Name', 'Slug', 'Products', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    {/* Image */}
                    <td className="px-4 py-3">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <MdCategory className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    {/* Name */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{cat.name}</p>
                      {cat.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{cat.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{cat.product_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(cat)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(cat.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
