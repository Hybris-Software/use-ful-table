import React from "react";

// Styles
import Style from "../Table.module.scss";

const Loader = () => {
  return (
    <div className={Style.noResults}>
      <div className={Style.ldsRing}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
