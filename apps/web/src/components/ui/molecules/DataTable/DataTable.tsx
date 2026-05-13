import { Skeleton } from '@/components/ui/atoms/Skeleton';
import { cn } from '@/lib/utils';

export type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  data?: T[];
  loading?: boolean;
  className?: string;
  getRowKey?: (row: T) => string;
  ariaLabel?: string;
};

const DataTable = <T,>({
  columns,
  data = [],
  loading,
  className,
  getRowKey,
  ariaLabel,
}: DataTableProps<T>) => {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-xl border border-brand-border',
        className,
      )}
    >
      <table
        className="w-full text-sm"
        aria-label={ariaLabel ?? 'Tabla de datos'}
      >
        <thead>
          <tr className="bg-brand-neutral-50 border-b border-brand-border">
            {columns.map(col => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wide whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-brand-border last:border-0"
                >
                  {columns.map(col => (
                    <td key={String(col.key)} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row, i) => (
                <tr
                  key={getRowKey ? getRowKey(row) : i}
                  className="border-b border-brand-border last:border-0 hover:bg-brand-neutral-50 transition-colors"
                >
                  {columns.map(col => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 text-brand-text-primary"
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
