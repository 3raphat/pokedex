'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface Move {
  move: {
    name: string;
  };
}

export function PokemonMoves({ moves }: { moves: Move[] }) {
  const [showAllMoves, setShowAllMoves] = useState(false);
  const displayedMoves = showAllMoves ? moves : moves.slice(0, 5);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-semibold">Moves</h2>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {displayedMoves.map((move) => (
          <li
            key={move.move.name}
            className="rounded bg-muted p-2 text-center capitalize"
          >
            {move.move.name.replace('-', ' ')}
          </li>
        ))}
      </ul>
      {moves.length > 5 && (
        <Button
          onClick={() => setShowAllMoves(!showAllMoves)}
          className="mt-4"
        >
          {showAllMoves ? 'Show Less' : 'Show All Moves'}
        </Button>
      )}
    </div>
  );
}
