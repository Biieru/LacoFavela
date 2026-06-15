export function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return

  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(';'),
    ...rows.map(row =>
      headers.map(h => {
        const val = row[h] ?? ''
        const str = String(val).replace(/"/g, '""')
        return str.includes(';') || str.includes('"') || str.includes('\n')
          ? `"${str}"`
          : str
      }).join(';')
    ),
  ].join('\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
