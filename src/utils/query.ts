import { QueryParametersGenerator } from "../types"

export const generateQueryParameters: QueryParametersGenerator = ({
  filters,
  page,
  pageSize,
  sort,
  options: { pageParameterName, pageSizeParameterName },
}) => {
  const params: Record<string, string> = {
    ...filters,
    sort: sort.column
      ? sort.direction === "asc"
        ? sort.column
        : `-${sort.column}`
      : undefined,
    [pageParameterName]: page,
    [pageSizeParameterName]: pageSize,
  }

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
