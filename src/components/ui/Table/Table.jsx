import EmptyState from '../EmptyState'

export default function Table({ columns = [], rows = [] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-outline-variant">
      <table className="min-w-full divide-y divide-outline-variant text-left text-sm">
        <thead className="bg-surface-container">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="font-heading px-4 py-2 font-medium text-on-surface-variant">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {rows.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex}>
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-2 text-on-surface">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="p-6">
          <EmptyState message="Belum ada data" />
        </div>
      )}
    </div>
  )
}
