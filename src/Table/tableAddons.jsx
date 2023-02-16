import styled from "styled-components";

function createUrl(tableSettings, extraFilters) {
  const parametersObject = {
    ...{
      page: tableSettings.pagination.page,
      limit: tableSettings.pagination.pageSize,
      ordering: tableSettings.sortingSettings,
      [tableSettings.search.field+"__icontains"]: tableSettings.search.value
    },
    ...extraFilters,
  };
  const url =
    tableSettings.endPoint + "?" + new URLSearchParams(parametersObject);
  return url;
}

function updateObjectState(key, nestedKey, value, setObjectState) {
  setObjectState((prev) => {
    const newObj = { ...prev };
    if (nestedKey) {
      newObj[key][nestedKey] = value;
    } else {
      newObj[key] = value;
    }
    return newObj;
  });
}

const CommonStyles = styled.div`
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  border-radius: 5px;

  table {
    width: 100%;
    border-spacing: 0;
    padding-top: 1rem;

    thead {
      tr {
        height: 50px;
        color: #757575;
        font-weight: 600;
        font-size: 14px;
        th{
          min-width: 200px;
          max-width: 500px;
          text-align: center;
          padding: 0 5px;
          :first-child{
            min-width: 60px;
          }
        }
      }
    }

    tbody{
      tr{
        height: 65px;
        font-weight: 500;
        font-size: 14px;
        color: #757575;
        td{
          min-width: 200px;
          max-width: 500px;
          text-align: center;
          border-top: 1px solid #F3F3F3;
          padding: 0 5px;
          :first-child{
            min-width: 60px;
          }
        }
      }
    }
  }

  
`;
const sortType = {
  UP: "asc",
  DOWN: "desc",
};

export { createUrl, updateObjectState, CommonStyles, sortType };
