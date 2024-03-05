import { useState, useMemo } from "react"
import { generateQueryParameters } from "../utils/query"
import type { UseTableProps } from "../types"

export default function useTable({
  pageSize: _pageSize = 10,
  elementsCount = 0,
  queryParametersGenerator = generateQueryParameters,
  queryOptions = {},
  columns, // TODO
}: UseTableProps) {
  const [pageSize, setPageSize] = useState(_pageSize)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({}) // TODO
  const [extraFilters, setExtraFilters] = useState({})

  const pageCount = useMemo(
    () => Math.ceil(elementsCount / pageSize),
    [elementsCount, pageSize]
  )

  const canNextPage = useMemo(() => page < pageCount - 1, [page])
  const canPreviousPage = useMemo(() => page - 1 >= 0, [page])

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

  return {
    page,
    url,
    setPageSize,
    nextPage,
    previousPage,
    toPage,
    setExtraFilters,
  }
}
