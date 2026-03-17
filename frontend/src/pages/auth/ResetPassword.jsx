import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '@/services/api'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('new_password')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/auth/password-reset/confirm/', { ...data, token })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid or expired token')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500">Invalid reset link.</p>
        <Link to="/forgot-password" className="text-primary hover:underline">Request new link</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-xl font-semibold mb-6">Set New Password</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input type="password" {...register('new_password', { required: true, minLength: 8 })}
                className="input-field" placeholder="New password" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input type="password" {...register('new_password2', {
                required: true, validate: (v) => v === password || 'Passwords do not match'
              })} className="input-field" placeholder="Confirm password" />
              {errors.new_password2 && <p className="text-red-500 text-xs mt-1">{errors.new_password2.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
