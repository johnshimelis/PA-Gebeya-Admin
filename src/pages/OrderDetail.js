import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Button, Select, Card } from "@windmill/react-ui";
import axios from "axios";

const OrderDetail = ({ orders = [], setOrders = () => {} }) => {
  const location = useLocation();
  const history = useHistory();
  const { order } = location.state || {}; // Get order from state

  const [status, setStatus] = useState(order?.status || "Pending");

  if (!order) {
    return <div className="text-red-500 text-xl font-semibold p-6">Order not found!</div>;
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`https://pa-gebeya-backend.onrender.com/api/orders/${order.id}`, { status });

      if (response.status === 200) {
        const updatedOrders = orders.map((o) =>
          o.id === order.id ? { ...o, status } : o
        );
        setOrders(updatedOrders);

        // ✅ If status is "Delivered", update product stock
        if (status === "Delivered") {
          await Promise.all(
            order.orderDetails.map(async (item) => {
              const productId = item.productId || item._id; // Ensure we have the correct product ID
              const quantity = item.quantity; // The exact quantity of this product in the order

              console.log(`🔍 Updating product: ${productId}, Sold: ${quantity}`);

              if (!productId) {
                console.error("❌ Error: productId is undefined for item:", item);
                return;
              }

              try {
                // Get the current product data
                const productResponse = await axios.get(`https://pa-gebeya-backend.onrender.com/api/products/${productId}`);
                const product = productResponse.data;

                // ✅ Correct the sold and stockQuantity update
                await axios.put(`https://pa-gebeya-backend.onrender.com/api/products/${productId}`, {
                  sold: quantity, // ✅ Set sold to the exact quantity in the order
                  stockQuantity: product.stockQuantity - quantity, // ✅ Subtract only the current sold amount
                });

                console.log(`✅ Product ${productId} updated: Sold = ${quantity}, Stock = ${product.stockQuantity - quantity}`);
              } catch (error) {
                console.error(`❌ Error updating product ${productId}:`, error);
              }
            })
          );
        }

        history.push({
          pathname: "/app/orders",
          state: { updatedOrders },
        });
      }
    } catch (error) {
      console.error("❌ Error updating order status:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Order Details</h1>

      {/* Order Details & Payment Proof */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center">
          <img
            src={`https://pa-gebeya-backend.onrender.com${order.avatar}`}
            alt="Client Avatar"
            className="w-24 h-24 rounded-full shadow-md mb-4"
            onError={(e) => { e.target.src = "/default-avatar.png"; }} // Fallback for avatar
          />
          <p className="text-lg"><strong>Order ID:</strong> #{order.id}</p>
          <p className="text-lg"><strong>Client Name:</strong> {order.name}</p>
          <p className="text-lg"><strong>Status:</strong> {status}</p>
          <p className="text-lg"><strong>Total Amount:</strong> ETB {order.amount}</p>
          <p className="text-lg"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        {order.paymentImage && (
          <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Payment Proof</h2>
            <img
              src={`https://pa-gebeya-backend.onrender.com${order.paymentImage}`}
              alt="Payment"
              className="w-64 h-auto rounded-lg shadow-md"
              onError={(e) => { e.target.src = "/fallback-payment.png"; }} // Fallback for payment image
            />
          </div>
        )}
      </div>

      {/* Order Items */}
      <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(order.orderDetails) ? (
          order.orderDetails.map((item, index) => {
            // Debugging: Log the productImage path
            console.log(`Product Image Path for Item ${index}:`, item.productImage);

            return (
              <Card key={index} className="p-4 border rounded-lg shadow-md bg-gray-50">
                {item.productImage ? (
  <img
    src={`https://pa-gebeya-backend.onrender.com${item.productImage.startsWith("/") ? item.productImage : `/${item.productImage}`}`}
    alt={item.product}
    className="w-full h-40 object-cover rounded-md mb-4"
    onError={(e) => { 
      console.error(`❌ Image failed to load: ${item.productImage}`); 
      e.target.src = "/fallback-product.png"; 
    }} // Improved error logging
  />
) : (
  <p className="text-gray-500 text-center">No Image Available</p>
)}

                <p className="text-lg font-semibold">{item.product}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> ETB {item.price}</p>
                <p><strong>Total:</strong> ETB {item.quantity * item.price}</p>
              </Card>
            );
          })
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
          <option value="Cancelled">Cancelled</option>
        </Select>
        <Button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Submit Status
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;