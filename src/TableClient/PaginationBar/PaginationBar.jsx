import React, { useEffect, useState } from "react";

//Components
import ConditionalComponent from "../ConditionalComponent/ConditionalComponent";

//Libraries
import { InputField, Select, Button } from "@hybris-software/ui-kit";

// Styles
import Style from "./PaginationBar.module.css";

function PaginationBar({
  tableRef,
  data,
  tableSettings,
  texts,
  enablePageSizeSelect,
  pageSizes,
  paginationClassName = Style.paginationClass,
  toPageInputBaseClassName = Style.toPageInputBaseClass,
  toPageInputClassName = Style.toPageInputClass,
  paginationButtonClassName = Style.paginationButtonClass,
}) {
  const [pageTo, setPageTo] = useState(tableSettings.pagination.page);
  const totalPages = data?.length / tableSettings.pagination.pageSize;
  useEffect(() => {
    if (pageTo) {
      tableRef.current.toPage(pageTo);
    }
  }, [pageTo]);

  useEffect(() => {
    setPageTo(tableSettings.pagination.page);
  }, [tableSettings.pagination.page, tableSettings.pagination.pageSize]);

  return (
    <div className={paginationClassName}>
      <div className={Style.leftPagination}>
        <ConditionalComponent condition={enablePageSizeSelect}>
          <Select
            items={pageSizes}
            placeholder={texts.columnsSelect}
            labelKey="Header"
            value={tableSettings?.pagination?.pageSize}
            setValue={(value) => {
              tableRef.current.setPageSize(value);
            }}
          />
        </ConditionalComponent>
        <div className={Style.recordPaginationInfo}>
          <span>{texts.pageLabel}</span>
          <InputField
            baseClassName={toPageInputBaseClassName}
            showError={false}
            className={toPageInputClassName}
            value={pageTo}
            onChange={(e) => {
              setPageTo(e.target.value);
            }}
          />
          <span>
            {texts.ofPageLabel} {Math.ceil(totalPages)}
          </span>
          <span>
            | <strong>{data?.length}</strong> records
          </span>
          
        </div>
      </div>
      <div className={Style.inputChangePage}>
        <Button
          disabled={tableSettings.pagination.page === 1}
          className={paginationButtonClassName}
          onClick={() => tableRef?.current?.previousPage()}
        >
          {texts.buttonPrevious}
        </Button>
        <Button
          disabled={tableSettings.pagination.page === Math.ceil(totalPages)}
          className={paginationButtonClassName}
          onClick={() => tableRef?.current?.nextPage()}
        >
          {texts.buttonNext}
        </Button>
      </div>
    </div>
  );
}

export default PaginationBar;
