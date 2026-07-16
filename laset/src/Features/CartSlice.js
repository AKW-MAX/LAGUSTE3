import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import { parseStoredJson } from "../utils/storage";

const getInitialCartItems = () => {
    const parsedItems = parseStoredJson("cartItems", []);
    return Array.isArray(parsedItems) ? parsedItems : [];
};

const calculateTotals = (cartItems) =>
    cartItems.reduce(
        (totals, item) => {
            const quantity = Number(item.cartQuantity) || 0;
            totals.cartTotalQuantity += quantity;
            totals.cartTotalAmount += Number(item.price) * quantity;
            return totals;
        },
        { cartTotalQuantity: 0, cartTotalAmount: 0 }
    );

const initialCartItems = getInitialCartItems();
const initialTotals = calculateTotals(initialCartItems);

const initialState = {
    cartItems: initialCartItems,
    cartTotalQuantity: initialTotals.cartTotalQuantity,
    // Keep legacy key for backward compatibility with older persisted state/UI usage.
    cartTotalQuanty: initialTotals.cartTotalQuantity,
    cartTotalAmount: initialTotals.cartTotalAmount,
};

const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            if (!action.payload || !action.payload._id) {
                console.error('Invalid product payload:', action.payload);
                return;
            }
            const itemIndex = state.cartItems.findIndex((item) => item._id === action.payload._id);
            if (itemIndex >= 0) {
                state.cartItems[itemIndex].cartQuantity += 1;
                toast.info(`Increased ${state.cartItems[itemIndex].name} quantity`, {
                    position: "bottom-left",
                });
            } else {
                const tempProduct = { ...action.payload, cartQuantity: 1 };
                state.cartItems.push(tempProduct);
                toast.success(`${action.payload.name} added to cart`, {
                    position: "bottom-left",
                });
            }
            const totals = calculateTotals(state.cartItems);
            state.cartTotalQuantity = totals.cartTotalQuantity;
            state.cartTotalQuanty = totals.cartTotalQuantity;
            state.cartTotalAmount = totals.cartTotalAmount;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        
        /*remove from cart items*/
        removeFromCart: (state, action) => {
            if (!action.payload || !action.payload._id) {
                console.error('Invalid remove payload:', action.payload);
                return;
            }
            state.cartItems = state.cartItems.filter((cartItem) => cartItem._id !== action.payload._id);
            const totals = calculateTotals(state.cartItems);
            state.cartTotalQuantity = totals.cartTotalQuantity;
            state.cartTotalQuanty = totals.cartTotalQuantity;
            state.cartTotalAmount = totals.cartTotalAmount;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));

            toast.error(`${action.payload.name} removed from cart`, {
                position: "bottom-left",
            });
        },

        decreaseCart: (state, action) => {
            if (!action.payload || !action.payload._id) {
                console.error('Invalid decrease payload:', action.payload);
                return;
            }
            const itemIndex = state.cartItems.findIndex((cartItem) => cartItem._id === action.payload._id);
            if (itemIndex === -1) return;

            if (state.cartItems[itemIndex].cartQuantity > 1) {
                state.cartItems[itemIndex].cartQuantity -= 1;
                toast.info(`Decreased ${state.cartItems[itemIndex].name} quantity`, {
                    position: "bottom-left",
                });
            } else {
                // quantity === 1 -> remove item
                state.cartItems.splice(itemIndex, 1);
                toast.error(`${action.payload.name} removed from cart`, {
                    position: "bottom-left",
                });
            }
            const totals = calculateTotals(state.cartItems);
            state.cartTotalQuantity = totals.cartTotalQuantity;
            state.cartTotalQuanty = totals.cartTotalQuantity;
            state.cartTotalAmount = totals.cartTotalAmount;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        clearCart: (state) => {
        state.cartItems = [];
        state.cartTotalAmount = 0;
        state.cartTotalQuantity = 0;
        state.cartTotalQuanty = 0;
        localStorage.removeItem("cartItems");
        }
    
        
    },
});

export const { addToCart, removeFromCart, decreaseCart, clearCart } = CartSlice.actions;
export default CartSlice.reducer;