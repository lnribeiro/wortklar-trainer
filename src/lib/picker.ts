import { Card, ProgressRecord } from '../types/cards';

export interface PickOptions {
  cards: Card[];
  progressMap: Record<string, ProgressRecord>;
  now: number;
  lastCardId?: string | null;
}

function getDefaultProgress(): ProgressRecord {
  return { g: 0, r: 0, lastSeen: 0, cooldownUntil: 0 };
}

function computeWeight(progress: ProgressRecord, now: number) {
  const r = progress.r ?? 0;
  const g = progress.g ?? 0;
  const lastSeen = progress.lastSeen ?? 0;
  const base = (r + 1) / (g + 1);
  let weight = Math.pow(base, 1.5);
  if (r + g < 2) {
    weight *= 2;
  }
  if (now - lastSeen < 30_000) {
    weight *= 0.05;
  }
  weight = Math.min(Math.max(weight, 0.0001), 1000);
  return weight;
}

function weightedChoice<T extends { weight: number }>(items: T[]): T | undefined {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  if (total <= 0) return undefined;
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

export function pickNextCard(options: PickOptions): Card | undefined {
  const { cards, progressMap, now, lastCardId } = options;
  const eligible = cards.filter((c) => c.active !== false);
  if (eligible.length === 0) return undefined;

  const ready = eligible.filter((card) => {
    const prog = progressMap[card.id] ?? getDefaultProgress();
    return now >= (prog.cooldownUntil ?? 0);
  });

  const candidates = ready.length > 0 ? ready : eligible;

  const weighted = candidates.map((card) => {
    const prog = progressMap[card.id] ?? getDefaultProgress();
    return {
      card,
      weight: computeWeight(prog, now)
    };
  });

  const firstPick = weightedChoice(weighted);
  if (!firstPick) return undefined;
  if (lastCardId && firstPick.card.id === lastCardId && weighted.length >= 2) {
    const rerolled = weightedChoice(weighted);
    return (rerolled ?? firstPick).card;
  }
  return firstPick.card;
}
