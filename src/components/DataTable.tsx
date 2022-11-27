import { Entry } from './CSVReader';
import './DataTable.scss';
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Table as ReactTable,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { InputGroup, Pagination, Table } from 'react-bootstrap';

interface IProps {
  data: Entry[];
}

const DataTable = ({ data }: IProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Entry>[]>(
    () => [
      {
        accessorKey: 'originalPhoneNumber',
        header: () => <span>Phone</span>,
        footer: (props) => props.column.id
      },
      {
        accessorFn: (row) => row.firstDate.format('L LT'),
        id: 'firstDate',
        header: () => <span>First Date</span>,
        footer: (props) => props.column.id
      },
      {
        accessorFn: (row) => row.lastDate.format('L LT'),
        id: 'lastDate',
        header: () => <span>Last Date</span>,
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'name',
        header: () => <span>Name (VCF)</span>,
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'phoneNumber',
        header: () => <span>Phone (VCF)</span>,
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'match',
        header: () => <span>Match</span>,
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'path',
        header: () => <span>Path</span>,
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'size',
        header: () => <span>Size</span>,
        footer: (props) => props.column.id
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  });

  return (
    <div>
      <Table striped bordered hover responsive size="sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        <div
                          {...{
                            className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                            onClick: header.column.getToggleSortingHandler()
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽'
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? <Filter column={header.column} table={table} /> : null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {PaginationControls(table)}
    </div>
  );
};

const PaginationControls = (table: ReactTable<Entry>) => {
  let isPageNumberOutOfRange = false;

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const pages = [...new Array(pageCount)].map((_, index) => {
    const pageNumber = index + 1;
    const isPageNumberFirst = pageNumber === 1;
    const isPageNumberLast = pageNumber === pageCount;
    const isCurrentPageWithinTwoPageNumbers = Math.abs(pageNumber - currentPage) <= 2;

    if (isPageNumberFirst || isPageNumberLast || isCurrentPageWithinTwoPageNumbers) {
      isPageNumberOutOfRange = false;
      return (
        <Pagination.Item
          key={pageNumber}
          onClick={() => table.setPageIndex(pageNumber - 1)}
          active={pageNumber === currentPage}
        >
          {pageNumber}
        </Pagination.Item>
      );
    }

    if (!isPageNumberOutOfRange) {
      isPageNumberOutOfRange = true;
      return <Pagination.Ellipsis key={pageNumber} className="muted" />;
    }

    return null;
  });

  return (
    <Pagination>
      <Pagination.First onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} />
      <Pagination.Prev onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />

      {pages}

      <Pagination.Next onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
      <Pagination.Last
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      />
    </Pagination>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Filter = ({ column, table }: { column: Column<any, any>; table: ReactTable<any> }) => {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <InputGroup className="range-filter d-flex justify-content-between">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(e) => column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])}
        placeholder={'Min'}
        className="min border shadow rounded"
      />

      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(e) => column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
        placeholder={'Max'}
        className="max border shadow rounded"
      />
    </InputGroup>
  ) : (
    <InputGroup className="text-filter">
      <input
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={'Search...'}
        className="border shadow rounded"
      />
    </InputGroup>
  );
};

export default DataTable;
