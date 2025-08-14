import { drizzle } from 'drizzle-orm/postgres-js';
import { DATABASE_URL } from '../configuration';
import postgres from 'postgres';

const client = postgres(DATABASE_URL);
export const db = drizzle(client);