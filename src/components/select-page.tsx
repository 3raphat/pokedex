'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SelectBox } from '@/components/ui/select-box';

export function SelectPage({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;

  const handleChange = useCallback(
    (value: string | string[]) => {
      const newPage = Number(value);
      const params = new URLSearchParams(searchParams);

      if (value === '') {
        params.delete('page');
      } else {
        params.set('page', newPage.toString());
      }

      const query = searchParams.get('q');
      if (query) {
        params.set('q', query);
      }

      router.push(`/?${params.toString()}`);
    },
    [searchParams, router],
  );

  const pageOptions = useMemo(
    () =>
      Array.from({ length: totalPages }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Page ${i + 1}`,
      })),
    [totalPages],
  );

  return (
    <SelectBox
      options={pageOptions}
      value={currentPage.toString()}
      onChange={handleChange}
      placeholder="Select a page"
      inputPlaceholder="Search pages..."
      emptyPlaceholder="No matching pages found"
      className="w-full max-w-xs"
    />
  );
}
