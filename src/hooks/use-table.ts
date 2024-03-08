import { useState, useMemo } from "react"
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
}: UseTableProps) {
  const [pageSize, setPageSize] = useState(_pageSize)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({}) // TODO
  const [extraFilters, setExtraFilters] = useState({})
  const [hiddenColumns, setHiddenColumns] = useState(_hiddenColumns)
  const [sort, setSort] = useState<SortingOptions>(_sort)

  const pageCount = useMemo(
    () => Math.ceil(elementsCount / pageSize),
    [elementsCount, pageSize]
  )

  const canNextPage = useMemo(() => page < pageCount, [page, pageCount])
  const canPreviousPage = useMemo(() => page - 1 > 0, [page])

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

  const url = useMemo(
    () =>
      queryParametersGenerator({
        filters: {
          ...filters,
          ...extraFilters,
        },
        page,
        pageSize,
        options: {
          pageParameterName: queryOptions.pageParameterName || "page",
          pageSizeParameterName:
            queryOptions.pageSizeParameterName || "pageSize",
        },
        sort,
      }),
    [queryParametersGenerator, filters, extraFilters, page, pageSize]
  )

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

  const rows = (data || []).map((row) =>
    columns.map((column) => row[column.id])
  )

  const sortBy = (column: string, direction?: "asc" | "desc") => {
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
    setExtraFilters,
    // Hidden columns
    hiddenColumns,
    hideColumn,
    showColumn,
    setColumnHidden,
    showAllColumns,
    setHiddenColumns,
    //Query
    url,
    // Table
    columns,
    rows,
    // Sorting
    sort,
    sortBy,
  }
}
