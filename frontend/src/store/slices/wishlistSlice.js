import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import { toast } from 'react-toastify'

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/wishlist/')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { rejectWithValue }) => {
  try {
    const res = await api.post('/wishlist/', { product_id: productId })
    const action = res.data.action
    toast[action === 'added' ? 'success' : 'info'](
      action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist'
    )
    return res.data.wishlist
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    products: [],
    count: 0,
    loading: false,
  },
  reducers: {
    resetWishlist: (state) => {
      state.products = []
      state.count = 0
    },
  },
  extraReducers: (builder) => {
    const setWishlist = (state, action) => {
      state.loading = false
      if (action.payload) {
        state.products = action.payload.products || []
        state.count = action.payload.count || 0
      }
    }
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true })
      .addCase(fetchWishlist.fulfilled, setWishlist)
      .addCase(fetchWishlist.rejected, (state) => { state.loading = false })
      .addCase(toggleWishlist.fulfilled, setWishlist)
  },
})

export const { resetWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
