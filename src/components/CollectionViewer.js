import { useMemo, useState } from "react";
import { getFormDataFromEvent } from "../utils/form";
import CardActions from "./CardActions";
import CardsViewer from "./CardsViewer";

/**
 * @typedef {import('../model/CardCollectionItem').CardCollectionItem} CardCollectionItem
 */

/** @param {{cards: CardCollectionItem[], onRemove?: function}} */
export default function CollectionViewer({
  cards,
  onRemove,
  onIncrement,
  onDecrement,
}) {
  const [term, setTerm] = useState("");

  const termTokens = useMemo(
    () =>
      term
        .split(" ")
        .filter(Boolean)
        .map((t) => t.toLowerCase()),
    [term]
  );

  const filteredCards = useMemo(() => {
    if (!termTokens.length) {
      return cards;
    }
    return cards.filter((card) =>
      termTokens.some((token) => card.card.name.toLowerCase().includes(token))
    );
  }, [cards, termTokens]);

  function handleRemove(id) {
    const input = window.confirm("Are you sure?");
    if (input) {
      onRemove(id);
    }
  }

  /** @param {Event} e */
  function handleTermSearch(e) {
    e.preventDefault();
    const { searchTerm } = getFormDataFromEvent(e);
    setTerm(searchTerm);
  }

  return (
    <>
      <form onSubmit={handleTermSearch}>
        <label>
          Search:
          <input type="text" name="searchTerm" />
        </label>
      </form>
      <CardsViewer cards={filteredCards}>
        <CardsViewer.Child name="action">
          <CardActions
            onRemove={handleRemove}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        </CardsViewer.Child>
      </CardsViewer>
    </>
  );
}
