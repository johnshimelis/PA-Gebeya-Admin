import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, Select, Card } from '@windmill/react-ui';

const OrderDetail = ({ orders = [], setOrders }) => {
  const location = useLocation();
  const history = useHistory();
  const { order } = location.state || {}; // Get order from state

  // Always call useState at the top level
  const [status, setStatus] = useState(order?.status || "Pending");

  if (!order) {
    return <div className="text-red-500 text-xl font-semibold p-6">Order not found!</div>;
  }

  // Ensure finalSetOrders falls back gracefully if not passed
  const finalSetOrders = setOrders || location.state?.setOrders || (() => console.error("setOrders is missing"));
const handleSubmit = () => {
  if (!Array.isArray(orders)) {
    console.error("Orders data is missing or not an array:", orders);
    return;
  }

  if (typeof finalSetOrders !== "function") {
    console.error("setOrders is not a function or is missing.");
    return;
  }

  // Update the order status in the orders array
  const updatedOrders = orders.map((o) =>
    o.id === order.id ? { ...o, status } : o
  );

  finalSetOrders(updatedOrders);
  console.log("Updated Orders:", updatedOrders);

  history.push({
    pathname: "/app/orders",
    state: { updatedOrders }, // ✅ Pass updated orders back
  });
};


  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Order Details</h1>

      {/* Order Details & Payment Proof - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-lg"><strong>Order ID:</strong> #{order.id}</p>
          <p className="text-lg"><strong>Client Name:</strong> {order.name}</p>
          <p className="text-lg"><strong>Status:</strong> {status}</p>
          <p className="text-lg"><strong>Total Amount:</strong> ${order.amount}</p>
          <p className="text-lg"><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
        </div>

        {order.paymentImage && (
          <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Payment Proof</h2>
            <img 
              src={order.paymentImage} 
              alt="Payment" 
              className="w-64 h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Order Items - Displayed in Cards */}
      <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(order.orderDetails) ? (
          order.orderDetails.map((item, index) => (
            <Card key={index} className="p-4 border rounded-lg shadow-md bg-gray-50">
              <img 
                src={item.productImage} 
                alt={item.product} 
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <p className="text-lg font-semibold">{item.product}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ${item.price}</p>
              <p><strong>Total:</strong> ${item.quantity * item.price}</p>
            </Card>
          ))
        ) : (
          <p className="text-red-500">No order details available.</p>
        )}
      </div>

      {/* Order Status Dropdown */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Update Order Status</h2>
        <Select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="w-full md:w-1/2 p-2 border rounded-lg mb-4"
        >
          <option value="Pending">Pending</option>
          <option value="Un-paid">Un-paid</option>
          <option value="Paid">Paid</option>
          <option value="Delivered">Delivered</option>
          <option value="Approved">Approved</option>
          <option value="Processing">Processing</option>
          <option value="Canceled">Canceled</option>
        </Select>
        <Button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Submit Status
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
