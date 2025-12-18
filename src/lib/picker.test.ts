import { describe, it, expect, vi, afterEach } from 'vitest';
import { pickNextCard } from './picker';
import { Card, ProgressRecord } from '../types/cards';

const noun = (id: string): Card => ({
  id,
  type: 'noun',
  level: 'easy',
  front: { lemma: id },
  reveal: { articleNom: 'der', plural: 'X', examples: [{ de: 'Beispiel' }] }
});

const verbPrep = (id: string): Card => ({
  id,
  type: 'verb_prep',
  level: 'easy',
  front: { pattern: `${id} ___` },
  reveal: { pattern: `${id} auf + Akk.`, examples: [{ de: 'Beispiel' }] }
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('pickNextCard', () => {
  it('returns undefined when no eligible cards', () => {
    const cards: Card[] = [{ ...noun('noun-1'), active: false }];
    const result = pickNextCard({ cards, progressMap: {}, now: Date.now(), lastCardId: null });
    expect(result).toBeUndefined();
  });

  it('falls back to eligible pool when all candidates are on cooldown', () => {
    const now = Date.now();
    const cards: Card[] = [noun('noun-1')];
    const progress: Record<string, ProgressRecord> = {
      'noun-1': { g: 0, r: 0, lastSeen: now, cooldownUntil: now + 60_000 }
    };
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const result = pickNextCard({ cards, progressMap: progress, now, lastCardId: null });
    expect(result?.id).toBe('noun-1');
  });

  it('rerolls once when the same card repeats and multiple candidates exist', () => {
    const now = Date.now();
    const cards: Card[] = [noun('a'), verbPrep('b')];
    // First pick grabs 'a', reroll should pick 'b'
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.0) // pick first item
      .mockReturnValueOnce(0.9); // pick second item on reroll
    const result = pickNextCard({ cards, progressMap: {}, now, lastCardId: 'a' });
    expect(result?.id).toBe('b');
  });

  it('prefers higher weight cards when random favors them', () => {
    const now = Date.now();
    const cards: Card[] = [noun('light'), noun('heavy')];
    const progress: Record<string, ProgressRecord> = {
      light: { g: 0, r: 0, lastSeen: 0, cooldownUntil: 0 },
      heavy: { g: 0, r: 5, lastSeen: 0, cooldownUntil: 0 }
    };
    // roll near the upper bound to land on heavy weight
    vi.spyOn(Math, 'random').mockReturnValue(0.95);
    const result = pickNextCard({ cards, progressMap: progress, now, lastCardId: null });
    expect(result?.id).toBe('heavy');
  });
});
