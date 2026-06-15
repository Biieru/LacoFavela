import type { PdfOptions } from './exportPdf'

export type { PdfColumn, PdfOptions } from './exportPdf'

/** Carrega o módulo de PDF só quando o usuário exporta */
export async function exportToPdf(opts: PdfOptions) {
  const { exportToPdf: run } = await import('./exportPdf')
  return run(opts)
}
