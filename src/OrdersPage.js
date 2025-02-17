import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import OrdersTable from "./OrdersTable";
import OrderDetail from "./OrderDetail";
import ordersData from "../utils/demo/ordersData"; // Import initial orders

const OrdersPage = () => {
  const [orders, setOrders] = useState(ordersData); // ✅ State management here

  return (
    <Router>
      <Switch>
        <Route exact path="/orders">
          <OrdersTable orders={orders} setOrders={setOrders} />
        </Route>
        <Route path="/order-detail/:id">
          <OrderDetail orders={orders} setOrders={setOrders} />
        </Route>
      </Switch>
    </Router>
  );
};

export default OrdersPage;
