import React, { useRef } from "react";
import GeneralTable from "../GeneralTable/GeneralTable";

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
      Header: "toCurrency",
      field: "toCurrency",
      accessor: (row) => {
        return row.toCurrency;
      },
    },
    {
      Header: "toAmount",
      field: "toAmount",
      accessor: (row) => {
        return row.toAmount;
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
        console.log("Edit");
      },
    },
    {
      label: "Add",
      value: "add",
      action: () => {
        console.log("Add");
      },
    },
    {
      label: "Delete",
      value: "delete",
      action: () => {
        console.log("Delete");
      },
    },
  ];
  const endPoint = "https://api-upbyt.testing-room.com/api/v1/wallets/history/";
  const ref = useRef(null);
  const extraFilters = {
    test: "test",
    test2: "test2",
  };

  return (
    <div>
      <h2>test Table</h2>
      <GeneralTable
        allowedActions={allowedActions}
        enableAllowedActions={true}
        ref={ref}
        columns={columns}
        endPoint={endPoint}
        extraFilters={extraFilters}
        onSearch={(x) => console.log(x)}
        onSearchFieldChange={(x) => console.log(x)}
        onSelectionChange={(x) => console.log(x)}
        onPageChange={(x) => console.log(x)}
      />
    </div>
  );
};

export default TestView;
