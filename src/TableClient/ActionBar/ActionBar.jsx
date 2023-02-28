import React, {useState, useRef, useEffect} from "react";

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
  onSearchFieldChange,
  tableContext,
  onSearch,
  inputSearchBaseClassName = Style.inputSearchBaseClass,
  searchBarClassName = Style.searchBarClass,
}) {
  const [selectedAction, setSelectedAction] = useState("");
  const [searchValue, setSearchValue] = useState(tableSettings.search.value);

  useEffect(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      tableRef.current.setSearchValue(searchValue);
      onSearch(tableContext);
    }, 1000);
  }, [searchValue]);

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
          items={computedColumns.filter(
            (item) => item.searchable !== false
          )}
          placeholder={texts.columnsSelect}
          labelKey="Header"
          value={tableSettings?.search?.field}
          setValue={(value) => {
            updateObjectState(
              "search",
              "field",
              value,
              setTableSettings
            );
            onSearchFieldChange(tableContext);
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
