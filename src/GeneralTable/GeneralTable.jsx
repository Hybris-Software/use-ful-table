import React, {
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useMemo,
} from "react";
import PropTypes from "prop-types";

//Components
import HeaderActionList from "./HeaderActionList/HeaderActionList";
import ConditionalComponent from "./ConditionalComponent/ConditionalComponent";

// Libraries
import { useTable } from "react-table";
import { Button, InputField } from "@hybris-software/ui-kit";
import useQuery from "@hybris-software/use-query";

//Addons
import {
  createUrl,
  updateObjectState,
  CommonStyles,
  sortType,
} from "./tableAddons";

//Icon
import { IoIosArrowDown } from "react-icons/io";

// Styles
import Style from "./GeneralTable.module.css";

const GeneralTable = forwardRef(function GeneralTable(
  {
    pageSizes = [5, 10, 25, 50, 100],
    columns,
    height = "750px",
    Styles,
    endPoint,
    emptyDataMessage = "No data available",
    extraFilters = {},
    defaultPageSize = 10,
    enablePageSizeSelect = true,
    enableSearch = true,
    enableSearchFieldSelect = true,
    defaultSearchField = "",
    searchBarPlaceholder = "Search...",
    enableSelectableRows = true,
    enableAllowedActions = false,
    allowedActions,
    searchFieldSelectPlaceholder = "Select a column",
    allowedActionsSelectPlaceholder = "Select an action",
    searchBarClassName = Style.searchBarClass,
    searchFieldSelectClassName = Style.searchFieldSelectClass,
    allowedActionsSelectClassName = Style.allowedActionsSelectClass,
    pageSizeSelectClassName = Style.pageSizeSelectClass,
    toPageInputClassName = Style.toPageInputClass,
    paginationButtonClassName = Style.paginationButtonClass,
    paginationClassName = Style.paginationClass,
    sortingClassName = Style.sortingClass,
    activeSortIconClassName,
    disableSortIconClassName,
    sortingUpIcon,
    sortingDownIcon,
    onSuccess = () => {},
    onUnauthorized = () => {},
    onError = () => {},
    onSearch = () => {},
    onSearchFieldChange = () => {},
    onPageChange = () => {},
    onPageSizeChange = () => {},
    onSelectionChange = () => {},
    onSortChange = () => {},
  },
  ref
) {
  //Constants
  const initialSettings = {
    pagination: {
      page: 1,
      pageSize: defaultPageSize,
    },
    sorting: {
      field: null,
      type: null,
    },
    search: {
      field: defaultSearchField,
      value: "",
    },
    endPoint: endPoint,
    selectedData: [],
  };

  //Refs
  const defaultRef = useRef(null);
  const tableRef = ref || defaultRef;
  const timeoutId = useRef(null); //For debounce mechanisms

  //States
  const [url, setUrl] = useState(null);
  const [tableSettings, setTableSettings] = useState(initialSettings);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");

  //Test for select all
  const [selectAllRows, setSelectAllRows] = useState(false);

  const selectColumn = useMemo(
    () => ({
      Header: "Select",
      field: "select",
      searchable: false,
      sortable: false,
      noAction: true,
      accessor: (row) => {
        return (
          <input
            type="checkbox"
            checked={tableSettings.selectedData.find((item) => item.id === row.id) !== undefined}
            onChange={(e) => {
              let tempList = tableSettings.selectedData;
              if (e.target.checked) {
                tempList.push(row);
              } else {
                tempList = tempList.filter((item) => item.id !== row.id);
              }
              updateObjectState(
                "selectedData",
                null,
                tempList,
                setTableSettings
              );
              onSelectionChange(tableContext)
            }}
          />
        );
      },
    }),
    [tableSettings]
  );

  const ComputedUpSortIcon = sortingUpIcon ? sortingUpIcon : IconUpComponent;

  const ComputedDownSortIcon = sortingDownIcon
    ? sortingDownIcon
    : IconDownComponent;

  const computedSortingClassName = sortingClassName
    ? sortingClassName
    : Style.sortingClassName;
  const computedDisableSortIconClassName = disableSortIconClassName
    ? disableSortIconClassName
    : Style.sortingIconDisabled;
  const computedActiveSortIconClassName = activeSortIconClassName
    ? activeSortIconClassName
    : Style.sortingIconActive;

  const computedColumns = useMemo(() => {
    return [
      ...(enableSelectableRows ? [selectColumn] : []),
      ...columns.filter((item) => !hiddenColumns.includes(item.field)),
    ];
  }, [columns, selectColumn, enableSelectableRows, hiddenColumns]);

  //Customized settings
  const ComputedStyles = Styles ? Styles : CommonStyles;

  const tableAPI = useQuery({
    url: url,
    method: "GET",
    executeImmediately: false,
    onSuccess: (response) => {
      onSuccess();
      if (
        response?.data.results
          .map((value) => value.id)
          .every((tempItem) =>
            tableSettings.selectedData
              .map((value) => value.id)
              .includes(tempItem)
          )
      ) {
        setSelectAllRows(true);
      } else {
        setSelectAllRows(false);
      }
    },
    onUnauthorized: (response) => {
      onUnauthorized();
    },
    onError: () => {
      onError();
    },
  });

  const tableContext = useMemo(
    () => ({
      tableSettings: tableSettings,
      extraFilters: extraFilters,
      tableData: tableAPI?.response,
    }),
    [tableSettings, extraFilters, tableAPI?.response]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns: computedColumns,
      data: tableAPI?.response?.data.results || [],
    });

  useImperativeHandle(
    tableRef,
    () => {
      return {
        getData() {
          return tableContext;
        },
        nextPage() {
          const value = +tableSettings.pagination.page + 1;
          updateObjectState("pagination", "page", value, setTableSettings);
          onPageChange(tableContext);
        },
        previousPage() {
          const value = tableSettings.pagination.page - 1;
          updateObjectState("pagination", "page", value, setTableSettings);
          onPageChange(tableContext);
        },
        toPage(page) {
          updateObjectState("pagination", "page", page, setTableSettings);
          onPageChange(tableContext);
        },
        setPageSize(pageSize) {
          updateObjectState(
            "pagination",
            "pageSize",
            pageSize,
            setTableSettings
          );
          onPageSizeChange(tableContext);
        },
        setSearchValue(value) {
          updateObjectState("search", "value", value, setTableSettings);
        },
        setSearchField(value) {
          updateObjectState("search", "field", value, setTableSettings);
        },
        setSortField(value) {
          updateObjectState("sorting", "field", value, setTableSettings);
          onSortChange(tableContext);
        },
        setSortType(value) {
          updateObjectState("sorting", "type", value, setTableSettings);
          onSortChange(tableContext);
        },
      };
    },
    [tableSettings, tableContext, onPageChange, onPageSizeChange, onSortChange]
  );

  useEffect(() => {
    setUrl(createUrl(tableSettings, extraFilters));
  }, [tableSettings, extraFilters]);

  useEffect(() => {
    console.log(url);
    if (url) tableAPI.executeQuery();
  }, [url]);

  useEffect(() => {
    if (
      tableAPI?.response?.data.results
        .map((value) => value.id)
        .every((item) =>
          tableSettings.selectedData.map((value) => value.id).includes(item)
        )
    ) {
      setSelectAllRows(true);
    } else {
      setSelectAllRows(false);
    }    
  }, [tableSettings.selectedData]);

  return (
    <ComputedStyles>
      <div className={Style.tableContainer}>
        <div className={Style.innerTable}>
          <div style={{ minHeight: height, position: "relative" }}>
            <ConditionalComponent condition={enableAllowedActions}>
              <div className={Style.actions}>
                <select
                  selected=""
                  className={allowedActionsSelectClassName}
                  placeholder={allowedActionsSelectPlaceholder}
                  onChange={(e) => {
                    setSelectedAction(e.target.value);
                  }}
                >
                  <option value="">{allowedActionsSelectPlaceholder}</option>
                  {allowedActions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button
                  disabled={
                    tableSettings.selectedData.length <= 0 || !selectedAction
                  }
                  onClick={() =>
                    allowedActions
                      .find((item) => item.value === selectedAction)
                      ?.action()
                  }
                >
                  Apply
                </Button>
              </div>
            </ConditionalComponent>
            <ConditionalComponent condition={enableSearchFieldSelect}>
              <select
                className={searchFieldSelectClassName}
                placeholder={searchFieldSelectPlaceholder}
                onChange={(e) => {
                  tableRef.current.setSearchField(e.target.value);
                  onSearchFieldChange(tableContext);
                }}
              >
                <option value="">{searchFieldSelectPlaceholder}</option>
                {columns
                  .filter((item) => item.searchable !== false)
                  .map((option, index) => (
                    <option key={index} value={option.field}>
                      {option.Header}
                    </option>
                  ))}
              </select>
            </ConditionalComponent>
            <ConditionalComponent condition={enableSearch}>
              <InputField
                placeholder={searchBarPlaceholder}
                className={searchBarClassName}
                onChange={(e) => {
                  clearTimeout(timeoutId.current);
                  timeoutId.current = setTimeout(() => {
                    tableRef.current.setSearchValue(e.target.value);
                    onSearch(tableContext);
                  }, 1000);
                }}
              />
            </ConditionalComponent>

            <div className={Style.selectContainer}>
              <div
                className={Style.select}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <span
                  className={Style.iconContainer}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <IoIosArrowDown
                    className={showDropdown ? Style.arrowOpened : Style.arrow}
                  />
                </span>
                <ConditionalComponent condition={showDropdown}>
                  <div className={Style.options}>
                    <h4>Hide columns</h4>
                    {columns.map((item, index) => (
                      <div key={index} className={Style.checkbox}>
                        <label className={Style.checkboxForm}>
                          <span>{item.Header} </span>
                          <input
                            type="checkbox"
                            checked={hiddenColumns.includes(item.field)}
                            onChange={(e) => {
                              hiddenColumns.includes(item.field)
                                ? setHiddenColumns((oldState) =>
                                    oldState.filter(
                                      (field) => field !== item.field
                                    )
                                  )
                                : setHiddenColumns((oldState) => [
                                    ...oldState,
                                    item.field,
                                  ]);
                            }}
                          />
                          <i></i>
                        </label>
                      </div>
                    ))}
                  </div>
                </ConditionalComponent>
              </div>
            </div>

            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        <div className={Style.headerSection}>
                          <div className={Style.clampedText}>
                            {column.render("Header")}
                            <ConditionalComponent
                              condition={column.Header === "Select"}
                            >
                              <input
                                type="checkbox"
                                checked={selectAllRows}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateObjectState(
                                      "selectedData",
                                      null,
                                      [
                                        ...tableSettings.selectedData,
                                        ...tableAPI?.response?.data.results.filter(
                                          (item) =>
                                            !tableSettings.selectedData
                                              .map((value) => value.id)
                                              .includes(item.id)
                                        ),
                                      ],
                                      setTableSettings
                                    );
                                    setSelectAllRows(true);
                                  } else {
                                    const temp = tableSettings.selectedData.filter(
                                      (item) =>
                                        !tableAPI?.response?.data.results.map(value => value.id).includes(
                                          item.id
                                        )
                                    );
                                    updateObjectState(
                                      "selectedData",
                                      null,
                                      temp,
                                      setTableSettings
                                    );
                                    setSelectAllRows(false);
                                  }
                                  onSelectionChange(tableContext)
                                }}
                              />
                            </ConditionalComponent>
                            <ConditionalComponent
                              condition={column.sortable !== false}
                            >
                              <div
                                className={computedSortingClassName}
                                onClick={() => {
                                  tableRef.current.setSortField(column.field);
                                  tableRef.current.setSortType(
                                    tableSettings.sorting.type === sortType.UP
                                      ? sortType.DOWN
                                      : sortType.UP
                                  );
                                }}
                              >
                                <ComputedUpSortIcon
                                  condition={
                                    tableSettings.sorting.type ===
                                      sortType.UP &&
                                    tableSettings.sorting.field === column.field
                                  }
                                  activeClassName={
                                    computedActiveSortIconClassName
                                  }
                                  disabledClassName={
                                    computedDisableSortIconClassName
                                  }
                                ></ComputedUpSortIcon>
                                <ComputedDownSortIcon
                                  condition={
                                    tableSettings.sorting.type ===
                                      sortType.DOWN &&
                                    tableSettings.sorting.field === column.field
                                  }
                                  activeClassName={
                                    computedActiveSortIconClassName
                                  }
                                  disabledClassName={
                                    computedDisableSortIconClassName
                                  }
                                ></ComputedDownSortIcon>
                              </div>
                            </ConditionalComponent>
                          </div>
                          {!column?.noAction && (
                            <HeaderActionList
                              column={column}
                              tableRef={tableRef}
                              setHiddenColumns={setHiddenColumns}
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {tableAPI?.response?.data.results ? (
                <tbody {...getTableBodyProps()}>
                  {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              <div className={Style.clampedText}>
                                {cell.render("Cell")}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              ) : tableAPI.isLoading ? (
                <div className={Style.noResults}>Loading...</div>
              ) : (
                <div className={Style.noResults}>{emptyDataMessage}</div>
              )}
            </table>
            <div className={paginationClassName}>
              <div
                className={paginationButtonClassName}
                onClick={() => tableRef.current.previousPage()}
              >
                previous
              </div>
              <div
                className={paginationButtonClassName}
                onClick={() => tableRef.current.nextPage()}
              >
                next
              </div>
              <InputField
                className={toPageInputClassName}
                value={tableSettings.pagination.page}
                onChange={(e) => tableRef.current.toPage(e.target.value)}
              />
              <ConditionalComponent condition={enablePageSizeSelect}>
                <select
                  className={pageSizeSelectClassName}
                  defaultValue={tableSettings.pagination.pageSize}
                  onChange={(e) => tableRef.current.setPageSize(e.target.value)}
                >
                  {pageSizes.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </ConditionalComponent>
            </div>
          </div>
        </div>
      </div>
    </ComputedStyles>
  );
});

const IconUpComponent = ({ condition, activeClassName, disabledClassName }) => {
  return (
    <span className={condition ? activeClassName : disabledClassName}>
      <svg
        width="6"
        height="13"
        viewBox="0 0 6 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.552485 0.220199C0.845086 -0.0729861 1.31996 -0.0734596 1.61314 0.219141L4.95981 3.55914C5.253 3.85174 5.25347 4.32662 4.96087 4.6198C4.66827 4.91299 4.19339 4.91346 3.90021 4.62086L0.553542 1.28086C0.260357 0.988258 0.259884 0.513384 0.552485 0.220199Z"
          fill="#84818A"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.08334 0C1.49756 0 1.83334 0.335786 1.83334 0.75V12.0833C1.83334 12.4975 1.49756 12.8333 1.08334 12.8333C0.66913 12.8333 0.333344 12.4975 0.333344 12.0833V0.75C0.333344 0.335786 0.66913 0 1.08334 0Z"
          fill="#84818A"
        />
      </svg>
    </span>
  );
};

const IconDownComponent = ({
  condition,
  activeClassName,
  disabledClassName,
}) => {
  return (
    <span className={condition ? activeClassName : disabledClassName}>
      <svg
        width="5"
        height="13"
        viewBox="0 0 5 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.219141 8.21361C0.511742 7.92042 0.986616 7.91995 1.2798 8.21255L4.62647 11.5525C4.91965 11.8452 4.92013 12.32 4.62753 12.6132C4.33492 12.9064 3.86005 12.9069 3.56687 12.6143L0.220199 9.27427C-0.0729862 8.98167 -0.0734596 8.50679 0.219141 8.21361Z"
          fill="#84818A"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.09665 0C4.51086 0 4.84665 0.335786 4.84665 0.75V12.0833C4.84665 12.4975 4.51086 12.8333 4.09665 12.8333C3.68244 12.8333 3.34665 12.4975 3.34665 12.0833V0.75C3.34665 0.335786 3.68244 0 4.09665 0Z"
          fill="#84818A"
        />
      </svg>
    </span>
  );
};

GeneralTable.propTypes = {
  pageSizes: PropTypes.arrayOf(PropTypes.number),
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.string,
  Styles: PropTypes.string,
  endPoint: PropTypes.string.isRequired,
  emptyDataMessage: PropTypes.string,
  extraFilters: PropTypes.object,
  defaultPageSize: PropTypes.number,
  enablePageSizeSelect: PropTypes.bool,
  enableSearch: PropTypes.bool,
  enableSearchFieldSelect: PropTypes.bool,
  enableAllowedActions: PropTypes.bool,
  defaultSearchField: PropTypes.string,
  searchBarPlaceholder: PropTypes.string,
  // searchBarClassName ---> sortingDownIcon Styles How is the default
  onSuccess: PropTypes.func,
  onUnauthorized: PropTypes.func,
  onError: PropTypes.func,
  onSearch: PropTypes.func,
  onSearchFieldChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onSortChange: PropTypes.func,
};
export default GeneralTable;
