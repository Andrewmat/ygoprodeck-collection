import { cloneElement, memo } from "react";

/**
 * @typedef {import("../model/CardCollectionItem").CardCollectionItem} CardCollectionItem
 */

/** @param {CardCollectionItem[]} cards */
export function CardsViewer({ cards, actionElement }) {
  return (
    <ul>
      {cards.map(({ id, card, qty }) => (
        <li key={id}>
          <img src={card.images[0]?.srcThumb} alt={card.name} />
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://db.ygoprodeck.com/card/?search=${card.id}`}
          >
            {card.name}
          </a>{" "}
          ({qty})
          {actionElement ? (
            <CardAction card={{ id, card, qty }}>{actionElement}</CardAction>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const CardAction = memo(({ children, card }) => {
  return cloneElement(children, { card });
});
