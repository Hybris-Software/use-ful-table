import { Button, Select } from "@hybris-software/ui-kit";
import React, { useRef, useState } from "react";
import Table from "../Table/Table";
import TableClient from "../TableClient/TableClient";

// Styles
import Style from "./TestView.module.css";

const TestView = () => {
  const [extraFilters, setExtraFilters] = useState({});
  const [currentFilter, setCurrentFilter] = useState({});

  const columns = [
    {
      Header: "Export ID",
      field: "id",
      orderField: "id",
      copyable: true,
      sortable: true,
      accessor: (row) => {
        return row.id;
      },
    },
    {
      Header: "User ID",
      field: "user",
      orderField: "user",
      copyable: true,
      sortable: true,
      accessor: (row) => {
        return row.id;
      },
    },
    {
      Header: "Username",
      field: "username",
      orderField: "username",
      sortable: true,
      accessor: (row) => {
        return row.username;
      },
    },
    {
      Header: "1",
      field: "id",
      orderField: "id",
      copyable: true,
      sortable: true,
      accessor: (row) => {
        return row.id;
      },
    },
    {
      Header: "2",
      field: "user",
      orderField: "user",
      copyable: true,
      sortable: true,
      accessor: (row) => {
        return row.id;
      },
    },
    {
      Header: "3",
      field: "username",
      orderField: "username",
      sortable: true,
      accessor: (row) => {
        return row.username;
      },
    },
    {
      Header: "Status",
      field: "status",
      orderField: "status",
      sortable: true,
      accessor: (row) => {
        return row.status;
      },
    },
    {
      Header: "File",
      field: "file",
      orderField: "file",
      sortable: true,
      accessor: (row) => {
        return (
          <>
            {row.file && (
              <a href={row.file} target="blank" download={"export-file"}>
              </a>
            )}
          </>
        );
      },
    },
    {
      Header: "Date Added",
      field: "createdAt",
      orderField: "created_at",
      searchable: false,
      accessor: (row) => {
        // return <DateFormatter date={row.createdAt} />;
      },
    },
  ];

  const clientTableColumns = [
    {
      Header: "#",
      field: "id",
      copyable: true,
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
      searchable: false,
      copyable: true,
      accessor: (row) => {
        return row.createdAt;
      },
    },
    {
      Header: "Subject",
      field: "subject",
      orderField: "subject",
      accessor: (row) => {
        return row.subject;
      },
    },
    {
      Header: "Title",
      field: "title",
      searchable: false,
      accessor: (row) => {
        return row.title;
      },
    },
    {
      Header: "Status fweuyg uiegfiu gwifug wei",
      field: "status",
      searchable: false,
      copyable: true,
      accessor: (row) => {
        return row.status;
      },
    },
    {
      Header: "Priority",
      field: "priority",
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
      action: () => {},
    },
    {
      label: "Add",
      value: "add",
      action: () => {},
    },
    {
      label: "Delete",
      value: "delete",
      action: () => {
        console.log("Delete");
      },
    },
  ];

  // const endPoint = "administration/users/";
  const endPoint = "exports/";
  const ref = useRef(null);
  const refForClientTable = useRef(null);

  //For Client Table
  const rawData = [
    {
      id: 2,
      user: "testuser3",
      lastViewer: null,
      owner: null,
      category: "swap problems",
      createdAt: "2023-02-11T06:37:13.289279Z",
      updatedAt: "2023-02-11T08:21:15.320096Z",
      title: "qweqwewqeqw",
      subject: null,
      description:
        "Unlike traditional markets where fundamentals underpin asset prices trends, is mostly sentiment driven. Hence, it is through historical data that one can extract signals with predictive power. It is also only through a diversified portfolio one can limit and control downside risks, particulary when investing in such a volatile asset class",
      priority: "MEDIUM",
      status: "OPEN",
    },
    {
      id: 3,
      user: "testuser3",
      lastViewer: null,
      owner: null,
      category: "swap problems",
      createdAt: "2023-02-11T06:37:23.197351Z",
      updatedAt: "2023-02-13T11:19:18.262551Z",
      title: "qwewqewqe231e4",
      subject: "23e423",
      description:
        "Unlike traditional markets where fundamentals underpin asset prices trends, is mostly sentiment driven. Hence, it is through historical data that one can extract signals with predictive power. It is also only through a diversified portfolio one can limit and control downside risks, particulary when investing in such a volatile asset class",
      priority: "HIGH",
      status: "IN_PROGRESS",
    },
    {
      id: 1,
      user: "testuser3",
      lastViewer: null,
      owner: null,
      category: "swap problems",
      createdAt: "2023-02-11T06:36:52.512553Z",
      updatedAt: "2023-02-20T13:46:20.746841Z",
      title: "qweqwe",
      subject: "qewqweqwe",
      description:
        "Unlike traditional markets where fundamentals underpin asset prices trends, is mostly sentiment driven. Hence, it is through historical data that one can extract signals with predictive power. It is also only through a diversified portfolio one can limit and control downside risks, particulary when investing in such a volatile asset class",
      priority: "LOW",
      status: "CLOSED",
    },
    {
      id: 4,
      user: "alelang",
      lastViewer: "dedwedew4324",
      owner: "conreferral",
      category: "swap problems",
      createdAt: "2023-02-11T06:43:06.130834Z",
      updatedAt: "2023-02-17T10:54:27.604968Z",
      title: "dsrwe",
      subject: "How to deposit money to my portal?",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.\r\n\r\nLorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.\r\n\r\nLorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      priority: "LOW",
      status: "CLOSED",
    },
    {
      id: 5,
      user: "takudzwa",
      lastViewer: null,
      owner: null,
      category: "swap problems",
      createdAt: "2023-02-11T09:10:44.140876Z",
      updatedAt: "2023-02-27T07:14:16.657595Z",
      title: "sadasd",
      subject: "asdas",
      description:
        "profilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePictureprofilePicture",
      priority: "HIGH",
      status: "OPEN",
    },
  ];
  function checkBoxDisabled(row) {
    if (row.termsAccepted) {
      return true;
    }
    return false;
  }

  function checkBoxDisabledInClientTable(row) {
    if (row.status === "OPEN") {
      return true;
    }
    return false;
  }

  function onTableRefresh(tableContext) {
    tableContext.tableSettings.selectedData = [];
  }
  return (
    <div style={{ padding: 20 }}>
      <Button
        onClick={() => {
          console.log(ref.current.scrollLeft)
          // let tempExtraFilter = {};
          // Object.entries(currentFilter).forEach((entry) => {
          //   const [key, item] = entry;
          //   if (item) tempExtraFilter[key] = item.value;
          // });
          // setExtraFilters(tempExtraFilter)
        }}
      >
        test button
      </Button>
      <div>
        <h4 className={Style.selectLabel}>Terms Accepted</h4>
        <Select
          placeholder="Terms Accepted"
          value={currentFilter.terms_accepted}
          items={[
            {
              label: "All",
              value: "",
            },
            {
              label: "Yes",
              value: true,
            },
            {
              label: "No",
              value: false,
            },
          ]}
          setValue={(value) => {
            setCurrentFilter({
              ...currentFilter,
              terms_accepted: value,
            });
          }}
        />
      </div>
      <Table
        rowHeight="70"
        pageSizes={[1, 2, 3, 5, 10]}
        allowedActions={allowedActions}
        enableAllowedActions={true}
        searchFieldSelectClassName={Style.test}
        searchFieldSelectClassNameOpened={Style.testOpened}
        searchFieldSelectClassNameOptions={Style.testOptions}
        pageSizeSelectClassName={Style.testPage}
        pageSizeSelectClassNameOpened={Style.testOpenedPage}
        ref={ref}
        columns={[...columns]}
        endPoint={endPoint}
        onPageSizeChange={(e) => console.log(e)}
        onTableRefresh={(e) => onTableRefresh(e)}
        enableStripedTable={true}
        conditionToHideSelectRow={checkBoxDisabled}
      />

      <TableClient
        rowHeight="70"
        defaultPageSize={10}
        pageSizes={[1, 2, 3, 5, 10, 100]}
        allowedActions={allowedActions}
        enableAllowedActions={true}
        searchFieldSelectClassName={Style.test}
        searchFieldSelectClassNameOpened={Style.testOpened}
        searchFieldSelectClassNameOptions={Style.testOptions}
        pageSizeSelectClassName={Style.testPage}
        pageSizeSelectClassNameOpened={Style.testOpenedPage}
        ref={refForClientTable}
        columns={[...clientTableColumns]}
        rawData={[...rawData]}
        onPageSizeChange={(e) => console.log(e)}
        enableStripedTable={true}
        conditionToHideSelectRow={checkBoxDisabledInClientTable}
      />
    </div>
  );
};

export default TestView;
