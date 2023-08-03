import { User } from 'next-auth';
import type { Usage } from 'tier';

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string;
      address: string;
      limit: Usage;
    };
  }
}
