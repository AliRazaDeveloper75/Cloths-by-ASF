import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import { toast } from 'react-toastify'

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart/')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const addToCart = createAsyncThunk('cart/add', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart/', data)
    toast.success('Added to cart!')
    return res.data
  } catch (err) {
    toast.error(err.response?.data?.detail || 'Failed to add to cart')
    return rejectWithValue(err.response?.data)
  }
})

export const updateCartItem = createAsyncThunk('cart/updateItem', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/cart/items/${itemId}/`, { quantity })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const removeCartItem = createAsyncThunk('cart/removeItem', async (itemId, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/cart/items/${itemId}/`)
    toast.info('Item removed from cart')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart/')
    return { items: [], total_items: 0, subtotal: 0 }
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total_items: 0,
    subtotal: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.items = []
      state.total_items = 0
      state.subtotal = 0
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.loading = false
      if (action.payload) {
        state.items = action.payload.items || []
        state.total_items = action.payload.total_items || 0
        state.subtotal = action.payload.subtotal || 0
      }
    }
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, (state) => { state.loading = false })
      .addCase(addToCart.pending, (state) => { state.loading = true })
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, (state) => { state.loading = false })
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeCartItem.fulfilled, setCart)
      .addCase(clearCart.fulfilled, setCart)
  },
})

export const { resetCart } = cartSlice.actions
export default cartSlice.reducer
