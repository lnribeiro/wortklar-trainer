export type CardType = 'noun' | 'verb_prep';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface BaseCard {
  id: string;
  type: CardType;
  level: Difficulty;
  active?: boolean;
}

export interface NounCard extends BaseCard {
  type: 'noun';
  front: {
    lemma: string;
  };
  reveal: {
    articleNom: 'der' | 'die' | 'das';
    plural: string;
    examples: Array<{ de: string }>;
  };
  tags?: Record<string, unknown>;
}

export interface VerbPrepCard extends BaseCard {
  type: 'verb_prep';
  front: {
    pattern: string;
  };
  reveal: {
    pattern: string;
    examples: Array<{ de: string }>;
    notes?: string[];
  };
  tags?: Record<string, unknown>;
}

export type Card = NounCard | VerbPrepCard;

export interface ProgressRecord {
  g: number;
  r: number;
  lastSeen: number;
  cooldownUntil: number;
}
