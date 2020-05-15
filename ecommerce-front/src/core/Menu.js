import React, { Fragment, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";

/* history is the path you are at. Therefore, when you are at /signin,
the history will be /signin. Therefore, when the history equals the specified route,
it will be considered the active class */
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

/*since we are using BrowserRouter, we have access to the history in the props.
The history is an object that contains the current path. We destructure the props to history*/
const Menu = ({ history }) => {
  const [run, setRun] = useState(false);
  useEffect(() => {
    setRun(!run);
  }, [itemTotal]);

  return (
    <div>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link to="/" className="nav-link" style={isActive(history, "/")}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/shop"
            className="nav-link"
            style={isActive(history, "/shop")}
          >
            Shop
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/cart"
            className="nav-link"
            style={isActive(history, "/cart")}
          >
            Cart{" "}
            <sup>
              <small className="cart-badge">{itemTotal()}</small>
            </sup>
          </Link>
        </li>
        {isAuthenticated() && isAuthenticated().user.role === 0 && (
          <li className="nav-item">
            <Link
              to="/user/dashboard"
              className="nav-link"
              style={isActive(history, "/user/dashboard")}
            >
              Dashboard
            </Link>
          </li>
        )}

        {isAuthenticated() && isAuthenticated().user.role === 1 && (
          <li className="nav-item">
            <Link
              to="/admin/dashboard"
              className="nav-link"
              style={isActive(history, "/admin/dashboard")}
            >
              Dashboard
            </Link>
          </li>
        )}

        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                to="/signin"
                className="nav-link"
                style={isActive(history, "/signin")}
              >
                Signin
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/signup"
                className="nav-link"
                style={isActive(history, "/signup")}
              >
                Signup
              </Link>
            </li>
          </Fragment>
        )}
        {isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <span
                onClick={() =>
                  signout(() => {
                    history.push("/signin");
                  })
                }
                className="nav-link"
                style={{ cursor: "pointer", color: "#ffffff" }}
              >
                Signout
              </span>
            </li>
          </Fragment>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
