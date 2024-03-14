import { useState, useMemo, useEffect, useCallback } from "react"
import debounce from "lodash.debounce"
import { stringify } from "csv-stringify/browser/esm/sync"

import { generateQueryParameters } from "../utils/query"
import type { UseTableProps, SortingOptions, Column } from "../types"

export function useTable({
  pageSize: _pageSize = 10,
  elementsCount = 0,
  queryParametersGenerator = generateQueryParameters,
  queryOptions = {},
  columns: _columns,
  hiddenColumns: _hiddenColumns = [],
  data,
  sort: _sort = { column: null, direction: "asc" },
  filters: _filters = {},
  resetPageOnFiltersChange = true,
}: UseTableProps) {
  const [pageSize, _setPageSize] = useState(_pageSize)
  const [page, setPage] = useState(1)
  const [filters, setFilters] =
    useState<Record<string, string | null | undefined>>(_filters)
  const [hiddenColumns, setHiddenColumns] = useState(_hiddenColumns)
  const [sort, setSort] = useState<SortingOptions>(_sort)
  const [queryParameters, setQueryParameters] = useState<any>(null)

  const pageCount = useMemo(
    () => Math.ceil(elementsCount / pageSize),
    [elementsCount, pageSize]
  )

  const canNextPage = useMemo(() => page < pageCount, [page, pageCount])
  const canPreviousPage = useMemo(() => page - 1 > 0, [page])

  const setPageSize = (size: number) => {
    setPage(1)
    _setPageSize(size)
  }

  const nextPage = () => {
    if (canNextPage) {
      setPage(page + 1)
    }
  }

  const previousPage = () => {
    if (canPreviousPage) {
      setPage(page - 1)
    }
  }

  const toPage = (page: number) => {
    const pageNumber = Math.max(0, Math.min(page, pageCount - 1))
    setPage(pageNumber)
  }

  const _queryParametersSetter = ({
    filters,
    page,
    pageSize,
    sort,
    options,
  }: {
    filters: Record<string, string | null | undefined>
    page: number
    pageSize: number
    sort: SortingOptions
    options: {
      pageParameterName: string
      pageSizeParameterName: string
    }
  }) => {
    const newQueryParameters = queryParametersGenerator({
      filters,
      page,
      pageSize,
      options,
      sort,
    })

    setQueryParameters(newQueryParameters)
  }

  const _debouncedQueryParametersSetter = useCallback(
    debounce(_queryParametersSetter, 100),
    []
  )

  useEffect(() => {
    let queryParametersGeneratorFunction

    if (queryParameters !== null) {
      queryParametersGeneratorFunction = _debouncedQueryParametersSetter
    } else {
      queryParametersGeneratorFunction = _queryParametersSetter
    }

    queryParametersGeneratorFunction({
      filters,
      page,
      pageSize,
      options: {
        pageParameterName: queryOptions.pageParameterName || "page",
        pageSizeParameterName: queryOptions.pageSizeParameterName || "pageSize",
      },
      sort,
    })
  }, [queryParametersGenerator, filters, page, pageSize])

  const columns: Column[] = useMemo(
    () =>
      _columns
        .filter((column) => !hiddenColumns.includes(column.id))
        .map((column) => ({
          ...column,
          hidden: hiddenColumns.includes(column.id),
          sorting: column.id === sort.column ? sort.direction : null,
        })),
    [_columns, hiddenColumns, sort]
  )

  const hideColumn = (columnId: string) => {
    setHiddenColumns((hiddenColumns) => [...hiddenColumns, columnId])
  }

  const showColumn = (columnId: string) => {
    setHiddenColumns((hiddenColumns) =>
      hiddenColumns.filter((id) => id !== columnId)
    )
  }

  const setColumnHidden = (columnId: string, hidden: boolean) => {
    if (hidden) {
      hideColumn(columnId)
    } else {
      showColumn(columnId)
    }
  }

  const showAllColumns = () => {
    setHiddenColumns([])
  }

  const hideAllColumns = () => {
    setHiddenColumns(_columns.map((column) => column.id))
  }

  const rowsData = (data || []).map((dataRow) =>
    columns.map((column) => dataRow[column.dataKey || column.id])
  )

  const rows = rowsData.map((rowData, index) => {
    return columns.map((column, columnIndex) => {
      const cellData = rowData[columnIndex]
      const cellContent = column.accessor ? column.accessor(cellData) : cellData

      return cellContent
    })
  })

  const sortBy = (column: string, direction?: "asc" | "desc") => {
    if (resetPageOnFiltersChange) {
      setPage(1)
    }
    setSort((sort) => ({
      column: column,
      direction:
        direction ||
        (sort.column === column
          ? sort.direction === "asc"
            ? "desc"
            : "asc"
          : "asc"),
    }))
  }

  const resetFilters = () => {
    if (resetPageOnFiltersChange) {
      setPage(1)
    }
    setFilters({})
  }

  const setFilter = (key: string, value: string | null | undefined) => {
    if (resetPageOnFiltersChange) {
      setPage(1)
    }
    setFilters((filters) => ({
      ...filters,
      [key]: value,
    }))
  }

  const exportCsv = async (fileName: string) => {
    const csvHeader = columns.map((column) => column.title)
    const csvData = [csvHeader, ...rowsData]
    const csv = stringify(csvData)

    const CSV_FILE_TYPE = "text/csv;charset=utf-8;"
    const BYTE_ORDER_MARL = "\ufeff"

    const blob = new Blob([BYTE_ORDER_MARL, csv], {
      type: CSV_FILE_TYPE,
    })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    // Pagination
    page,
    pageSize,
    pageCount,
    canNextPage,
    canPreviousPage,
    setPageSize,
    nextPage,
    previousPage,
    toPage,
    // Filters
    filters,
    resetFilters,
    setFilter,
    // Hidden columns
    hiddenColumns,
    hideColumn,
    showColumn,
    setColumnHidden,
    showAllColumns,
    hideAllColumns,
    setHiddenColumns,
    // Query
    queryParameters,
    // Table
    columns,
    rows,
    rowsData,
    // Sorting
    sort,
    sortBy,
    // Export
    exportCsv,
  }
}
