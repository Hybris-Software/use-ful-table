import { useState, useMemo } from "react"
import { generateQueryParameters } from "../utils/query"
import type { UseTableProps } from "../types"

export function useTable({
  pageSize: _pageSize = 10,
  elementsCount = 0,
  queryParametersGenerator = generateQueryParameters,
  queryOptions = {},
  columns: _columns,
  hiddenColumns: _hiddenColumns = [],
  data,
}: UseTableProps) {
  const [pageSize, setPageSize] = useState(_pageSize)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({}) // TODO
  const [extraFilters, setExtraFilters] = useState({})
  const [hiddenColumns, setHiddenColumns] = useState(_hiddenColumns)

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
      }),
    [queryParametersGenerator, filters, extraFilters, page, pageSize]
  )

  const columns = useMemo(
    () => _columns.filter((column) => !hiddenColumns.includes(column.id)),
    [_columns, hiddenColumns]
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
  }
}
