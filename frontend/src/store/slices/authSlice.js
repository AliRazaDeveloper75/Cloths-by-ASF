import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import { toast } from 'react-toastify'

// Load initial auth state from localStorage
const savedUser = JSON.parse(localStorage.getItem('user') || 'null')
const savedToken = localStorage.getItem('access_token')

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login/', credentials)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Login failed' })
  }
})

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register/', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Registration failed' })
  }
})

export const fetchProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/profile/')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.patch('/auth/profile/', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.access
        state.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('access_token', action.payload.access)
        localStorage.setItem('refresh_token', action.payload.refresh)
        toast.success(`Welcome back, ${action.payload.user.first_name}!`)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload?.detail || 'Login failed')
      })
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.access
        state.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('access_token', action.payload.access)
        localStorage.setItem('refresh_token', action.payload.refresh)
        toast.success('Account created successfully! Welcome aboard!')
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        const payload = action.payload
        if (payload && typeof payload === 'object') {
          const firstEntry = Object.entries(payload)[0]
          const msg = Array.isArray(firstEntry[1]) ? firstEntry[1][0] : firstEntry[1]
          toast.error(`${firstEntry[0]}: ${msg}`)
        } else {
          toast.error('Registration failed')
        }
      })
      // Fetch profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem('user', JSON.stringify(action.payload))
        toast.success('Profile updated successfully!')
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
