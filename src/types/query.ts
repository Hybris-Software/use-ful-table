export type QueryOptions = {
  pageParameterName: string
  pageSizeParameterName: string
}

export type QueryParametersGeneratorProps = {
  filters: any
  options: QueryOptions
  page: number
  pageSize: number
}

export type QueryParametersGenerator = (
  props: QueryParametersGeneratorProps
) => string
