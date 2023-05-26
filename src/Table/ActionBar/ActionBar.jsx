import React, { useState, useRef, useEffect } from "react";

//Components
import ConditionalComponent from "../ConditionalComponent/ConditionalComponent";

//Libraries
import { InputField, Select, Button } from "@hybris-software/ui-kit";

// Styles
import Style from "./ActionBar.module.css";

function ActionBar({
  tableRef,
  tableSettings,
  setTableSettings,
  texts,
  enableAllowedActions,
  allowedActions,
  enableSearch,
  enableSearchFieldSelect,
  computedColumns,
  updateObjectState,
  inputSearchBaseClassName = Style.inputSearchBaseClass,
  searchBarClassName = Style.searchBarClass,
}) {
  const [selectedAction, setSelectedAction] = useState("");

  const [searchValue, setSearchValue] = useState("");

  const [currentSearch, setCurrentSearch] = useState({
    value: tableSettings.search.value,
    field: tableSettings.search.field,
  });

  useEffect(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      if (tableRef.current) {
        updateObjectState("value", null, searchValue, setCurrentSearch);
      }
    }, 1000);
  }, [searchValue]);

  useEffect(() => {
    if (currentSearch.value && currentSearch.field) {
      setTableSettings((prev) => {
        return {
          ...prev,
          search: {
            field: currentSearch.field,
            value: currentSearch.value,
          },
          pagination: {
            page: 1,
            pageSize: prev.pagination.pageSize,
          }
        };
      });
    } else if (currentSearch.field) {
      setTableSettings((prev) => {
        if (prev?.search?.value) {
          return {
            ...prev,
            search: {
              field: currentSearch.field,
              value: "",
            },
          };
        } else {
          return prev;
        }
      });
    }
  }, [currentSearch]);

  useEffect(() => {
    setSearchValue(tableSettings.search.value);
  }, [tableSettings.search.value]);

  // For debounce mechanisms
  const timeoutId = useRef(null);

  return (
    <div className={Style.filterRow}>
      <div className={Style.leftSideFilter}>
        <ConditionalComponent condition={enableAllowedActions}>
          <div className={Style.actions}>
            <Select
              placeholder={texts.actionSelect}
              items={allowedActions}
              setValue={(value) => {
                setSelectedAction(value);
              }}
              value={selectedAction}
            />
            <Button
              disabled={
                tableSettings.selectedData.length <= 0 || !selectedAction
              }
              onClick={() => selectedAction.action()}
            >
              {texts.buttonAction}
            </Button>
          </div>
        </ConditionalComponent>
      </div>
      <div className={Style.rightSideFilter}>
        <ConditionalComponent condition={enableSearchFieldSelect}>
          <Select
            items={computedColumns.filter((item) => item.searchable !== false)}
            placeholder={texts.columnsSelect}
            labelKey="Header"
            value={currentSearch.field}
            setValue={(value) => {
              updateObjectState("field", null, value, setCurrentSearch);
            }}
          />
        </ConditionalComponent>
        <ConditionalComponent condition={enableSearch}>
          <InputField
            baseClassName={inputSearchBaseClassName}
            showError={false}
            placeholder={texts.placeholderSearch}
            className={searchBarClassName}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </ConditionalComponent>
      </div>
    </div>
  );
}

export default ActionBar;
