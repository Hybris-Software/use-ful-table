import { QueryParametersGenerator, QueryOptions } from "./query"
import { Column } from "./table"

export type UseTableProps = {
  pageSize?: number
  elementsCount?: number
  queryParametersGenerator?: QueryParametersGenerator
  queryOptions?: Partial<QueryOptions>
  columns: Column[]
  hiddenColumns?: string[]
}
