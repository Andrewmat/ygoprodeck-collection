import { cloneElement } from "react";
import { Child, useChildren } from "_/components/NamedChildren";

/**
 * @typedef {import("../model/CardCollectionItem").CardCollectionItem} CardCollectionItem
 */

/** @param {{cards: CardCollectionItem[], children: React.ReactChild}} */
export default function CardsViewer({ cards, children }) {
  const { action: actionElement } = useChildren(children);
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
          {actionElement &&
            cloneElement(actionElement, { card: { id, card, qty } })}
        </li>
      ))}
    </ul>
  );
}

/** @type {React.ComponentType<{name: 'action'}>} */
CardsViewer.Child = Child;
