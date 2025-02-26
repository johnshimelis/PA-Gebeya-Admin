import React, { useState, useEffect } from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Pagination,
} from "@windmill/react-ui";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";

const OrdersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();
  const location = useLocation();

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders`);
        let filteredData = data;

        if (filter === "paid") {
          filteredData = data.filter((order) => order.status === "Paid");
        } else if (filter === "un-paid") {
          filteredData = data.filter((order) => order.status === "Un-paid");
        } else if (filter === "completed") {
          filteredData = data.filter((order) => order.status === "Completed");
        }

        setTotalResults(filteredData.length);
        const paginatedData = filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage);
        setOrders(paginatedData);
      } catch (error) {
        setError("Failed to fetch orders. Please try again.");
      }
      setLoading(false);
    };

    fetchOrders();
  }, [page, resultsPerPage, filter]);

  // Update order if changed in another page
  useEffect(() => {
    if (location.state?.updatedOrder) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === location.state.updatedOrder.id ? location.state.updatedOrder : order
        )
      );
    }
  }, [location.state]);

  const onPageChange = (p) => setPage(p);

  return (
    <div className="overflow-x-auto">
      <TableContainer className="mb-8">
        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <Table className="min-w-full">
              <TableHeader>
                <tr className="text-xs md:text-sm">
                  <TableCell className="w-24 md:w-auto">Client</TableCell>
                  <TableCell className="w-20 md:w-auto">Order ID</TableCell>
                  <TableCell className="w-20 md:w-auto">Amount</TableCell>
                  <TableCell className="w-20 md:w-auto">Quantity</TableCell>
                  <TableCell className="hidden md:table-cell">Payment</TableCell>
                  <TableCell className="w-20 md:w-auto">Status</TableCell>
                  <TableCell className="w-28 md:w-auto">Date</TableCell>
                  <TableCell className="hidden md:table-cell">Phone</TableCell>
                  <TableCell className="hidden lg:table-cell">Address</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const totalQuantity = order.orderDetails.reduce((acc, item) => acc + item.quantity, 0);

                  return (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() =>
                        history.push({
                          pathname: `/order-detail/${order.id}`,
                          state: { order },
                        })
                      }
                    >
                      <TableCell>
                        <div className="flex items-center text-xs md:text-sm">
                          {/* ✅ Fixed Avatar URL */}
                          <Avatar 
  className="hidden mr-2 md:block" 
  src={order.avatar ? `http://localhost:5000${order.avatar}` : "/default-avatar.png"} 
  alt="User Avatar" 
  onError={(e) => { e.target.src = "/default-avatar.png"; }} // Fallback image
/>


                          <div>
                            <p className="font-semibold">{order.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs md:text-sm">#000{order.id || "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs md:text-sm">$ {order.amount || "0.00"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs md:text-sm">{totalQuantity || 0}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {order.paymentImage ? (
                          <img
                            src={`http://localhost:5000${order.paymentImage}`} // ✅ Fixed URL
                            alt="Payment"
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">No Image</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`px-3 py-1 rounded-lg text-white ${
                            order.status === "Pending" ? "bg-yellow-500" :
                            order.status === "Approved" || order.status === "Delivered" ? "bg-green-500" :
                            order.status === "Un-paid" ? "bg-red-500" :
                            "bg-gray-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {/* ✅ Fixed Date Display */}
                        <span className="text-xs md:text-sm">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs md:text-sm">{order.phoneNumber || "N/A"}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs md:text-sm">{order.deliveryAddress || "N/A"}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                label="Table navigation"
                onChange={onPageChange}
              />
            </TableFooter>
          </>
        )}
      </TableContainer>
    </div>
  );
};

export default OrdersTable;
