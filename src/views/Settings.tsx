import { useEffect, useMemo, useState } from 'react';
import { bulkGetProgress } from '../lib/db';
import { Card } from '../types/cards';

interface SettingsProps {
  onBack: () => void;
  onReset: () => Promise<void>;
  resetInProgress: boolean;
  cards: Card[];
}

interface Stats {
  totalSeen: number;
  totalGreen: number;
  totalRed: number;
}

export function Settings({ onBack, onReset, resetInProgress, cards }: SettingsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [hardCards, setHardCards] = useState<
    Array<{ id: string; ratio: number; total: number; label: string }>
  >([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const ids = cards.map((c) => c.id);
      const progress = await bulkGetProgress(ids);
      if (!mounted) return;
      const summary = Object.values(progress).reduce<Stats>(
        (acc, record) => {
          const total = (record.g ?? 0) + (record.r ?? 0);
          if (total > 0) {
            acc.totalSeen += 1;
            acc.totalGreen += record.g ?? 0;
            acc.totalRed += record.r ?? 0;
          }
          return acc;
        },
        { totalSeen: 0, totalGreen: 0, totalRed: 0 }
      );

      const withRatios = Object.entries(progress)
        .map(([id, rec]) => {
          const total = (rec.g ?? 0) + (rec.r ?? 0);
          const ratio = (rec.r + 1) / (rec.g + 1);
          const card = cards.find((c) => c.id === id);
          const label =
            card?.type === 'noun'
              ? `${card.reveal.articleNom} ${card.front.lemma}`
              : card?.front.pattern ?? id;
          return { id, ratio, total, label };
        })
        .filter((item) => item.total > 0)
        .sort((a, b) => b.ratio - a.ratio || b.total - a.total)
        .slice(0, 5);

      setStats(summary);
      setHardCards(withRatios);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [cards]);

  const handleReset = async () => {
    const confirmed = window.confirm('Reset all progress on this device? This cannot be undone.');
    if (confirmed) {
      await onReset();
      setStats({ totalSeen: 0, totalGreen: 0, totalRed: 0 });
      setHardCards([]);
    }
  };

  const statLine = useMemo(() => {
    if (!stats) return 'No progress yet.';
    return `${stats.totalSeen} cards with progress · ✅ ${stats.totalGreen} · ❌ ${stats.totalRed}`;
  }, [stats]);

  return (
    <div className="card-container grid">
      <div className="top-nav">
        <h1 className="app-title">Settings</h1>
        <button className="link-button" onClick={onBack}>
          Back
        </button>
      </div>
      <div>
        <p className="section-title">Your stats</p>
        <p className="meta">{loading ? 'Loading…' : statLine}</p>
        <div className="examples" style={{ marginTop: 8 }}>
          <p className="meta" style={{ marginBottom: 8 }}>
            Hard words (highest red/green ratio):
          </p>
          {hardCards.length === 0 && <p className="meta">No hard words yet.</p>}
          {hardCards.map((item) => (
            <p key={item.id} style={{ margin: '4px 0' }}>
              <strong>{item.label}</strong> — r/g={(item.ratio).toFixed(2)} (seen {item.total})
            </p>
          ))}
        </div>
      </div>
      <div>
        <p className="section-title">Reset progress on this device</p>
        <p className="meta">Clears all saved results in IndexedDB. Cards behave like new.</p>
        <button className="secondary-button" onClick={handleReset} disabled={resetInProgress}>
          {resetInProgress ? 'Resetting…' : 'Reset progress'}
        </button>
      </div>
    </div>
  );
}
