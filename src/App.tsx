import { useMemo, useState } from 'react';
import cardsData from './content/cards.json';
import { Card, CardType, Difficulty } from './types/cards';
import { Home } from './views/Home';
import { Train } from './views/Train';
import { Settings } from './views/Settings';
import { resetAllProgress } from './lib/db';

type View = 'home' | 'train' | 'settings';

const cards = cardsData as Card[];

export default function App() {
  const [view, setView] = useState<View>('home');
  const [returnView, setReturnView] = useState<View>('home');
  const [selectedTypes, setSelectedTypes] = useState<CardType[]>(['noun', 'verb_prep']);
  const [selectedLevels, setSelectedLevels] = useState<Difficulty[]>(['easy', 'medium', 'hard']);
  const [sessionSize, setSessionSize] = useState(10);
  const [sessionKey, setSessionKey] = useState(0);
  const [resetting, setResetting] = useState(false);

  const sortedCards = useMemo(() => cards.slice(), []);

  const startTraining = () => {
    setSessionKey((k) => k + 1);
    setView('train');
  };

  const openSettings = () => {
    setReturnView(view);
    setView('settings');
  };

  const handleReset = async () => {
    setResetting(true);
    await resetAllProgress();
    setResetting(false);
  };

  return (
    <div className="app-shell">
      {view === 'home' && (
        <Home
          selectedTypes={selectedTypes}
          selectedLevels={selectedLevels}
          sessionSize={sessionSize}
          onUpdateTypes={setSelectedTypes}
          onUpdateLevels={setSelectedLevels}
          onUpdateSessionSize={setSessionSize}
          onStart={startTraining}
          onOpenSettings={openSettings}
        />
      )}
      {view === 'train' && (
        <Train
          key={sessionKey}
          cards={sortedCards}
          selectedTypes={selectedTypes}
          selectedLevels={selectedLevels}
          sessionSize={sessionSize}
          onExit={() => setView('home')}
          onOpenSettings={openSettings}
        />
      )}
      {view === 'settings' && (
        <Settings
          onBack={() => setView(returnView)}
          onReset={handleReset}
          resetInProgress={resetting}
          cards={sortedCards}
        />
      )}
    </div>
  );
}
