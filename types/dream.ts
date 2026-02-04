export interface Dream {
  id: string;
  date: Date;
  content: string;
  audioUrl?: string;
  analysis: DreamAnalysis | null;
  tags?: string[];
  createdAt: Date;
}

export interface DreamAnalysis {
  summary: string;
  characters: Character[];
  locations: Location[];
  mood: string;
  themes: string[];
  patterns: Pattern[];
  insights?: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
  firstSeen: Date;
  occurrences: number;
  dreams: string[];
  avatar?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  type: 'indoor' | 'outdoor' | 'abstract' | 'familiar';
  firstSeen: Date;
  occurrences: number;
  dreams: string[];
}

export interface Pattern {
  id: string;
  type: 'recurring' | 'symbolic' | 'emotional';
  description: string;
  significance: string;
  frequency: number;
  dreams: string[];
}

export interface DayWithDreams {
  date: Date;
  dreams: Dream[];
}

export interface AppSettings {
  voiceEnabled: boolean;
}

