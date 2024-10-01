/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

async function getEvolutionChain(speciesId: number) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${speciesId}`,
  );
  const species = await res.json();
  const evolutionChainRes = await fetch(species.evolution_chain.url);
  return evolutionChainRes.json();
}

function extractEvolutions(chain: any): any[] {
  const evolutions = [
    {
      name: chain.species.name,
      id: chain.species.url.split('/').slice(-2, -1)[0],
    },
  ];

  if (chain.evolves_to.length > 0) {
    evolutions.push(...extractEvolutions(chain.evolves_to[0]));
  }

  return evolutions;
}

export function PokemonEvolutions({ speciesId }: { speciesId: number }) {
  const [evolutions, setEvolutions] = useState<any[]>([]);

  useEffect(() => {
    getEvolutionChain(speciesId)
      .then((data) => {
        const extractedEvolutions = extractEvolutions(data.chain);
        setEvolutions(extractedEvolutions);
      })
      .catch((error) =>
        console.error('Error fetching evolution chain:', error),
      );
  }, [speciesId]);

  if (evolutions.length <= 1) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-semibold">Evolution Chain</h2>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {evolutions.map((evolution, index) => (
          <div
            key={evolution.name}
            className="flex items-center"
          >
            <Link
              href={`/pokemon/${evolution.name}`}
              className="text-center"
            >
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`}
                alt={evolution.name}
                width={96}
                height={96}
              />
              <p className="mt-2 capitalize">{evolution.name}</p>
            </Link>
            {index < evolutions.length - 1 && (
              <span className="mx-4 text-2xl">&rarr;</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
