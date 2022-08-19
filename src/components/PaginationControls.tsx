import { Dispatch, SetStateAction } from 'react'

const PaginationControls = ({
  page,
  setPage,
  hasMore,
}: {
  page: number
  hasMore: boolean
  setPage: Dispatch<SetStateAction<number>>
}) => {
  return (
    <div>
      <button
        className='inline-block p-2 border rounded bg-slate-100 disabled:bg-white disabled:text-slate-300 disabled:cursor-not-allowed'
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>
      <button
        className='inline-block p-2 border rounded bg-slate-100 disabled:bg-white disabled:text-slate-300 disabled:cursor-not-allowed'
        onClick={() => {
          setPage((old) => (hasMore ? old + 1 : old))
        }}
        disabled={!hasMore}
      >
        Next Page
      </button>
    </div>
  )
}
export default PaginationControls
