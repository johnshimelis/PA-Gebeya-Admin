import React, { createContext, useContext, useState } from 'react';

// Create a Context for orders
const OrderContext = createContext();

// Custom hook to access the context
export const useOrder = () => {
  return useContext(OrderContext);
};

// Provider component to wrap the app and provide order data
export const OrderProvider = ({ children }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const saveOrder = (order) => {
    setSelectedOrder(order);
  };

  return (
    <OrderContext.Provider value={{ selectedOrder, saveOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
