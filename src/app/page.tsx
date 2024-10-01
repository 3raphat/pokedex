import { Suspense } from 'react';

import { Loader } from '@/components/loader';
import { PokemonList } from '@/components/pokemon-list';
import { SearchInput } from '@/components/search-input';

import 'ldrs/quantum';

import Link from 'next/link';

export default function Home({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams?.q || '';
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <h1 className="mb-6 text-center text-3xl font-bold">
          <Link href="/">Pokédex</Link>
        </h1>
        <div className="mx-auto mb-4 max-w-xl">
          <SearchInput />
        </div>
        <Suspense
          key={query + currentPage}
          fallback={
            <div className="mt-10 flex flex-col items-center">
              <Loader />
              <p className="mt-4 text-gray-600">Loading Pokémon...</p>
            </div>
          }
        >
          <PokemonList
            query={query}
            currentPage={currentPage}
          />
        </Suspense>
      </div>
    </div>
  );
}
