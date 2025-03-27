import type { route as routeFn } from 'ziggy-js';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

declare global {
    const route: typeof routeFn;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps {
      flash: {
        success?: string;
        error?: string;
      };
      // Add other shared props here
      [key: string]: unknown; // Index signature
    }
  }
  
  declare module '@inertiajs/react' {
    export function usePage<T = {}>(): {
      props: PageProps & T;
    };
  }