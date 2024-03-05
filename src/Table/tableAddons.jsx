import styled from "styled-components"

function createUrl(tableSettings, extraFilters) {
  let parametersObject = {
    ...{
      page: tableSettings?.pagination.page,
      limit: tableSettings?.pagination.pageSize,
    },
    ...extraFilters,
  }
  if (tableSettings?.sortingSettings) {
    parametersObject = {
      ...parametersObject,
      ordering: tableSettings?.sortingSettings,
    }
  }
  if (tableSettings?.search.field.searchField && tableSettings?.search.value) {
    parametersObject = {
      ...parametersObject,
      [tableSettings?.search.field.searchField + "__icontains"]:
        tableSettings?.search.value,
    }
  }

  parametersObject = Object.fromEntries(
    Object.entries(parametersObject).filter(([_, v]) => v != null)
  )
  const url =
    tableSettings.endPoint + "?" + new URLSearchParams(parametersObject)
  return url
}

function updateObjectState(key, nestedKey, value, setObjectState) {
  setObjectState((prev) => {
    const newObj = { ...prev }
    if (nestedKey) {
      newObj[key][nestedKey] = value
    } else {
      newObj[key] = value
    }
    return newObj
  })
}

function storeInLocalStorage(tableKey, tableSettingKey, tableSettingValue) {
  if (tableKey) {
    let localStorageTableSettings = JSON.parse(
      localStorage.getItem("tableSettings")
    )
    localStorageTableSettings = {
      ...localStorageTableSettings,
      [tableKey]: {
        ...localStorageTableSettings?.[tableKey],
        [tableSettingKey]: tableSettingValue,
      },
    }
    localStorage.setItem(
      "tableSettings",
      JSON.stringify(localStorageTableSettings)
    )
  }
}

const CommonStyles = styled.div`
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  border-radius: 5px;

  table {
    width: 100%;
    border-spacing: 0;

    thead {
      tr {
        color: #757575;
        font-weight: 600;
        font-size: 14px;

        th {
          min-width: 200px;
          max-width: 800px;
          text-align: center;
          padding: 0 30px;
          border-left: 1px solid #f3f3f3;
          :first-child {
            min-width: 60px;
          }
          :last-child {
            border-right: 1px solid #f3f3f3;
          }
        }
      }
    }

    tbody {
      tr {
        height: 65px;
        font-weight: 500;
        font-size: 14px;
        color: #757575;
        td {
          min-width: 200px;
          max-width: 800px;
          text-align: center;
          border-top: 1px solid #f3f3f3;
          padding: 0 30px;
          border-left: 1px solid #f3f3f3;
          :first-child {
            min-width: 60px;
          }
          :last-child {
            border-right: 1px solid #f3f3f3;
          }
        }
      }
    }
  }
`

const StripedTable = styled.div`
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  border-radius: 5px;

  table {
    width: 100%;
    border-spacing: 0;

    thead {
      tr {
        color: #757575;
        font-weight: 600;
        font-size: 14px;

        th {
          min-width: 200px;
          max-width: 800px;
          text-align: center;
          padding: 0 30px;
          border-left: 1px solid #f3f3f3;
          :first-child {
            min-width: 60px;
          }
          :last-child {
            border-right: 1px solid #f3f3f3;
          }
        }
      }
    }

    tbody {
      tr {
        height: 65px;
        font-weight: 500;
        font-size: 14px;
        color: #757575;
        &:nth-child(odd) {
          background-color: #bfcae41f;
        }
        td {
          min-width: 200px;
          max-width: 800px;
          text-align: center;
          border-top: 1px solid #f3f3f3;
          padding: 0 30px;
          border-left: 1px solid #f3f3f3;
          :first-child {
            min-width: 60px;
          }
          :last-child {
            border-right: 1px solid #f3f3f3;
          }
        }
      }
    }
  }
`
const sortType = {
  UP: "asc",
  DOWN: "desc",
}

export {
  createUrl,
  updateObjectState,
  storeInLocalStorage,
  CommonStyles,
  StripedTable,
  sortType,
}
