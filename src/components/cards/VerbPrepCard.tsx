import { VerbPrepCard as VerbPrepCardType } from '../../types/cards';

interface Props {
  card: VerbPrepCardType;
  revealed: boolean;
}

export function VerbPrepCard({ card, revealed }: Props) {
  const { pattern } = card.front;
  const reveal = card.reveal;

  return (
    <div className="card-face">
      {!revealed ? (
        <>
          <h2>{pattern}</h2>
          <span className="meta">Verb + Prep · {card.level}</span>
        </>
      ) : (
        <>
          <div>
            <div className="badge">
              <span>{reveal.pattern}</span>
            </div>
          </div>
          <div className="examples">
            {reveal.examples.map((ex, idx) => (
              <p key={idx}>{ex.de}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
