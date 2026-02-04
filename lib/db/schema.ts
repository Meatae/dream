import Dexie, { Table } from 'dexie';
import { Dream, Character, Location, Pattern } from '@/types/dream';

export class DreamDatabase extends Dexie {
  dreams!: Table<Dream>;
  characters!: Table<Character>;
  locations!: Table<Location>;
  patterns!: Table<Pattern>;

  constructor() {
    super('DreamAnalyzerDB');
    this.version(1).stores({
      dreams: 'id, date, createdAt',
      characters: 'id, name, firstSeen',
      locations: 'id, name, firstSeen',
      patterns: 'id, type, description'
    });
  }
}

export const db = new DreamDatabase();

export async function saveDream(dream: Dream): Promise<void> {
  await db.dreams.put(dream);
}

export async function getDream(id: string): Promise<Dream | undefined> {
  return await db.dreams.get(id);
}

export async function getAllDreams(): Promise<Dream[]> {
  return await db.dreams.toArray();
}

export async function getDreamsByDate(date: Date): Promise<Dream[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return await db.dreams.where('date').between(startOfDay, endOfDay).toArray();
}

export async function deleteDream(id: string): Promise<void> {
  await db.dreams.delete(id);
}

export async function updateDream(id: string, updates: Partial<Dream>): Promise<void> {
  await db.dreams.update(id, updates);
}

export async function saveCharacter(character: Character): Promise<void> {
  await db.characters.put(character);
}

export async function getAllCharacters(): Promise<Character[]> {
  return await db.characters.toArray();
}

export async function saveLocation(location: Location): Promise<void> {
  await db.locations.put(location);
}

export async function getAllLocations(): Promise<Location[]> {
  return await db.locations.toArray();
}

export async function savePattern(pattern: Pattern): Promise<void> {
  await db.patterns.put(pattern);
}

export async function getAllPatterns(): Promise<Pattern[]> {
  return await db.patterns.toArray();
}
