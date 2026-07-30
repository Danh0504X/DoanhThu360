export const Table = ({
  mobileList,
  desktopTable,
  pagination,
  itemLabel = 'mục',
  className = '',
}) => {
  const total = pagination?.total || 0;
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const totalPages = pagination?.totalPages || 1;
  const onPageChange = pagination?.onPageChange || (() => {});
  const start = total ? (page - 1) * limit + 1 : 0;
  const end = Math.min(page * limit, total);

  return (
    <section className={['overflow-hidden rounded-md border border-bone-200 bg-white', className].join(' ')}>
      <div className="lg:hidden">{mobileList}</div>
      <div className="hidden overflow-x-auto lg:block">{desktopTable}</div>

      {pagination ? (
        <div className="flex flex-col gap-4 border-t border-bone-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-bone-500">
            Hiển thị {start} - {end} trên tổng số {total} {itemLabel}
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="rounded-sm border border-bone-200 px-3 py-2 text-sm font-bold text-bone-600 transition-brand hover:bg-bone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 3).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`rounded-sm px-3 py-2 text-sm font-bold transition-brand ${
                  page === pageNumber
                    ? 'bg-primary-600 text-white'
                    : 'border border-bone-200 text-bone-600 hover:bg-bone-50'
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="rounded-sm border border-bone-200 px-3 py-2 text-sm font-bold text-bone-600 transition-brand hover:bg-bone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
};
