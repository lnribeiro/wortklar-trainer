import { NounCard as NounCardType } from '../../types/cards';

interface Props {
  card: NounCardType;
  revealed: boolean;
}

export function NounCard({ card, revealed }: Props) {
  const { lemma } = card.front;
  const { articleNom, plural, examples } = card.reveal;

  return (
    <div className="card-face">
      {!revealed ? (
        <>
          <h2>{lemma}</h2>
          <span className="meta">Noun · {card.level}</span>
        </>
      ) : (
        <>
          <div>
            <div className="badge">
              <span>{articleNom}</span>
              <strong>{lemma}</strong>
            </div>
            <p className="meta">Plural: {plural}</p>
          </div>
          <div className="examples">
            {examples.map((ex, idx) => (
              <p key={idx}>{ex.de}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
