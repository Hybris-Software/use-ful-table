import React, { useRef } from "react";
import Table from "../Table/Table";

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
