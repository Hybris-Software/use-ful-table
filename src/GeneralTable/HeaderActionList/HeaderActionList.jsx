import React, { useState } from "react";

//Components
import ConditionalComponent from "../ConditionalComponent/ConditionalComponent";

//Icon
import { BiDotsVerticalRounded } from "react-icons/bi";

// Styles
import Style from "./HeaderActionList.module.css";

function HeaderActionList({ column, tableRef, setHiddenColumns }) {
  const [showActionList, setShowActionList] = useState(false);

  return (
    <div onMouseLeave={() => setShowActionList(false)}>
      <BiDotsVerticalRounded
        onClick={() => setShowActionList(!showActionList)}
        className={Style.headerActions}
        size={"20"}
      />
      <ConditionalComponent condition={showActionList}>
        <div className={Style.columnActions}>
          <ConditionalComponent condition={column.sortable !== false}>
            <div
              onClick={() => {
                tableRef.current.setSortingSettings(column.orderField)
              }}
            >
              Sort by ASC
            </div>
          </ConditionalComponent>
          <ConditionalComponent condition={column.sortable !== false}>
            <div
              onClick={() => {
                tableRef.current.setSortingSettings("-"+column.orderField)
              }}
            >
              Sort by DESC
            </div>
          </ConditionalComponent>

          <div
            onClick={() => {
              setHiddenColumns((oldState) => [...oldState, column.orderField]);
            }}
          >
            Hide this columns
          </div>
          <div
            onClick={() => {
              setHiddenColumns([]);
            }}
          >
            Show all columns
          </div>
        </div>
      </ConditionalComponent>
    </div>
  );
}

export default HeaderActionList;
