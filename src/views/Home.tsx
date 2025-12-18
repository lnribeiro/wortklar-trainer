import { CardType, Difficulty } from '../types/cards';

interface HomeProps {
  selectedTypes: CardType[];
  selectedLevels: Difficulty[];
  sessionSize: number;
  onUpdateTypes: (types: CardType[]) => void;
  onUpdateLevels: (levels: Difficulty[]) => void;
  onUpdateSessionSize: (size: number) => void;
  onStart: () => void;
  onOpenSettings: () => void;
}

const typeOptions: { value: CardType; label: string }[] = [
  { value: 'noun', label: 'Nouns' },
  { value: 'verb_prep', label: 'Verb + Prep' }
];

const levelOptions: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

const sessionSizes = [10, 20, 40];

export function Home({
  selectedTypes,
  selectedLevels,
  sessionSize,
  onUpdateTypes,
  onUpdateLevels,
  onUpdateSessionSize,
  onStart,
  onOpenSettings
}: HomeProps) {
  const toggleType = (type: CardType) => {
    if (selectedTypes.includes(type)) {
      onUpdateTypes(selectedTypes.filter((t) => t !== type));
    } else {
      onUpdateTypes([...selectedTypes, type]);
    }
  };

  const toggleLevel = (level: Difficulty) => {
    if (selectedLevels.includes(level)) {
      onUpdateLevels(selectedLevels.filter((l) => l !== level));
    } else {
      onUpdateLevels([...selectedLevels, level]);
    }
  };

  const canStart = selectedTypes.length > 0 && selectedLevels.length > 0;

  return (
    <div className="card-container grid">
      <div className="top-nav">
        <div>
          <h1 className="app-title">wortklar</h1>
          <p className="meta">Train nouns and verb + preposition frames. Progress stays in your browser.</p>
        </div>
        <div className="top-actions">
          <a
            className="meta"
            style={{ color: '#2563eb', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            href="https://github.com/lnribeiro/wortklar-trainer"
            target="_blank"
            rel="noreferrer"
          >
            Source on GitHub
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5C5.37.5 0 5.87 0 12.52c0 5.3 3.44 9.79 8.2 11.38.6.12.82-.26.82-.58 0-.28-.01-1.04-.02-2.05-3.34.73-4.04-1.62-4.04-1.62-.55-1.4-1.35-1.78-1.35-1.78-1.1-.75.08-.74.08-.74 1.2.08 1.83 1.24 1.83 1.24 1.08 1.86 2.82 1.32 3.5 1.01.11-.79.42-1.32.76-1.62-2.67-.31-5.48-1.36-5.48-6.06 0-1.34.47-2.45 1.24-3.32-.12-.3-.54-1.56.12-3.25 0 0 1-.33 3.3 1.27.95-.27 1.97-.4 2.98-.41 1.01.01 2.03.14 2.98.41 2.3-1.6 3.3-1.27 3.3-1.27.66 1.69.24 2.95.12 3.25.77.87 1.24 1.98 1.24 3.32 0 4.71-2.82 5.74-5.5 6.04.43.37.81 1.1.81 2.22 0 1.6-.02 2.9-.02 3.29 0 .32.21.7.83.58C20.56 22.3 24 17.81 24 12.52 24 5.87 18.63.5 12 .5Z" />
            </svg>
          </a>
        </div>
      </div>

      <div>
        <p className="section-title">Card types</p>
        <div className="flex-row">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              className={`pill ${selectedTypes.includes(opt.value) ? 'active' : ''}`}
              onClick={() => toggleType(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="section-title">Difficulty</p>
        <div className="flex-row">
          {levelOptions.map((opt) => (
            <button
              key={opt.value}
              className={`pill ${selectedLevels.includes(opt.value) ? 'active' : ''}`}
              onClick={() => toggleLevel(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="section-title">Session size</p>
        <div className="flex-row">
          {sessionSizes.map((size) => (
            <button
              key={size}
              className={`pill ${sessionSize === size ? 'active' : ''}`}
              onClick={() => onUpdateSessionSize(size)}
            >
              {size} cards
            </button>
          ))}
        </div>
      </div>

      <div>
        <button className="primary-button" onClick={onStart} disabled={!canStart} aria-disabled={!canStart}>
          Start training
        </button>
        {!canStart && <p className="meta">Select at least one type and one difficulty.</p>}
        <p className="meta">Your progress is saved in your browser on this device.</p>
        <button className="link-button" onClick={onOpenSettings} style={{ paddingLeft: 0 }}>
          Go to Settings
        </button>
      </div>
    </div>
  );
}
