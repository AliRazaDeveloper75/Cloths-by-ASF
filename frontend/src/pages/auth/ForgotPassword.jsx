import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import api from '@/services/api'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/auth/password-reset/', data)
      setSent(true)
    } catch {
      setSent(true) // Don't reveal if email exists
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet><title>Forgot Password – Cloth by AFS</title></Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-heading font-bold text-dark">
              Cloth <span className="text-primary">by AFS</span>
            </Link>
          </div>
          <div className="card p-8">
            {sent ? (
              <div className="text-center">
                <p className="text-5xl mb-4">📧</p>
                <h2 className="text-xl font-semibold mb-2">Check your email</h2>
                <p className="text-gray-600 text-sm">If an account exists with that email, we've sent a password reset link.</p>
                <Link to="/login" className="btn-primary inline-block mt-6">Back to Login</Link>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-semibold mb-2">Forgot your password?</h1>
                <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" {...register('email', { required: 'Email is required' })}
                      placeholder="you@example.com" className="input-field" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                  <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
