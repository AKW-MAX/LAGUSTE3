import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
    status: null,
    error: null,
};

export const productsFetch = createAsyncThunk(
    'products/productsFetch',
    async (id = null, { rejectWithValue }) => {
        try {
            const apiBaseUrl = window.location.hostname === "localhost"
                ? "http://localhost:5000"
                : import.meta.env.VITE_API_URL || "https://agriventure-enterprise-backend.onrender.com";
            const response = await axios.get(`${apiBaseUrl}/Products`);
            return response.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch products");
        }
    }
);

const ProductsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(productsFetch.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(productsFetch.fulfilled, (state, action) => {
                state.status = 'success';
                state.items = action.payload;
            })
            .addCase(productsFetch.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            });
    }
});

export default ProductsSlice.reducer;