import { BrowserRouter} from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ProductsReducer, { productsFetch } from './Features/ProductsSlice';
import { ProductsApi } from './Features/ProductsApi';
import CartReducer from './Features/CartSlice';

export const store = configureStore({
  reducer: {
    products: ProductsReducer,
    cart: CartReducer,
    [ProductsApi.reducerPath]: ProductsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ProductsApi.middleware),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <Provider store={store}>
    <App />
  </Provider>
 </BrowserRouter> 
  </StrictMode>,
);
