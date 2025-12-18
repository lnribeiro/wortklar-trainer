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
      <div>
        <h1 className="app-title">wortklar</h1>
        <p className="meta">Train nouns and verb + preposition frames. Progress stays in your browser.</p>
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
