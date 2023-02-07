import styled from "styled-components";

function createUrl(tableSettings, extraFilters) {
  const parametersObject = {
    ...{
      page: tableSettings.pagination.page,
      limit: tableSettings.pagination.pageSize,
      sortorder: tableSettings.sorting.type,
      sortfield: tableSettings.sorting.field,
      searchvalue: tableSettings.search.value,
      searchfield: tableSettings.search.field,
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
  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    tbody tr {
      height: 50px;
      font-size: 13px;
      color: #595959;
      font-weight: 500;
      font-size: 16px;
    }
    th,
    td {
      padding: 20px 0 22px;
      position: relative;
      margin: 0;
      font-weight: 500;
      min-width: 200px;
      max-width: 500px;
      border-bottom: 1px solid #f0f0f0;
      text-align: left;
      :last-child {
        border-right: 0;
      }
    }
  }
`;
const sortType = {
  UP: "asc",
  DOWN: "desc",
};

export { createUrl, updateObjectState, CommonStyles, sortType };
