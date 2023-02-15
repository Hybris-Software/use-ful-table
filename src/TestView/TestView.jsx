import React, { useRef } from "react";
import Table from "../Table/Table";

// Styles
import Style from "./TestView.module.css";

const TestView = () => {
  const columns = [
    {
      Header: "#",
      field: "id",
      sortable: false,
      accessor: (row) => {
        return row.id;
      },
    },
    {
      Header: "User",
      field: "user",
      accessor: (row) => {
        return row.user;
      },
    },
    {
      Header: "Date",
      field: "date",
      searchable: false,
      accessor: (row) => {
        return row.date;
      },
    },
    {
      Header: "Description",
      field: "description",
      accessor: (row) => {
        return row.description;
      },
    },
    {
      Header: "createdAt",
      field: "createdAt",
      searchable: false,
      accessor: (row) => {
        return row.createdAt;
      },
    },
  ];

  const allowedActions = [
    {
      label: "Edit",
      value: "edit",
      action: () => {
      },
    },
    {
      label: "Add",
      value: "add",
      action: () => {
      },
    },
    {
      label: "Delete",
      value: "delete",
      action: () => {
      },
    },
  ];
  const endPoint = "https://run.mocky.io/v3/425daabc-00ab-44c9-8d29-3e95b5a2238f/";
  const ref = useRef(null);
  const extraFilters = {
    test: "test",
    test2: "test2",
  };

  return (
    <div style={{ padding: 20 }}>
      {/* <h2>test Table</h2> */}
      <Table
        height="410"
        allowedActions={allowedActions}
        enableAllowedActions={true}
        searchFieldSelectClassName={Style.test}
        searchFieldSelectClassNameOpened={Style.testOpened}
        searchFieldSelectClassNameOptions={Style.testOptions}
        pageSizeSelectClassName={Style.testPage}
        pageSizeSelectClassNameOpened={Style.testOpenedPage}
        ref={ref}
        columns={columns}
        endPoint={endPoint}
        extraFilters={extraFilters}
      />
    </div>
  );
};

export default TestView;
