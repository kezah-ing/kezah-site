import { createReader } from '@keystatic/core/reader';
import config from '../../keystatic.config';

export const reader = createReader(process.cwd(), config);

const imgBase: Record<string, string> = {
  covers: '/uploads/covers/',
  portrait: '/uploads/portrait/',
  logos: '/uploads/logos/',
  files: '/uploads/files/',
};
export const asset = (v: string | null | undefined, kind: keyof typeof imgBase) =>
  !v ? null : v.startsWith('/') || v.startsWith('http') ? v : imgBase[kind] + v;

export const STYLE_LABEL: Record<string, string> = {
  editorial: 'Editorial research',
  green: 'Dark green technical',
  navy: 'Navy and gold',
  other: 'Deck',
};
// Colours for the stand-in tile shown while a deck has no cover image yet.
export const TILE: Record<string, { bg: string; fg: string; ac: string; font: string }> = {
  green: { bg: '#0F2A21', fg: '#CFE8DB', ac: '#3FD39A', font: "'JetBrains Mono',monospace" },
  editorial: { bg: '#F1EBDD', fg: '#1A1A18', ac: '#9C4620', font: "'Fraunces Variable',Georgia,serif" },
  navy: { bg: '#0F1B33', fg: '#E9E3D2', ac: '#C9A24B', font: "'Fraunces Variable',Georgia,serif" },
  other: { bg: '#171C20', fg: '#ECE8DF', ac: '#8FD3B6', font: "'Fraunces Variable',Georgia,serif" },
};

export async function getSite() {
  const s = await reader.singletons.site.read();
  if (!s) throw new Error('content/site.json is missing');
  return s;
}

export async function getDecks() {
  const all = await reader.collections.caseStudies.all();
  return all
    .map(({ slug, entry }) => ({
      slug,
      ...entry,
      coverUrl: asset(entry.cover, 'covers'),
      pdfUrl: asset(entry.pdf, 'files'),
      styleLabel: entry.deckStyleLabel || STYLE_LABEL[entry.deckStyle] || 'Deck',
    }))
    .filter((d) => d.featured)
    .sort((a, b) => a.order - b.order);
}
export type Deck = Awaited<ReturnType<typeof getDecks>>[number];

export const paras = (t?: string | null) => (t ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
export const fmtDate = (d?: string | null) =>
  d ? new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';
