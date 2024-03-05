import { QueryParametersGenerator } from "../types"

export const generateQueryParameters: QueryParametersGenerator = ({
  filters,
  page,
  pageSize,
  options: { pageParameterName, pageSizeParameterName },
}) => {
  const params = new URLSearchParams({
    ...filters,
    [pageParameterName]: page,
    [pageSizeParameterName]: pageSize,
  })

  return params.toString()
}
