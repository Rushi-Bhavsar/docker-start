import React from "react";
import { Link } from "react-router-dom";

const OtherPage = () => {
  return (
    <div>
      I am some other page
      <Link to="/">Go back home</Link>
    </div>
  );
};

export default OtherPage;
