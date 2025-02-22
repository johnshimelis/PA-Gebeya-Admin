import React, { useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom"; // Replaced useNavigate with useHistory
import { useHistory } from 'react-router-dom'; // Changed to useHistory

import { HomeIcon } from "../icons";
import { Card, CardBody, Label, Select } from "@windmill/react-ui";
import OrdersTable from "../components/OrdersTable";

function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const Orders = () => {
  // Pagination setup
  const [resultsPerPage, setResultPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
  const history = useHistory(); // Changed from useNavigate to useHistory

  const handleFilter = (filter_name) => {
    if (filter_name === "All") {
      setFilter("all");
    } else if (filter_name === "Un-Paid Orders") {
      setFilter("un-paid");
    } else if (filter_name === "Paid Orders") {
      setFilter("paid");
    } else if (filter_name === "Completed") {
      setFilter("completed");
    }
  };

  // Function to handle row click and navigate to order details page
  const handleRowClick = (orderId) => {
    history.push(`/app/orderDetail/${orderId}`); // Changed from navigate.push to history.push
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
                <option>Un-Paid Orders</option>
                <option>Paid Orders</option>
                <option>Completed</option>
              </Select>
            </Label>

            <Label className="">
              <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                <input
                  type="number"
                  className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  value={resultsPerPage}
                  onChange={(e) => setResultPerPage(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                  Results on Table
                </div>
              </div>
            </Label>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <OrdersTable
        resultsPerPage={resultsPerPage}
        filter={filter}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default Orders;
