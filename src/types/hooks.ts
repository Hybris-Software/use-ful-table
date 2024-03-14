import { QueryParametersGenerator, QueryOptions } from "./query"
import { ColumnDefinition, SortingOptions } from "./table"

export type UseTableProps = {
  pageSize?: number
  elementsCount?: number
  queryParametersGenerator?: QueryParametersGenerator
  queryOptions?: Partial<QueryOptions>
  columns: ColumnDefinition[]
  hiddenColumns?: string[]
  data?: any[]
  sort?: SortingOptions
  filters?: Record<string, string>
  resetPageOnFiltersChange?: boolean
  clientSideOrdering?: boolean
  clientSideFiltering?: boolean
}
