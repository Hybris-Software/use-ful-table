import { useEffect, useState } from "react"

import SimpleTable from "../components/simple-table/simple-table"
import SimpleColumnsCheckbox from "../components/simple-columns-checkbox/simple-columns-checkbox"
import SimplePaginator from "../components/simple-paginator/simple-paginator"

import { useQuery, generateApiClient } from "../../vendors/use-ful-query"

import { useTable, QueryParametersGenerator } from "use-ful-table"

export default function Simple() {
  const [url, setUrl] = useState<string | undefined>(undefined)

  const apiClient = generateApiClient({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  })
  const { data } = useQuery({
    apiClient: apiClient,
    executeImmediately: true,
    url: url,
  })

  const columnDetails = [
    { id: "id", title: "ID", sortable: true },
    { id: "userId", title: "User ID", sortable: true },
    { id: "title", title: "Title" },
    { id: "body", title: "Body" },
  ]

  const generateQueryParameters: QueryParametersGenerator = ({
    page,
    pageSize,
    sort,
  }) => {
    const params = {
      _sort: sort.column,
      _order: sort.column ? sort.direction : undefined,
      _limit: pageSize.toString(),
      _page: page.toString(),
    } as Record<string, string>

    const filteredParameters = Object.keys(params).reduce(
      (acc, key) => {
        if (params[key]) {
          acc[key] = params[key]
        }
        return acc
      },
      {} as Record<string, string>
    )

    return new URLSearchParams(filteredParameters).toString()
  }

  const table = useTable({
    // data: data?.products,
    // elementsCount: data?.total,
    data: data,
    elementsCount: 100,
    pageSize: 4,
    columns: columnDetails,
    queryParametersGenerator: generateQueryParameters,
  })

  useEffect(() => {
    setUrl(`/posts?${table.url}`)
  }, [table.url])

  useEffect(() => {
    console.log("table.page", table.page)
    console.log("table.pageSize", table.pageSize)
  }, [table.page, table.pageSize])

  return (
    <div>
      <SimpleColumnsCheckbox
        columns={columnDetails}
        hiddenColumns={table.hiddenColumns}
        setColumnHidden={table.setColumnHidden}
      />
      <SimpleTable
        columns={table.columns}
        rows={table.rows}
        sortBy={table.sortBy}
      />
      <SimplePaginator
        page={table.page}
        pageCount={table.pageCount}
        pageSize={table.pageSize}
        setPageSize={table.setPageSize}
        canNextPage={table.canNextPage}
        canPreviousPage={table.canPreviousPage}
        toPage={table.toPage}
        nextPage={table.nextPage}
        previousPage={table.previousPage}
      />

      <div style={{ border: "1px solid black", padding: "10px" }}>
        <div>Url: {table.url}</div>
      </div>
    </div>
  )
}
