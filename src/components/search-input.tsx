'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('q')?.toString() || '',
  );

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
      params.delete('page');
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleClear = () => {
    setSearchTerm('');
    handleSearch('');
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <Label
        htmlFor="search"
        className="sr-only"
      >
        Search
      </Label>
      <Input
        className="peer pl-10 pr-10"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground peer-focus:text-foreground" />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all hover:text-foreground"
        >
          <Cross2Icon className="h-[18px] w-[18px]" />
        </button>
      )}
    </div>
  );
}
