import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import { ITEMS_PER_PAGE } from '@/lib/constant';
import { getPokemonList } from '@/lib/get-pokemon-list';
import { Button } from '@/components/ui/button';
import { SelectPage } from '@/components/select-page';

export async function PokemonList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { results, totalCount, nextPage, previousPage } = await getPokemonList({
    query,
    currentPage,
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const pokemonList = results.map((pokemon: { name: string; url: string }) => {
    return {
      name: pokemon.name,
      id: pokemon.url.split('/')[6],
    };
  });

  const getImageUrl = async (name: string): Promise<string | null> => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data.sprites.front_default;
  };

  return (
    <div className="space-y-4">
      {totalPages > 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Showing page {currentPage} of {totalPages} | Total results:{' '}
          {totalCount}
        </p>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          No results found
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {pokemonList.map((pokemon: { name: string; id: string }) => (
          <div
            key={pokemon.name}
            className="flex flex-col items-center rounded-lg border p-3 shadow-sm"
          >
            {getImageUrl(pokemon.name).then((url) =>
              url ? (
                <Image
                  src={url}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
              ) : (
                <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-muted">
                  <p className="text-sm text-muted-foreground">No image</p>
                </div>
              ),
            )}
            <Link
              href={`/pokemon/${pokemon.name}`}
              className="mt-1 text-center capitalize hover:underline"
            >
              {pokemon.name}
            </Link>
          </div>
        ))}
      </div>
      {totalPages > 0 && (
        <div className="flex justify-center space-x-4">
          <SelectPage totalPages={totalPages} />
          {previousPage && (
            <Button asChild>
              <Link
                href={
                  query
                    ? `/?page=${previousPage}&q=${query}`
                    : `/?page=${previousPage}`
                }
              >
                <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
              </Link>
            </Button>
          )}
          {nextPage && (
            <Button asChild>
              <Link
                href={
                  query ? `/?page=${nextPage}&q=${query}` : `/?page=${nextPage}`
                }
              >
                Next <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
