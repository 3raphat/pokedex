import { Fragment } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { Progress } from '@/components/ui/progress';
import { BackButton } from '@/components/back-button';
import { PokemonEvolutions } from '@/components/pokemon-evolutions';
import { PokemonMoves } from '@/components/pokemon-moves';

async function getPokemonData(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) {
    notFound();
  }
  return res.json();
}

async function getPokemonSpecies(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}): Promise<Metadata> {
  const pokemon = await getPokemonData(params.name);
  return {
    title: `${
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    } | Pokédex`,
    description: `Details about ${pokemon.name}, including stats, abilities, and more.`,
  };
}

export default async function PokemonPage({
  params,
}: {
  params: { name: string };
}) {
  const pokemon = await getPokemonData(params.name);
  const species = await getPokemonSpecies(params.name);

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="mb-6 text-4xl font-bold capitalize">{pokemon.name}</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center">
          <div className="mb-4 rounded-lg bg-muted p-4">
            <Image
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              width={300}
              height={300}
              priority
              className="h-auto w-full"
            />
          </div>
          <div className="text-center">
            <p className="mb-2 text-lg">
              <strong>Height:</strong> {pokemon.height / 10} m
            </p>
            <p className="mb-4 text-lg">
              <strong>Weight:</strong> {pokemon.weight / 10} kg
            </p>
            <h3 className="mb-2 text-xl font-semibold">Types</h3>
            <div className="flex justify-center gap-2">
              {pokemon.types.map((type: { type: { name: string } }) => (
                <span
                  key={type.type.name}
                  className="rounded-full px-3 py-1 capitalize text-white"
                  style={{ backgroundColor: getTypeColor(type.type.name) }}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold underline">Details</h2>
          <h3 className="mb-2 text-xl font-semibold">Abilities</h3>
          <ul className="mb-4 list-inside list-disc">
            {pokemon.abilities.map((ability: { ability: { name: string } }) => (
              <li
                key={ability.ability.name}
                className="capitalize"
              >
                {ability.ability.name.replace('-', ' ')}
              </li>
            ))}
          </ul>
          <h3 className="mb-2 text-xl font-semibold">Base Stats</h3>
          <ul className="space-y-2">
            {pokemon.stats.map(
              (stat: { base_stat: number; stat: { name: string } }) => (
                <li
                  key={stat.stat.name}
                  className="flex items-center"
                >
                  <div className="flex flex-col w-full">
                    <span className="capitalize">{stat.stat.name}:</span>
                    <div className="flex items-center">
                      <Progress value={(stat.base_stat / 200) * 100} />
                      <span className="ml-2 text-sm">{stat.base_stat}</span>
                    </div>
                  </div>
                </li>
              ),
            )}
          </ul>
          {species && (
            <Fragment>
              <h3 className="mb-2 mt-4 text-xl font-semibold">Description</h3>
              <p className="mb-4">
                {species.flavor_text_entries
                  .find(
                    (entry: { language: { name: string } }) =>
                      entry.language.name === 'en',
                  )
                  ?.flavor_text.replace(/\f/g, ' ')}
              </p>
            </Fragment>
          )}
        </div>
      </div>
      <PokemonEvolutions speciesId={pokemon.id} />
      <PokemonMoves moves={pokemon.moves} />
    </div>
  );
}

function getTypeColor(type: string): string {
  const typeColors: { [key: string]: string } = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  };

  return typeColors[type] || '#777';
}
