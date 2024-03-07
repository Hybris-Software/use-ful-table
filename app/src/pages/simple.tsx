import { useEffect, useState } from "react"

import SimpleTable from "../components/simple-table/simple-table"
import SimpleColumnsCheckbox from "../components/simple-columns-checkbox/simple-columns-checkbox"
import SimplePaginator from "../components/simple-paginator/simple-paginator"

import { useQuery, generateApiClient } from "../../vendors/use-ful-query"

import { useTable, QueryParametersGenerator } from "use-ful-table"

export default function Simple() {
  const [url, setUrl] = useState<string | null>(null)

  const apiClient = generateApiClient({
    baseUrl: "https://dummyjson.com",
  })
  const { data } = useQuery({
    apiClient: apiClient,
    executeImmediately: true,
    url: url,
  })

  const columnDetails = [
    { id: "id", title: "ID" },
    { id: "title", title: "Title" },
    { id: "description", title: "Description" },
    { id: "price", title: "Price" },
  ]

  const generateQueryParameters: QueryParametersGenerator = ({
    page,
    pageSize,
  }) => {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      skip: ((page - 1) * pageSize).toString(),
    })

    return params.toString()
  }

  const table = useTable({
    pageSize: 4,
    elementsCount: data?.total,
    columns: columnDetails,
    data: data?.products,
    queryParametersGenerator: generateQueryParameters,
  })

  useEffect(() => {
    setUrl(`/products?${table.url}`)
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
      <SimpleTable columns={table.columns} rows={table.rows} />
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
