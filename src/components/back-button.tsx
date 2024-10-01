'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

export function BackButton({ text = 'Back' }) {
  const router = useRouter();
  return (
    <Button
      className="mb-4"
      onClick={() => router.back()}
    >
      <ChevronLeftIcon className="mr-2 h-4 w-4" /> {text}
    </Button>
  );
}
