import { useEffect, useState } from "react"

import SimpleTable from "../components/simple-table/simple-table"
import SimpleColumnsCheckbox from "../components/simple-columns-checkbox/simple-columns-checkbox"
import SimplePaginator from "../components/simple-paginator/simple-paginator"
import SimpleSelect from "../components/simple-select/simple-select"

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
    filters,
  }) => {
    const params = {
      ...filters,
      _sort: sort.column,
      _order: sort.column ? sort.direction : undefined,
      _limit: pageSize.toString(),
      _page: page.toString(),
    } as Record<string, string>

    const filteredParameters = Object.keys(params).reduce(
      (acc, key) => {
        if (params[key] !== null && params[key] !== undefined) {
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

  return (
    <div>
      <div style={{ border: "1px solid black", padding: "10px" }}>
        <SimpleSelect
          items={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
          value={table.filters.userId || undefined}
          setValue={(value) => table.setFilter("userId", value)}
        />
      </div>

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
        <div>Url: {url}</div>
      </div>
    </div>
  )
}
