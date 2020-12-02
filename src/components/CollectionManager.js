import { useReducer, useState } from "react";
import Importer from "_/components/Importer";
import CollectionViewer from "_/components/CollectionViewer";
import { mergeCardCollections } from "_/model/CardCollectionItem";
import { replace } from "_/utils/arrays";

/**
 * @typedef {'append' | 'remove' | 'increment' | 'decrement'} CollectionActionType
 * @typedef {{type: CollectionActionType, payload: object}} CollectionAction
 * @typedef {import("../model/Card").Card} Card
 * @typedef {import("../model/CardCollectionItem").CardCollectionItem} CardCollectionItem
 */

export default function CollectionManager() {
  const [showImport, setShowImport] = useState(false);
  const [collection, dispatch] = useReducer(collectionReducer, { cards: [] });

  /** @param {CardCollectionItem[]} newCards */
  function handleImport(newCards) {
    dispatch({ type: "append", payload: { list: newCards } });
    setShowImport(false);
  }

  return (
    <div>
      <button type="button" onClick={() => setShowImport((v) => !v)}>
        {showImport ? "Go back to Collection" : "Import"}
      </button>
      {showImport ? (
        <Importer onSubmit={handleImport} />
      ) : (
        <>
          <CollectionViewer
            cards={collection.cards}
            onRemove={(id) => dispatch({ type: "remove", payload: { id } })}
            onIncrement={(id) =>
              dispatch({ type: "increment", payload: { id } })
            }
            onDecrement={(id) =>
              dispatch({ type: "decrement", payload: { id } })
            }
          />
        </>
      )}
    </div>
  );
}

/** @param {{cards: CardCollectionItem[]}} state @param {CollectionAction} action */
function collectionReducer(state, action) {
  switch (action.type) {
    case "append": {
      const newState = {
        ...state,
        cards: mergeCardCollections(state.cards, action.payload.list),
      };
      return newState;
    }
    case "remove": {
      return {
        ...state,
        cards: state.cards.filter((item) => item.id !== action.payload.id),
      };
    }
    case "increment": {
      const index = state.cards.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index < 0) {
        console.warn(`Could not find item with id '${action.payload.id}'.`);
        return state;
      }
      let item = state.cards[index];
      item = { ...item, qty: item.qty + 1 };
      return {
        ...state,
        cards: replace(state.cards, index, item),
      };
    }
    case "decrement": {
      const index = state.cards.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index < 0) {
        console.warn(`Could not find item with id '${action.payload.id}'.`);
        return state;
      }
      let item = state.cards[index];
      item = { ...item, qty: item.qty === 0 ? item.qty : item.qty - 1 };
      return {
        ...state,
        cards: replace(state.cards, index, item),
      };
    }

    default: {
      throw Error(`Unexpected action type ${action.type}`);
    }
  }
}
