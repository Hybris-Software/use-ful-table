export type ColumnDefinition = {
  id: string
  title: string
  sortable?: boolean
}

export type Column = ColumnDefinition & {
  hidden: boolean
  sorting: "asc" | "desc" | null
}

export type SortingOptions = {
  column: string | null
  direction: "asc" | "desc"
}
