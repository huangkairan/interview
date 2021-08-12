import xlsx from 'xlsx'

export default function getExcelFileContext(fileName: string): unknown[] {
  const workbook = xlsx.readFile(`./${fileName}.xlsx`)
  const sheetNames = workbook.SheetNames
  const sheet1 = workbook.Sheets[sheetNames[0]]
  const range = xlsx.utils.decode_range(sheet1['!ref']!)

  const result: unknown[] = []
  const keys: string[] = []

  for (let row = range.s.r; row <= range.e.r; ++row) {
    const rowValue: string[] = []

    for (let column = range.s.c; column <= range.e.c; ++column) {
      const cell_address = { c: column, r: row }
      const cell = xlsx.utils.encode_cell(cell_address)
      if (sheet1[cell])
        rowValue.push(sheet1[cell].v)
    }

    if (row === range.s.r) {
      keys.push(...rowValue)
    }
    else if (rowValue.length === keys.length) {
      const obj: Record<string, string | number> = {}
      // console.log(keys, rowValue)
      keys.forEach((key, index) => obj[key] = rowValue[index])
      result.push(obj)
    }
  }

  return result
}
