import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    cartTotalQuanty: 0,
    cartTotalAmount: 0,
};

const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const ItemIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);
            if (ItemIndex >=0) {
            state.cartItems[ItemIndex].cartQuantity += 1;
            } else {
            const tempProduct = { ...action.payload, cartQuantity: 1 }; 
            state.cartItems.push( action.tempProduct);
        }
    }
 }

});

export const { addToCart } = CartSlice.actions;
export default CartSlice.reducer;