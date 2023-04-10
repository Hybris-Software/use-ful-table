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
import Loader from "./Loader/Loader";
import PaginationBar from "./PaginationBar/PaginationBar";

// Libraries
import { useTable } from "react-table";
import useQuery from "@hybris-software/use-query";

//Addons
import {
  createUrl,
  updateObjectState,
  CommonStyles,
  StripedTable,
} from "./tableAddons";

//Icon
import { ImWrench } from "react-icons/im";
import { GrFormClose } from "react-icons/gr";
import { HiCheck } from "react-icons/hi";
import { AiOutlineCopy } from "react-icons/ai";

// Styles
import Style from "./Table.module.css";
import ActionBar from "./ActionBar/ActionBar";

/**
 * @param {Object} props
 * @param {Array} props.pageSizes - Array of numbers that will be used as options for the page size select
 * @param {Array} props.columns - Array of objects that will be used as columns for the table
 * @param {Number} props.headerHeight - Height of the header
 * @param {Number} props.rowHeight - Height of the rows
 * @param {Number} props.height - Height of the table
 * @param {Object} props.Styles - Object with custom styles
 * @param {String} props.endPoint - Endpoint to fetch the data
 * @param {String} props.emptyDataMessageComponent - Component to show Message when there is no data
 * @param {Object} props.extraFilters - Object with extra filters to add to the query
 * @param {Number} props.defaultPageSize - Default page size
 * @param {Boolean} props.enablePageSizeSelect - Enable page size select
 * @param {Boolean} props.dragWithMouse - Enable drag with mouse
 * @param {Boolean} props.enableSearch - Enable search
 * @param {Boolean} props.enableSearchFieldSelect - Enable search field select
 * @param {String} props.defaultSearchField - Default search field
 * @param {String} props.inputSearchBaseClassName - Base class name for the search input
 * @param {Boolean} props.enableSelectableRows - Enable selectable rows
 * @param {String} props.selectabledRowsClassName - Class name for the selectable rows
 * @param {Boolean} props.enableAllowedActions - Enable allowed actions
 * @param {Array} props.allowedActions - Array of objects with the allowed actions
 * @param {String} props.searchBarClassName - Class name for the search bar
 * @param {String} props.toPageInputClassName - Class name for the to page input
 * @param {String} props.toPageInputBaseClassName - Base class name for the to page input
 * @param {String} props.paginationButtonClassName - Class name for the pagination buttons
 * @param {String} props.paginationButtonBaseClassName - Base class name for the pagination buttons
 */

