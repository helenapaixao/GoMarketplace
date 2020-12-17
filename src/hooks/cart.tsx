import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const STORAGE_KEY = '@GoMarketplace:products';

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const response = await AsyncStorage.getItem(STORAGE_KEY);
      if (response) {
        setProducts([...JSON.parse(response)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    // TODO ADD A NEW ITEM TO THE CART
  }, []);

  const increment = useCallback(
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
    async id => {
      const filterProducts = products.filter(product => product.id !== id);

      const newProduct = products.find(product => product.id === id);
      if (newProduct) {
        newProduct.quantity += 1;
        setProducts([...filterProducts, newProduct]);
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const filterProducts = products.filter(product => product.id !== id);
      const newProduct = products.find(product => product.id === id);

      if (newProduct) {
        if (newProduct.quantity <= 1) {
          setProducts([...filterProducts]);
        } else {
          setProducts([...filterProducts, newProduct]);
        }
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
