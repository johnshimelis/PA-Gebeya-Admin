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
  Badge,
  Pagination,
} from "@windmill/react-ui";
import { useHistory, useLocation } from "react-router-dom";
import response from "../utils/demo/ordersData";

const OrdersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    let filteredData = response;

    if (filter === "paid") {
      filteredData = response.filter((order) => order.status === "Paid");
    } else if (filter === "un-paid") {
      filteredData = response.filter((order) => order.status === "Un-paid");
    } else if (filter === "completed") {
      filteredData = response.filter((order) => order.status === "Completed");
    }

    const paginatedData = filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage);
    setOrders(paginatedData);
  }, [page, resultsPerPage, filter]);

  useEffect(() => {
    if (location.state && location.state.updatedOrder) {
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
                      <Avatar className="hidden mr-2 md:block" src={order.avatar} alt="User" />
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
                        src={order.paymentImage}
                        alt="Payment"
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No Image</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      type={
                        order.status === "Un-paid"
                          ? "danger"
                          : order.status === "Paid"
                          ? "success"
                          : order.status === "Completed"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {order.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs md:text-sm">
                      {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
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
            totalResults={response.length}
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
