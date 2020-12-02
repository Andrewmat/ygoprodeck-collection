/**
 * @typedef {import('../model/CardCollectionItem').CardCollectionItem} CardCollectionItem
 */

/**
 * @param {{
 *   card?: CardCollectionItem,
 *   onIncrement?: (id: number) => void,
 *   onDecrement?: (id: number) => void,
 *   onRemove?: (id: number) => void,
 * }} param0
 * */
export default function CardActions({
  card,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  if (card == null) {
    return null;
  }
  return (
    <>
      {onDecrement && (
        <button onClick={() => onDecrement(card.id)} aria-label="Decrement">
          -
        </button>
      )}
      ({card.qty})
      {onIncrement && (
        <button onClick={() => onIncrement(card.id)} aria-label="Increment">
          +
        </button>
      )}
      {onRemove && (
        <button
          style={{ backgroundColor: "#c33" }}
          onClick={() => onRemove(card.id)}
          aria-label="Remove"
        >
          X
        </button>
      )}
    </>
  );
}
