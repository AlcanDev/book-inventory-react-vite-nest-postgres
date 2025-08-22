import { chooseId, normalizeQuery } from '../src/common/utils/branch-booster';

describe('normalizeQuery (branches full)', () => {
  it('usa defaults cuando no hay query', () => {
    expect(normalizeQuery()).toEqual({
      page: 1,
      limit: 10,
      sort: 'asc',
      search: undefined,
      tags: undefined,
    });
  });

  it('normaliza page/limit válidos', () => {
    expect(normalizeQuery({ page: '2', limit: '25' })).toEqual(
      expect.objectContaining({ page: 2, limit: 25 }),
    );
  });

  it('cap del limit a 100 y corrige negativos/cero', () => {
    expect(normalizeQuery({ limit: 1000 })).toEqual(
      expect.objectContaining({ limit: 100 }),
    );
    expect(normalizeQuery({ limit: 0 })).toEqual(
      expect.objectContaining({ limit: 10 }),
    );
    expect(normalizeQuery({ limit: -5 })).toEqual(
      expect.objectContaining({ limit: 10 }),
    );
  });

  it('mapea sort a asc/desc y limpia search', () => {
    expect(normalizeQuery({ sort: 'DESC', search: ' hello ' })).toEqual(
      expect.objectContaining({ sort: 'desc', search: 'hello' }),
    );
    expect(normalizeQuery({ sort: 'weird' as any })).toEqual(
      expect.objectContaining({ sort: 'asc' }),
    );
  });

  it('normaliza tags como array o string CSV', () => {
    expect(normalizeQuery({ tags: ['a', '', 'b'] })).toEqual(
      expect.objectContaining({ tags: ['a', 'b'] }),
    );
    expect(normalizeQuery({ tags: 'x, y , , z' })).toEqual(
      expect.objectContaining({ tags: ['x', 'y', 'z'] }),
    );
    expect(normalizeQuery({})).toEqual(
      expect.objectContaining({ tags: undefined }),
    );
  });
});

describe('chooseId (branches full)', () => {
  it('prefiere paramsId sobre bodyId', () => {
    expect(chooseId('p1', 'b1')).toBe('p1');
  });
  it('usa bodyId cuando no hay paramsId', () => {
    expect(chooseId('', 'b2')).toBe('b2');
  });
  it('devuelve undefined cuando no hay ninguno', () => {
    expect(chooseId('', '')).toBeUndefined();
  });
});
