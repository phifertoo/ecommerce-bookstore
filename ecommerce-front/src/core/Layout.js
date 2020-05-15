import React from "react";
import Menu from "./Menu";
import "../styles.css";

/* Layout is a dynamic component where you can pass in the title, description, className, children
props and it will render*/
const Layout = ({
  title = "Title",
  description = "Description",
  className,
  children,
}) => (
  <div>
    <Menu />
    <div className="jumbotron">
      <h2>{title}</h2>
      <p className="lead">{description}</p>
    </div>
    <div className={className}>{children}</div>
  </div>
);

export default Layout;
