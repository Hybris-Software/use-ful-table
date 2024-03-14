import React, { useState } from "react"

export function Paginator({
  page,
  pageCount,
  pageSize,
  setPageSize,
  canNextPage,
  canPreviousPage,
  toPage,
  nextPage,
  previousPage,
}: {
  page: number
  pageCount: number
  pageSize: number
  setPageSize: (pageSize: number) => void
  canNextPage: boolean
  canPreviousPage: boolean
  toPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
}) {
  const [newPageSize, setNewPageSize] = useState(pageSize)

  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      <div>
        Page: {page} / {pageCount}
      </div>

      <div>
        <button onClick={previousPage} disabled={!canPreviousPage}>
          Previous
        </button>
        <button onClick={nextPage} disabled={!canNextPage}>
          Next
        </button>
        <button onClick={() => toPage(1)} disabled={page === 1}>
          First
        </button>
      </div>

      <div>
        <div>Current page size: {pageSize}</div>
        <div>
          New page size:
          <input
            type="number"
            value={newPageSize}
            onChange={(e) => setNewPageSize(Number(e.target.value))}
          />
          <button onClick={() => setPageSize(newPageSize)}>Set</button>
        </div>
      </div>
    </div>
  )
}