const TableComponent = (
  {
    pageSizes = [5, 10, 25, 50, 100],
    columns,
    headerHeight = 50,
    rowHeight = 65,
    height,
    Styles,
    endPoint,
    emptyDataMessageComponent = <EmptyDataMessageComponent />,
    emptyDataClassName = Style.noResults,
    extraFilters = {},
    defaultPageSize = 5,
    enablePageSizeSelect = true,
    dragWithMouse = true,
    enableSearch = true,
    enableSearchFieldSelect = true,
    defaultSearchField = "",
    inputSearchBaseClassName = Style.inputSearchBaseClass,
    enableSelectableRows = true,
    selectableRowsColor = "#bfcae4",
    enableAllowedActions = false,
    allowedActions,
    settingClassName = Style.tooltopOptions,
    settingClassNameOpened = Style.tooltopOptionsOpened,
    settingClassNameList = Style.scrollableList,
    settingClassNameListOpened = Style.scrollableListOpened,
    searchBarClassName,
    toPageInputClassName,
    toPageInputBaseClassName,
    paginationButtonClassName,
    paginationClassName,
    checkboxClassName = Style.labelClass,
    sortingClassName = Style.sortingClass,
    settingsIcon = <ImWrench />,
    copyToClipboardIcon = <AiOutlineCopy />,
    tooltipClassName = Style.tooltip,
    enableStripedTable = false,
    enableSittings = true,
    sittingsClassName = Style.select,
    enableRowsSelectedBadge = true,
    rowsSelectedBadgeClassName = Style.rowsSelected,
    enableSearchBadges = true,
    searchBadgesClassName = Style.rowsSelected,
    texts = {
      actionSelect: "Select an action",
      buttonAction: "Apply",
      columnsSelect: "Select a column",
      placeholderSearch: "Search...",
      settingTitle: "Hide columns",
      rowsSelected: "row(s) selected",
      columnByAsc: "Sort by ASC",
      columnByDesc: "Sort by DESC",
      hideColumn: "Hide this column",
      showColumns: "Show all columns",
      pageLabel: "Page",
      ofPageLabel: "of",
      buttonPrevious: "Previous",
      buttonNext: "Next",
      copyToClipboard: "Copy to clipboard",
      copied: "Copied",
    },
    activeSortIconClassName,
    disableSortIconClassName,
    sortingUpIcon,
    sortingDownIcon,
    conditionToHideSelectRow = () => {},
    onSuccess = () => {},
    onUnauthorized = () => {},
    onError = () => {},
    onSearch = () => {},
    onSearchFieldChange = () => {},
    onPageChange = () => {},
    onPageSizeChange = () => {},
    onSelectionChange = () => {},
    onSortChange = () => {},
    onTableRefresh = () => {},
    loader = <Loader />,
  },
  ref
) => {
  // Constants
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

  // Refs
  const defaultRef = useRef(null);
  const tableRef = ref || defaultRef;

  // States
  const [url, setUrl] = useState(null);
  const [tableSettings, setTableSettings] = useState(initialSettings);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [notSelectableRow, setNotSelectableRow] = useState([]);

  // Draggable
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectAllRows, setSelectAllRows] = useState(false);

  // Icons
  const ComputedUpSortIcon = sortingUpIcon ? sortingUpIcon : IconUpComponent;
  const ComputedDownSortIcon = sortingDownIcon
    ? sortingDownIcon
    : IconDownComponent;

  // Classes
  const computedSortingClassName = sortingClassName
    ? sortingClassName
    : Style.sortingClassName;
  const computedDisableSortIconClassName = disableSortIconClassName
    ? disableSortIconClassName
    : Style.sortingIconDisabled;
  const computedActiveSortIconClassName = activeSortIconClassName
    ? activeSortIconClassName
    : Style.sortingIconActive;

  // Columns
  const selectColumn = useMemo(
    () => ({
      Header: " ",
      field: "select",
      searchable: false,
      sortable: false,
      noAction: true,
      accessor: (row) => {
        const condition = conditionToHideSelectRow(row);
        if (
          condition &&
          !notSelectableRow.map((item) => item.id).includes(row.id)
        )
          setNotSelectableRow((prev) => [...prev, row]);
        return (
          <div className={Style.checkboxContainer}>
            <input
              disabled={condition ? condition : false}
              id={row.id}
              className={Style.simpleCheckbox}
              type="checkbox"
              checked={
                tableSettings.selectedData.find(
                  (item) => item.id === row.id
                ) !== undefined
              }
              onChange={(e) => {
                let tempList = [...tableSettings.selectedData];
                if (e.target.checked) {
                  tempList = [...tempList, row];
                } else {
                  tempList = tempList.filter((item) => item.id !== row.id);
                }
                tableRef.current.setSelectedData(tempList);
              }}
            />
            <label htmlFor={row.id} className={checkboxClassName}>
              <HiCheck />
            </label>
          </div>
        );
      },
    }),
    // eslint-disable-next-line
    [tableSettings, tableRef]
  );

  const computedColumns = useMemo(() => {
    return [
      ...(enableSelectableRows ? [selectColumn] : []),
      ...columns
        .filter((item) => !hiddenColumns.includes(item.field))
        .map((column) => ({
          ...column,
          searchField: column.searchField || column.field,
        })),
    ];
  }, [columns, selectColumn, enableSelectableRows, hiddenColumns]);

  //Customized settings
  const ComputedStyles = Styles
    ? Styles
    : enableStripedTable
    ? StripedTable
    : CommonStyles;

  // Query
  const tableAPI = useQuery({
    url: url,
    method: "GET",
    executeImmediately: false,
    onSuccess: (response) => {
      onSuccess();
      if (
        response?.data.results
          .map((value) => value.id)
          .filter(
            (item) => !notSelectableRow.map((value) => value.id).includes(item)
          )
          .every((tempItem) =>
            tableSettings.selectedData
              .map((value) => value.id)
              .includes(tempItem)
          ) &&
        !response?.data.results
          .map((value) => value.id)
          .every((tempItem) =>
            notSelectableRow.map((value) => value.id).includes(tempItem)
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

  // Table Context for Events
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

  // Methods
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
        },
        previousPage() {
          const value = tableSettings.pagination.page - 1;
          updateObjectState("pagination", "page", value, setTableSettings);
        },
        toPage(page) {
          updateObjectState("pagination", "page", page, setTableSettings);
        },
        setPageSize(pageSize) {
          updateObjectState(
            "pagination",
            "pageSize",
            pageSize,
            setTableSettings
          );
          updateObjectState("pagination", "page", 1, setTableSettings);
        },
        setSearchValue(value) {
          updateObjectState("search", "value", value, setTableSettings);
          updateObjectState("pagination", "page", 1, setTableSettings);
        },
        setSearchField(value) {
          updateObjectState("search", "field", value, setTableSettings);
          updateObjectState("pagination", "page", 1, setTableSettings);
        },
        setSortingSettings(value) {
          updateObjectState("sortingSettings", null, value, setTableSettings);
        },
        setSelectedData(value) {
          updateObjectState("selectedData", null, value, setTableSettings);
        },
        refreshTable() {
          tableAPI.executeQuery();
          onTableRefresh(tableContext);
        },
      };
    },
    [tableSettings, tableContext]
  );

  const sortHandler = (column) => {
    const columnName = column.orderField || column.field;
    const computedSorting = tableSettings.sortingSettings.includes("-")
      ? columnName
      : "-" + columnName;
    tableRef.current.setSortingSettings(computedSorting);
  };

  // Use Effects
  useEffect(() => {
    setUrl(createUrl(tableSettings, extraFilters));
  }, [tableSettings, extraFilters]);

  useEffect(() => {
    if (url) tableAPI.executeQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    onSelectionChange(tableContext);
    if (
      tableAPI?.response?.data.results
        .map((value) => value.id)
        .filter(
          (item) => !notSelectableRow.map((value) => value.id).includes(item)
        )
        .every((item) =>
          tableSettings.selectedData.map((value) => value.id).includes(item)
        ) &&
      !tableAPI?.response?.data.results
        .map((value) => value.id)
        .every((tempItem) =>
          notSelectableRow.map((value) => value.id).includes(tempItem)
        )
    ) {
      setSelectAllRows(true);
    } else {
      setSelectAllRows(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableSettings.selectedData]);

  useEffect(() => {
    onPageChange(tableContext);
  }, [tableSettings.pagination.page]);

  useEffect(() => {
    onPageSizeChange(tableContext);
  }, [tableSettings.pagination.pageSize]);

  useEffect(() => {
    onSortChange(tableContext);
  }, [tableSettings.sortingSettings]);

  useEffect(() => {
    onSearchFieldChange(tableContext);
  }, [tableSettings.search.field]);

  useEffect(() => {
    onSearch(tableContext);
  }, [tableSettings.search.value]);

  function copyToClipboard(str) {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  }

  return (
    <ComputedStyles>
      <div className={Style.tableContainer}>
        <div style={{ position: "relative" }}>
          <ActionBar
            tableRef={tableRef}
            tableSettings={tableSettings}
            setTableSettings={setTableSettings}
            texts={texts}
            enableAllowedActions={enableAllowedActions}
            allowedActions={allowedActions}
            enableSearch={enableSearch}
            enableSearchFieldSelect={enableSearchFieldSelect}
            computedColumns={computedColumns}
            updateObjectState={updateObjectState}
            inputSearchBaseClassName={inputSearchBaseClassName}
            searchBarClassName={searchBarClassName}
          />
          <ConditionalComponent
            condition={
              enableSittings || enableRowsSelectedBadge || enableSearchBadges
            }
          >
            <div className={Style.selectContainer}>
              <ConditionalComponent condition={enableSittings}>
                <div
                  className={sittingsClassName}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <span
                    className={Style.iconContainer}
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {settingsIcon}
                  </span>
                  <div
                    className={
                      !showDropdown ? settingClassName : settingClassNameOpened
                    }
                    style={
                      showDropdown
                        ? { transition: "all 0.3s ease 0s" }
                        : { transition: "all 0.3s ease 0s" }
                    }
                  >
                    <div className={Style.options}>
                      <h4 className={Style.heading}>{texts.settingTitle}</h4>
                      <div
                        className={
                          showDropdown
                            ? settingClassNameListOpened
                            : settingClassNameList
                        }
                        style={
                          showDropdown
                            ? { transition: "all 0.3s ease" }
                            : { transition: "all 0.3s ease" }
                        }
                      >
                        {columns.map((item, index) => (
                          <div key={index} className={Style.singleOption}>
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
                            </label>
                            <div className={Style.optionText}>
                              {item.Header}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ConditionalComponent>
              <ConditionalComponent
                condition={
                  tableSettings.selectedData.length > 0 &&
                  enableRowsSelectedBadge
                }
              >
                <div className={rowsSelectedBadgeClassName}>
                  {tableSettings.selectedData.length} {texts.rowsSelected}
                  <GrFormClose
                    onClick={() => {
                      tableRef.current.setSelectedData([]);
                    }}
                  />
                </div>
              </ConditionalComponent>

              <ConditionalComponent
                condition={
                  tableSettings.search.field &&
                  tableSettings.search.value &&
                  enableSearchBadges
                }
              >
                <div className={searchBadgesClassName}>
                  {tableSettings.search.field.Header}:{" "}
                  {tableSettings.search.value}
                  <GrFormClose
                    onClick={() => {
                      if (tableRef.current) {
                        tableRef.current.setSearchField(defaultSearchField);
                        tableRef.current.setSearchValue('');
                      }
                    }}
                  />
                </div>
              </ConditionalComponent>
            </div>
          </ConditionalComponent>

          <div
            style={
              !height
                ? {
                    minHeight: `${
                      rowHeight * tableSettings.pagination.pageSize +
                      headerHeight
                    }px`,
                  }
                : { minHeight: `${height}px` }
            }
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
            {tableAPI?.response?.data?.results?.length > 0 ? (
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => {
                    return (
                      <tr
                        {...headerGroup.getHeaderGroupProps()}
                        style={{ height: `${headerHeight}px` }}
                      >
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps()}
                            style={{ position: "relative" }}
                          >
                            {!column?.noAction && (
                              <HeaderActionList
                                texts={texts}
                                column={column}
                                tableRef={tableRef}
                                setHiddenColumns={setHiddenColumns}
                              />
                            )}
                            <div className={Style.headerSection}>
                              <div className={Style.clampedText}>
                                {column.render("Header")}
                                <ConditionalComponent
                                  condition={column.field === "select"}
                                >
                                  <div className={Style.checkboxContainer}>
                                    <input
                                      id="allSelect"
                                      type="checkbox"
                                      className={Style.simpleCheckbox}
                                      checked={selectAllRows}
                                      onChange={(e) => {
                                        const temp = [
                                          ...tableSettings.selectedData,
                                          ...tableAPI?.response?.data.results.filter(
                                            (item) =>
                                              !tableSettings.selectedData
                                                .map((value) => value.id)
                                                .includes(item.id) &&
                                              !notSelectableRow
                                                .map((value) => value.id)
                                                .includes(item.id)
                                          ),
                                        ];
                                        if (e.target.checked) {
                                          setSelectAllRows(true);
                                          tableRef.current.setSelectedData(
                                            temp
                                          );
                                        } else {
                                          const temp =
                                            tableSettings.selectedData.filter(
                                              (item) =>
                                                !tableAPI?.response?.data.results
                                                  .map((value) => value.id)
                                                  .includes(item.id) &&
                                                !notSelectableRow
                                                  .map((value) => value.id)
                                                  .includes(item.id)
                                            );
                                          setSelectAllRows(false);
                                          tableRef.current.setSelectedData(
                                            temp
                                          );
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor="allSelect"
                                      className={checkboxClassName}
                                    >
                                      <HiCheck />
                                    </label>
                                  </div>
                                </ConditionalComponent>
                                <ConditionalComponent
                                  condition={column.sortable !== false}
                                >
                                  <div
                                    className={computedSortingClassName}
                                    onClick={() => sortHandler(column)}
                                  >
                                    <ComputedUpSortIcon
                                      condition={
                                        (!tableSettings?.sortingSettings?.includes(
                                          "-"
                                        ) &&
                                          tableSettings.sortingSettings ===
                                            column.orderField) ||
                                        tableSettings.sortingSettings ===
                                          column.field
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
                                        (tableSettings?.sortingSettings?.includes(
                                          "-"
                                        ) &&
                                          tableSettings.sortingSettings ===
                                            "-" + column.orderField) ||
                                        tableSettings.sortingSettings ===
                                          "-" + column.field
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
                            </div>
                          </th>
                        ))}
                      </tr>
                    );
                  })}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        style={{
                          height: `${rowHeight}px`,
                          backgroundColor: tableSettings.selectedData
                            .map((row) => row.id)
                            .includes(row.original.id)
                            ? selectableRowsColor
                            : undefined,
                        }}
                      >
                        {row.cells.map((cell, i) => {
                          return (
                            <td
                              className={Style.tdCell}
                              {...cell.getCellProps()}
                            >
                              <div className={Style.clampedCell}>
                                {cell.render("Cell")}
                                {cell.column.copyable && (
                                  <div
                                    title={texts.copyToClipboard}
                                    className={Style.copyFeature}
                                    onClick={(e) => {
                                      copyToClipboard(cell.value);
                                      const target =
                                        e.currentTarget.children[1];
                                      target.style.opacity = "1";
                                      setTimeout(() => {
                                        target.style.opacity = "0";
                                      }, 1000);
                                    }}
                                  >
                                    {copyToClipboardIcon}
                                    <div className={tooltipClassName}>
                                      {texts.copied}
                                    </div>
                                  </div>
                                )}
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
              loader
            ) : (
              <div className={emptyDataClassName}>
                {emptyDataMessageComponent}
              </div>
            )}
          </div>
          <PaginationBar
            tableRef={tableRef}
            tableAPI={tableAPI}
            tableSettings={tableSettings}
            texts={texts}
            paginationClassName={paginationClassName}
            enablePageSizeSelect={enablePageSizeSelect}
            pageSizes={pageSizes}
            toPageInputBaseClassName={toPageInputBaseClassName}
            toPageInputClassName={toPageInputClassName}
            paginationButtonClassName={paginationButtonClassName}
          />
        </div>
      </div>
    </ComputedStyles>
  );
};

const Table = forwardRef(TableComponent);

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

const EmptyDataMessageComponent = () => {
  return (
    <>
      <p>No data available</p>
    </>
  );
};

TableComponent.propTypes = {
  pageSizes: PropTypes.arrayOf(PropTypes.number),
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.string,
  Styles: PropTypes.string,
  endPoint: PropTypes.string.isRequired,
  emptyDataMessageComponent: PropTypes.func,
  extraFilters: PropTypes.object,
  defaultPageSize: PropTypes.number,
  enablePageSizeSelect: PropTypes.bool,
  enableSearch: PropTypes.bool,
  enableSearchFieldSelect: PropTypes.bool,
  enableAllowedActions: PropTypes.bool,
  defaultSearchField: PropTypes.string,
  searchBarPlaceholder: PropTypes.string,
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

export default Table;
