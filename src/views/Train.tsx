import { useEffect, useMemo, useState } from 'react';
import { Card, CardType, Difficulty, ProgressRecord } from '../types/cards';
import { NounCard } from '../components/cards/NounCard';
import { VerbPrepCard } from '../components/cards/VerbPrepCard';
import { bulkGetProgress, isStorageUnavailable, setProgress } from '../lib/db';
import { pickNextCard } from '../lib/picker';

interface TrainProps {
  cards: Card[];
  selectedTypes: CardType[];
  selectedLevels: Difficulty[];
  sessionSize: number;
  onExit: () => void;
  onOpenSettings: () => void;
}

export function Train({ cards, selectedLevels, selectedTypes, sessionSize, onExit, onOpenSettings }: TrainProps) {
  const [revealed, setRevealed] = useState(false);
  const [lastCardId, setLastCardId] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | undefined>();
  const [progressMap, setProgressMap] = useState<Record<string, ProgressRecord>>({});
  const [storageWarning, setStorageWarning] = useState(false);
  const [servedCount, setServedCount] = useState(0);
  const [initializing, setInitializing] = useState(true);

  const eligibleCards = useMemo(
    () =>
      cards.filter(
        (card) => selectedTypes.includes(card.type) && selectedLevels.includes(card.level) && card.active !== false
      ),
    [cards, selectedLevels, selectedTypes]
  );

  useEffect(() => {
    let mounted = true;
    async function load() {
      const ids = eligibleCards.map((c) => c.id);
      const existing = await bulkGetProgress(ids);
      if (!mounted) return;
      setProgressMap(existing);
      setStorageWarning(isStorageUnavailable());
      setInitializing(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [eligibleCards]);

  useEffect(() => {
    if (initializing) return;
    const next = pickNextCard({
      cards: eligibleCards,
      progressMap,
      now: Date.now(),
      lastCardId
    });
    setCurrentCard(next);
    setRevealed(false);
  }, [eligibleCards, progressMap, initializing, lastCardId]);

  const handleReveal = () => setRevealed(true);

  const updateProgress = async (cardId: string, result: 'green' | 'red') => {
    const now = Date.now();
    const prev = progressMap[cardId] ?? { g: 0, r: 0, lastSeen: 0, cooldownUntil: 0 };
    const next: ProgressRecord =
      result === 'green'
        ? {
            g: prev.g + 1,
            r: prev.r,
            lastSeen: now,
            cooldownUntil: now + 120_000
          }
        : {
            g: prev.g,
            r: prev.r + 1,
            lastSeen: now,
            cooldownUntil: now + 20_000
          };

    setProgressMap((map) => ({ ...map, [cardId]: next }));
    await setProgress(cardId, next);
    if (isStorageUnavailable()) setStorageWarning(true);
  };

  const handleAnswer = async (result: 'green' | 'red') => {
    if (!currentCard) return;
    await updateProgress(currentCard.id, result);
    setServedCount((c) => c + 1);
    setLastCardId(currentCard.id);
  };

  const sessionDone = servedCount >= sessionSize;

  const renderCard = () => {
    if (!currentCard) {
      return (
        <div className="empty-state">
          <p>No eligible cards for these filters.</p>
          <button className="secondary-button" onClick={onExit}>
            Back to Home
          </button>
        </div>
      );
    }

    if (sessionDone) {
      return (
        <div className="empty-state">
          <h3>Session complete</h3>
          <p className="meta">Great job. Start another session anytime.</p>
          <button className="primary-button" onClick={onExit}>
            Back to Home
          </button>
        </div>
      );
    }

    return (
      <>
        <p className="meta" style={{ textAlign: 'center' }}>
          If noun: recall article + plural + example. If verb+prep: recall the missing prep and think of an example.
        </p>
        {currentCard.type === 'noun' ? (
          <NounCard card={currentCard} revealed={revealed} />
        ) : (
          <VerbPrepCard card={currentCard} revealed={revealed} />
        )}
        {!revealed ? (
          <button className="primary-button" onClick={handleReveal} style={{ marginTop: 12 }}>
            Reveal
          </button>
        ) : (
          <div className="cta-row">
            <button className="big-action green" onClick={() => handleAnswer('green')}>
              I got it
            </button>
            <button className="big-action red" onClick={() => handleAnswer('red')}>
              I did not remember it
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="card-container grid">
      <div className="top-nav">
        <div>
          <h1 className="app-title">Train</h1>
          <p className="meta">
            {servedCount}/{sessionSize} cards · Filters: {selectedTypes.join(', ')} · {selectedLevels.join(', ')}
          </p>
        </div>
        <div className="flex-row" style={{ justifyContent: 'flex-end' }}>
          <button className="link-button" onClick={onOpenSettings}>
            Settings
          </button>
          <button className="link-button" onClick={onExit}>
            Home
          </button>
        </div>
      </div>

      {storageWarning && (
        <div className="warning">
          Local storage unavailable; progress will not persist between sessions. Training still works.
        </div>
      )}

      {initializing ? <p className="meta">Loading…</p> : renderCard()}
    </div>
  );
}
