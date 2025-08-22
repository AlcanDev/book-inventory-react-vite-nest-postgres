export type SortDir = 'asc' | 'desc';

export interface PageQuery {
  page?: number | string | null;
  limit?: number | string | null;
  sort?: SortDir | 'ASC' | 'DESC' | string | null;
  search?: string | null | undefined;
  tags?: string[] | string | undefined;
}

export function normalizeQuery(q?: PageQuery) {
  const pageNum = Number(q?.page);
  const limitNum = Number(q?.limit);

  const page = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;

  const limit =
    !isNaN(limitNum) && limitNum > 0
      ? limitNum > 100
        ? 100 // cap
        : limitNum
      : 10;

  const sortRaw = (q?.sort ?? 'asc').toString().toLowerCase();
  const sort: SortDir = sortRaw === 'desc' ? 'desc' : 'asc';

  const search = (q?.search ?? '').trim() || undefined;

  const tags = Array.isArray(q?.tags)
    ? (q!.tags as string[]).filter(Boolean)
    : typeof q?.tags === 'string'
      ? q!.tags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

  return { page, limit, sort, search, tags };
}

export function chooseId(paramsId?: string, bodyId?: string) {
  // Cubrimos ramas: ambos definidos/uno/ninguno
  if (paramsId != null && paramsId !== '') return paramsId;
  if (bodyId != null && bodyId !== '') return bodyId;
  return undefined;
}
