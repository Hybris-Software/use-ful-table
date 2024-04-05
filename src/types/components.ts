import { Column, ColumnDefinition } from "./table"

export type ColumnsSelectorProps = {
  columns: ColumnDefinition[]
  hiddenColumns: string[]
  setColumnHidden: (columnId: string, hidden: boolean) => void
}

export type PaginatorProps = {
  page: number
  pageCount: number
  pageSize: number
  setPageSize: (pageSize: number) => void
  canNextPage: boolean
  canPreviousPage: boolean
  toPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
}

export type TableProps = {
  columns: Column[]
  rows: any[]
  sortBy: (column: string, direction?: "asc" | "desc") => void
}
