import { useReducer, useState } from "react";
import YdkImporter from "./YdkImporter";
import CollectionViewer from "./CollectionViewer";
import { mergeCardCollections } from "../model/CardCollectionItem";

/**
 * @typedef {'append' | 'remove'} CollectionActionType
 * @typedef {{type: CollectionActionType, payload: object}} CollectionAction
 * @typedef {import("../model/Card").Card} Card
 * @typedef {import("../model/CardCollectionItem").CardCollectionItem} CardCollectionItem
 */

export default function CollectionManager() {
  const [collection, dispatch] = useReducer(collectionReducer, { cards: [] });
  const [showImport, setShowImport] = useState(false);

  function handleImport(newCards) {
    dispatch({ type: "append", payload: { list: newCards } });
    setShowImport(false);
  }

  return (
    <div>
      <button type="button" onClick={() => setShowImport((v) => !v)}>
        {showImport ? "Go back to Collection" : "Import YDK"}
      </button>
      {showImport ? (
        <YdkImporter onSubmit={handleImport} />
      ) : (
        <CollectionViewer
          cards={collection.cards}
          onRemove={(id) => dispatch({ type: "remove", payload: { id } })}
        />
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
    default: {
      throw Error(`Unexpected action type ${action.type}`);
    }
  }
}
