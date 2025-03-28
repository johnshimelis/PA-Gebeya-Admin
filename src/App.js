import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";

// Move imports to the top
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/forgot-password" component={ForgotPassword} />
          
          {/* Place new routes over this */}
          <Route path="/order-detail/:id" component={OrderDetail} />

          <Route path="/app" component={Layout} />
          {/* If you have an index page, you can remove this Redirect */}
          <Redirect exact from="/" to="/login" />
        </Switch>
      </Router>
    </>
  );
}

export default App;
