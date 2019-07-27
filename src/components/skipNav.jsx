import React from "react";
import { Link } from "react-router-dom";

const SkipNav = () => {
  return (
    <Link to={"#content"} className="visually-hidden">
      Skip to main content
    </Link>
  );
};

export default SkipNav;
