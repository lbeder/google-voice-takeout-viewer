import { Entry } from './CSVReader';
import './DataTable.scss';
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Table as ReactTable,
  useReactTable
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { Pagination, Table } from 'react-bootstrap';

interface IProps {
  data: Entry[];
}

const DataTable = ({ data }: IProps) => {
  const columns = useMemo<ColumnDef<Entry>[]>(
    () => [
      {
        accessorKey: 'originalPhoneNumber',
        header: () => 'Phone Number (html)',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'firstDate',
        header: () => 'First Date',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'lastDate',
        header: () => 'Last Date',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'name',
        header: () => 'Name (VCF)',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'match',
        header: () => 'Match Length',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'path',
        header: () => 'Path',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'size',
        header: () => 'Size',
        footer: (props) => props.column.id
      }
    ],
    []
  );

  return (
    <DataTableReact
      {...{
        data,
        columns
      }}
    />
  );
};

const Pages = (table: ReactTable<Entry>) => {
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

const DataTableReact = ({ data, columns }: { data: Entry[]; columns: ColumnDef<Entry>[] }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
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

      {Pages(table)}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Filter = ({ column, table }: { column: Column<any, any>; table: ReactTable<any> }) => {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(e) => column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])}
        placeholder={'Min'}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(e) => column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
        placeholder={'Max'}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={'Search...'}
      className="w-36 border shadow rounded"
    />
  );
};

export default DataTable;
