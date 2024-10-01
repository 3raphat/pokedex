import { ITEMS_PER_PAGE } from '@/lib/constant';

export async function getPokemonList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const limit = 100000;
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;

  const res = await fetch(url);
  const data = await res.json();

  const filteredResults = data.results.filter((pokemon: { name: string }) =>
    pokemon.name.toLowerCase().includes(query.toLowerCase()),
  );

  const totalCount = filteredResults.length;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = filteredResults.slice(
    offset,
    offset + ITEMS_PER_PAGE,
  );

  return {
    results: paginatedResults,
    totalCount: totalCount,
    nextPage: offset + ITEMS_PER_PAGE < totalCount ? currentPage + 1 : null,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
  };
}
