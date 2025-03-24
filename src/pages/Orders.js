import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { HomeIcon } from "../icons";
import { Card, CardBody, Label, Select, Input } from "@windmill/react-ui";
import OrdersTable from "../components/OrdersTable";
import axios from "axios";

function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const Orders = () => {
  const [resultsPerPage, setResultPerPage] = useState(10); // Default to 10 rows per page
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [allOrders, setAllOrders] = useState([]); // Store all orders
  const history = useHistory();

  useEffect(() => {
    // Fetch all orders once when the component mounts
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`https://pa-gebeya-backend.onrender.com/api/orders`);
        setAllOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleFilter = (filter_name) => {
    switch (filter_name) {
      case "All":
        setFilter("all");
        break;
      case "Pending":
        setFilter("pending");
        break;
      case "Processing":
        setFilter("processing");
        break;
      case "Un-paid":
        setFilter("un-paid");
        break;
      case "Paid":
        setFilter("paid");
        break;
      case "Delivered":
        setFilter("delivered");
        break;
      case "Cancelled":
        setFilter("cancelled");
        break;
      case "Approved":
        setFilter("approved");
        break;
      case "Un-Paid Orders":
        setFilter("un-paid-orders");
        break;
      case "Completed":
        setFilter("completed");
        break;
      default:
        setFilter("all");
    }
  };

  const handleRowClick = (orderId) => {
    history.push(`/app/orderDetail/${orderId}`);
  };

  // Handle changes to the "Results on Table" input
  const handleResultsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setResultPerPage(value);
    }
  };

  return (
    <div>
      <PageTitle>Orders</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Orders</p>
      </div>

      {/* Sorting and Filters */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Filter Orders
              </p>

              <Label className="mx-3">
                <Select
                  className="py-3"
                  onChange={(e) => handleFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Un-paid</option>
                  <option>Paid</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                  <option>Approved</option>
                  <option>Un-Paid Orders</option>
                  <option>Completed</option>
                </Select>
              </Label>

              <Label className="">
                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                  <input
                    type="number"
                    className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    value={resultsPerPage}
                    onChange={handleResultsPerPageChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                    Results on Table
                  </div>
                </div>
              </Label>
            </div>

            {/* Search Bar */}
            <div className="flex items-center">
              <Input
                className="w-64 py-3 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <OrdersTable
        resultsPerPage={resultsPerPage}
        filter={filter}
        searchTerm={searchTerm}
        allOrders={allOrders} // Pass all orders to OrdersTable
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default Orders;