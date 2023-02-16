import useQuery from "@hybris-software/use-query/dist/Hooks/useQuery";
import React, { useRef, useState } from "react";
import { BiLeftArrowCircle } from "react-icons/bi";
import GeneralTable from "../GeneralTable/GeneralTable";

// Styles
import Style from "./TestView.module.css";

const TestView = () => {
  const [searchFields, setSearchFields] = useState([]);
  const [searchFieldsDeposit, setSearchFieldsDeposits] = useState([]);

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
      sortable: false,
      searchField:"user__username",
      accessor: (row) => {
        return row.user.username;
      },
    },
    {
      Header: "Date",
      field: "createdAt",
      searchable: false,
      orderField:"created_at",
      accessor: (row) => {
        return row.createdAt;
      },
    },
    {
      Header: "Subject",
      field: "subject",
      orderField:"subject",
      accessor: (row) => {
        return row.subject;
      },
    },
    {
      Header: "Title",
      field: "title",
      orderField:"title",
      searchable: false,
      accessor: (row) => {
        return row.title;
      },
    },
    {
      Header: "Status",
      field: "status",
      orderField:"status",
      searchable: false,
      accessor: (row) => {
        return row.status;
      },
    },
    {
      Header: "Priority",
      field: "priority",
      orderField:"priority",
      searchable: false,
      accessor: (row) => {
        return row.priority;
      },
    },
  ];
  const depositColumns = [
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
      sortable: false,
      accessor: (row) => {
        return row.user;
      },
    },
    {
      Header: "Date",
      field: "createdAt",
      orderField:"created_at",
      searchable: false,
      accessor: (row) => {
        return row.createdAt;
      },
    },
    {
      Header: "Deposit Type",
      field: "depositType",
      orderField:"deposit_type",
      accessor: (row) => {
        return row.depositType;
      },
    },
    {
      Header: "Destination",
      field: "destination",
      orderField:"destination",
      searchable: false,
      accessor: (row) => {
        return row.destination;
      },
    },
    {
      Header: "RequestedCryptoAmount",
      field: "requestedCryptoAmount",
      orderField:"requested_crypto_amount",
      searchable: false,
      accessor: (row) => {
        return row.requestedCryptoAmount;
      },
    },
    {
      Header: "CryptoCurrency",
      field: "cryptoCurrency",
      orderField:"crypto_currency",
      searchable: false,
      accessor: (row) => {
        return row.cryptoCurrency;
      },
    },
    {
      Header: "Status",
      field: "status",
      orderField:"status",
      searchable: false,
      accessor: (row) => {
        return row.status;
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

  // From the API we should create the search array
  const ticketsFiltersAPI = useQuery({
    url: "administration/tickets-filters/",
    method: "GET",
    executeImmediately: true,
    onSuccess: (response) => {
      const tempArray = [];
      response.data.search.map((item) => {
        const temp = {
          Header: item,
          field: item,
        };
        tempArray.push(temp);
        return item;
      });
      setSearchFields([...tempArray]);
    },
    onUnauthorized: (response) => {},
    onError: () => {},
  });

  // From the API we should create the search array
  const depositsFiltersAPI = useQuery({
    url: "administration/deposits-filters/",
    method: "GET",
    executeImmediately: true,
    onSuccess: (response) => {
      const tempArray = [];
      response.data.search.map((item) => {
        const temp = {
          Header: item,
          field: item,
        };
        tempArray.push(temp);
        return item;
      });
      setSearchFieldsDeposits([...tempArray]);
    },
    onUnauthorized: (response) => {},
    onError: () => {},
  });

  const endPoint = "administration/tickets/";
  const endPointDeposit = "administration/deposits/";
  const ref = useRef(null);
  const extraFilters = {
    test: "test",
    test2: "test2",
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Ticket Table</h2>
      {ticketsFiltersAPI.isSuccess && searchFields.length > 0 && (
        <GeneralTable
          height="410"
          defaultPageSize={1}
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
          onSearch={(x) => console.log(x)}
          onSearchFieldChange={(x) => console.log(x)}
          onSelectionChange={(x) => console.log(x)}
          onPageChange={(x) => console.log(x)}
          onSortChange={(x) => console.log(x)}
          searchFields={searchFields}
        />
      )}
      <h2>Deposit Table</h2>
      {depositsFiltersAPI.isSuccess && searchFieldsDeposit.length > 0 && (
        <GeneralTable
          height="410"
          defaultPageSize={1}
          allowedActions={allowedActions}
          enableAllowedActions={true}
          searchFieldSelectClassName={Style.test}
          searchFieldSelectClassNameOpened={Style.testOpened}
          searchFieldSelectClassNameOptions={Style.testOptions}
          pageSizeSelectClassName={Style.testPage}
          pageSizeSelectClassNameOpened={Style.testOpenedPage}
          ref={ref}
          columns={depositColumns}
          endPoint={endPointDeposit}
          extraFilters={extraFilters}
          onSearch={(x) => console.log(x)}
          onSearchFieldChange={(x) => console.log(x)}
          onSelectionChange={(x) => console.log(x)}
          onPageChange={(x) => console.log(x)}
          onSortChange={(x) => console.log(x)}
          searchFields={searchFieldsDeposit}
        />
      )}
    </div>
  );
};

export default TestView;
