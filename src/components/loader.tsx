'use client';

import { useEffect } from 'react';

export function Loader() {
  useEffect(() => {
    async function getLoader() {
      const { quantum } = await import('ldrs');
      quantum.register();
    }
    getLoader();
  }, []);
  return (
    <l-quantum
      size="45"
      speed="1.75"
    ></l-quantum>
  );
}
