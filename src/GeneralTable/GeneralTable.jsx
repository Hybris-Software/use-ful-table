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
} from "./tableAddons";

//Icon
import { ImWrench } from "react-icons/im";

// Styles
import Style from "./GeneralTable.module.css";
import SelectComponent from "./SelectComponent/SelectComponent";

const GeneralTable = forwardRef(function GeneralTable(
  {
    pageSizes = [5, 10, 25, 50, 100],
    columns,
    height = 750,
    Styles,
    endPoint,
    emptyDataMessage = "No data available",
    extraFilters = {},
    defaultPageSize = 10,
    enablePageSizeSelect = true,
    dragWithMouse = true,
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
    searchFieldSelectClassNameOpened = Style.searchFieldSelectClassOpened,
    searchFieldSelectClassNameOptions = Style.searchFieldSelectClassOptions,
    allowedActionsSelectClassName = Style.allowedActionsSelectClass,
    allowedActionsSelectClassNameOpened = Style.allowedActionsSelectClassOpened,
    allowedActionsSelectClassNameOptions = Style.allowedActionsSelectClassOptions,
    pageSizeSelectClassName = Style.pageSizeSelectClass,
    pageSizeSelectClassNameOpened = Style.pageSizeSelectClassOpened,
    pageSizeSelectClassNameOptions = Style.pageSizeSelectClassOptions,
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

    searchFields = [],
  },
  ref
) {
  //Constants
  const initialSettings = {
    pagination: {
      page: 1,
      pageSize: defaultPageSize,
    },
    sortingSettings: "",
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

  //For debounce mechanisms
  const timeoutId = useRef(null);

  //States
  const [url, setUrl] = useState(null);
  const [tableSettings, setTableSettings] = useState(initialSettings);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  // Draggable
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  //For select all
  const [selectAllRows, setSelectAllRows] = useState(false);

  const selectColumn = useMemo(
    () => ({
      Header: " ",
      field: "select",
      searchable: false,
      sortable: false,
      noAction: true,
      accessor: (row) => {
        return (
          <input
            type="checkbox"
            checked={
              tableSettings.selectedData.find((item) => item.id === row.id) !==
              undefined
            }
            onChange={(e) => {
              let tempList = [...tableSettings.selectedData];
              if (e.target.checked) {
                // tempList.push(row);
                tempList = [...tempList, row];
              } else {
                tempList = tempList.filter((item) => item.id !== row.id);
              }
              tableRef.current.setSelectedData(tempList);
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
      ...columns.filter((item) => !hiddenColumns.includes(item.field)).map(column => ({...column, searchField: column.searchField || column.field})),
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
        setSortingSettings(value) {
          updateObjectState("sortingSettings", null, value, setTableSettings);
          onSortChange(tableContext);
        },
        setSelectedData(value) {
          updateObjectState("selectedData", null, value, setTableSettings);
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
    onSelectionChange(tableContext);
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
        <div style={{ position: "relative" }}>
          <div className={Style.filterRow}>
            <div className={Style.leftSideFilter}>
              <ConditionalComponent condition={enableAllowedActions}>
                <div className={Style.actions}>
                  <SelectComponent
                    className={allowedActionsSelectClassName}
                    classNameOpened={allowedActionsSelectClassNameOpened}
                    classNameOption={allowedActionsSelectClassNameOptions}
                    placeholder={allowedActionsSelectPlaceholder}
                    columns={allowedActions}
                    selectedItem={
                      allowedActions.filter(
                        (item) => item.value === selectedAction
                      )[0]?.label
                    }
                    setValue={(value) => {
                      setSelectedAction(value);
                    }}
                  />
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
            </div>
            <div className={Style.rightSideFilter}>
              <ConditionalComponent condition={enableSearchFieldSelect && searchFields.length > 0 }>
                <SelectComponent
                  className={searchFieldSelectClassName}
                  classNameOpened={searchFieldSelectClassNameOpened}
                  classNameOption={searchFieldSelectClassNameOptions}
                  columnLabel="Header"
                  columnValue="searchField"
                  placeholder={searchFieldSelectPlaceholder}
                  columns={computedColumns.filter((item) => item.searchable !== false)}
                  selectedItem={
                    computedColumns.filter(
                      (item) => item.searchField === tableSettings.search.field
                    )[0]?.Header
                  }
                  setValue={(value) => {
                    tableRef.current.setSearchField(value);
                    onSearchFieldChange(tableContext);
                  }}
                />
              </ConditionalComponent>
              <ConditionalComponent condition={enableSearch && searchFields.length > 0 }>
                <InputField
                  showError={false}
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
            </div>
          </div>

          <div className={Style.selectContainer}>
            <div
              className={Style.select}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <span
                className={Style.iconContainer}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <ImWrench
                  className={showDropdown ? Style.arrowOpened : Style.arrow}
                />
              </span>
              <ConditionalComponent condition={showDropdown}>
                <div className={Style.tooltopOptions}>
                  <div className={Style.options}>
                    <h4 className={Style.heading}>Hide columns</h4>
                    {columns.map((item, index) => (
                      <div key={index}>
                        <label className={Style.checkboxInput}>
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
                          <span>{item.Header} </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </ConditionalComponent>
            </div>
          </div>

          <div
            style={{ minHeight: `${height}px` }}
            className={Style.tableContent}
            onMouseDown={(e) => {
              if (dragWithMouse) {
                setIsDown(true);
                e.currentTarget.classList.add(Style.active);
                setStartX(e.pageX - e.currentTarget.offsetLeft);
                setScrollLeft(e.currentTarget.scrollLeft);
              }
            }}
            onMouseLeave={(e) => {
              if (dragWithMouse) {
                setIsDown(false);
                e.currentTarget.classList.remove(Style.active);
              }
            }}
            onMouseUp={(e) => {
              if (dragWithMouse) {
                setIsDown(false);
                e.currentTarget.classList.remove(Style.active);
              }
            }}
            onMouseMove={(e) => {
              if (dragWithMouse) {
                if (!isDown) return;
                const x = e.pageX - e.currentTarget.offsetLeft;
                const walk = (x - startX) * 1;
                e.currentTarget.scrollLeft = scrollLeft - walk;
              }
            }}
          >
            {tableAPI?.response?.data.results ? (
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
                                condition={column.field === "select"}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectAllRows}
                                  onChange={(e) => {
                                    const temp = [
                                      ...tableSettings.selectedData,
                                      ...tableAPI?.response?.data.results.filter(
                                        (item) =>
                                          !tableSettings.selectedData
                                            .map((value) => value.id)
                                            .includes(item.id)
                                      ),
                                    ];
                                    if (e.target.checked) {
                                      setSelectAllRows(true);
                                      tableRef.current.setSelectedData(temp);
                                    } else {
                                      const temp =
                                        tableSettings.selectedData.filter(
                                          (item) =>
                                            !tableAPI?.response?.data.results
                                              .map((value) => value.id)
                                              .includes(item.id)
                                        );
                                      setSelectAllRows(false);
                                      tableRef.current.setSelectedData(temp);
                                    }
                                  }}
                                />
                              </ConditionalComponent>
                              <ConditionalComponent
                                condition={column.sortable !== false}
                              >
                                <div
                                  className={computedSortingClassName}
                                  onClick={() => {
                                    const computedSorting =
                                      (tableSettings.sortingSettings.includes("-"))
                                        ? column.orderField
                                        : "-" + column.orderField;
                                    tableRef.current.setSortingSettings(
                                      computedSorting
                                    );
                                  }}
                                >
                                  <ComputedUpSortIcon
                                    condition={
                                      !tableSettings.sortingSettings.includes("-") &&
                                      tableSettings.sortingSettings ===
                                        column.orderField
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
                                      tableSettings.sortingSettings.includes("-") &&
                                      tableSettings.sortingSettings ===
                                        "-"+column.orderField
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
                <tbody {...getTableBodyProps()}>
                  {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              <div className={Style.clampedCell}>
                                {cell.render("Cell")}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : tableAPI.isLoading ? (
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
            ) : (
              <div className={Style.noResults}>{emptyDataMessage}</div>
            )}
          </div>

          <div className={paginationClassName}>
            <div className={Style.leftPagination}>
              <ConditionalComponent condition={enablePageSizeSelect}>
                <SelectComponent
                  className={pageSizeSelectClassName}
                  classNameOpened={pageSizeSelectClassNameOpened}
                  classNameOption={pageSizeSelectClassNameOptions}
                  columns={pageSizes}
                  selectedItem={tableSettings.pagination.pageSize}
                  setValue={(value) => tableRef.current.setPageSize(value)}
                />
              </ConditionalComponent>
              <div className={Style.recordPaginationInfo}>
                <span>Page</span>
                <InputField
                  showError={false}
                  className={toPageInputClassName}
                  value={tableSettings.pagination.page}
                  onChange={(e) => tableRef.current.toPage(e.target.value)}
                />
                <span>of {"100"}</span>
              </div>
            </div>
            <div className={Style.inputChangePage}>
              <Button
                disabled={!tableAPI?.response?.data?.links?.previous}
                className={paginationButtonClassName}
                onClick={() => tableRef.current.previousPage()}
              >
                Previous
              </Button>
              <Button
                disabled={tableAPI?.response?.data?.links?.next ? false : true}
                className={paginationButtonClassName}
                onClick={() => tableRef.current.nextPage()}
              >
                Next
              </Button>
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
