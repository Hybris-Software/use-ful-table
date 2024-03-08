import { SortingOptions } from "./table"

export type QueryOptions = {
  pageParameterName: string
  pageSizeParameterName: string
}

export type QueryParametersGeneratorProps = {
  filters: any
  options: QueryOptions
  page: number
  pageSize: number
  sort: SortingOptions
}

export type QueryParametersGenerator = (
  props: QueryParametersGeneratorProps
) => Record<string, string>
