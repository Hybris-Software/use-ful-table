export type ColumnDefinition = {
  id: string
  title: string
  sortable?: boolean
  dataKey?: string
  sortKey?: string
  accessor?: (cellData: any) => JSX.Element | string
}

export type Column = {
  id: string
  title: string
  sortable: boolean
  dataKey: string
  sortKey: string
  accessor: (cellData: any) => JSX.Element | string

  hidden: boolean
  sorting: "asc" | "desc" | null
}

export type SortingOptions = {
  column: string | null
  direction: "asc" | "desc"
}
