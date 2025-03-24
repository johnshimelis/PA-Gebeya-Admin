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

// Utility function to highlight matching text
const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, '<span style="background-color: yellow;">$1</span>');
};

const OrdersTable = ({ resultsPerPage, filter, searchTerm, allOrders, onRowClick }) => {
  const [page, setPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // Filter orders based on search term and status
    let filteredData = allOrders;

    // Apply status filter
    if (filter !== "all") {
      filteredData = allOrders.filter((order) => order.status.toLowerCase() === filter.toLowerCase());
    }

    // Apply search term filter
    if (searchTerm) {
      filteredData = filteredData.filter((order) =>
        order.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTotalResults(filteredData.length);
    const paginatedData = filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage);
    setFilteredOrders(paginatedData);
  }, [page, filter, searchTerm, resultsPerPage, allOrders]);

  const onPageChange = (p) => setPage(p);

  return (
    <div className="overflow-x-auto">
      <TableContainer className="mb-8">
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
            {filteredOrders.map((order) => {
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
                      <Avatar
                        className="hidden mr-2 md:block"
                        src={order.avatar || "/default-avatar.png"}
                        alt="User Avatar"
                        onError={(e) => { 
                          console.error(`Failed to load avatar: ${order.avatar}`); 
                          e.target.src = "/default-avatar.png"; 
                        }}
                      />
                      <div>
                        {/* Highlight the matching text in the client name */}
                        <p
                          className="font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(order.name, searchTerm),
                          }}
                        />
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
                        src={order.paymentImage}
                        alt="Payment"
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => { 
                          console.error(`Failed to load payment image: ${order.paymentImage}`); 
                          e.target.src = "/fallback-payment.png"; 
                        }}
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
      </TableContainer>
    </div>
  );
};

export default OrdersTable;