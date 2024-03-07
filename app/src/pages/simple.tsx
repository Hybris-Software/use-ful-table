import SimpleTable from "../components/simple-table/simple-table"
import SimpleColumnsCheckbox from "../components/simple-columns-checkbox/simple-columns-checkbox"
import SimplePaginator from "../components/simple-paginator/simple-paginator"

import { useTable } from "use-ful-table"

export default function Simple() {
  const columnDetails = [
    { id: "id", title: "ID" },
    { id: "name", title: "Name" },
  ]
  const rows = [
    { id: 1, name: "John" },
    { id: 2, name: "Doe" },
  ]

  const table = useTable({
    pageSize: 10,
    elementsCount: 100,
    columns: columnDetails,
  })

  return (
    <div>
      <SimpleColumnsCheckbox
        columns={columnDetails}
        hiddenColumns={table.hiddenColumns}
        setColumnHidden={table.setColumnHidden}
      />
      <SimpleTable columns={table.columns} rows={rows} />
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
