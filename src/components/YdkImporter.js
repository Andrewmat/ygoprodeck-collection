import { useReducer, useState } from "react";
import { mergeCardCollections } from "../model/CardCollectionItem";
import OfflineService from "../service/OfflineService";
import YgoService from "../service/YgoService";
import { getFormDataFromEvent } from "../utils/form";
import { CardsViewer } from "./CardsViewer";

/**
 * @typedef {'append' | 'remove' | 'clean'} ImportActionType
 * @typedef {{type: ImportActionType, payload: object}} ImportAction
 * @typedef {import("../model/CardCollectionItem").CardCollectionItem} CardCollectionItem
 */

export default function YdkImporter({ onSubmit }) {
  const [formKey, setFormKey] = useState(Date.now());

  /** @type {[CardCollectionItem[], (action: ImportAction)]} */
  const [cardsItems, dispatch] = useReducer(importReducer, []);

  /** @param {Event} e */
  async function handleFileUpload(e) {
    e.preventDefault();

    /** @type {{ydkFile: File}} */
    const { ydkFile } = getFormDataFromEvent(e);
    cleanForm();
    const ydkImport = await OfflineService.importYdk(ydkFile[0]);
    const cardsData = await YgoService.fetchCardsCollectionData(ydkImport);
    dispatch({
      type: "append",
      payload: { list: cardsData },
    });
  }

  /** @param {Event} e */
  function handleSubmitImport(e) {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(cardsItems);
    }
  }

  function cleanForm() {
    setFormKey(Date.now());
  }

  return (
    <div className="ydk-importer">
      <form onSubmit={handleFileUpload} key={formKey}>
        <input
          type="file"
          name="ydkFile"
          onChange={(e) => e.target.form.requestSubmit()}
        />
      </form>
      {cardsItems.length ? (
        <>
          {onSubmit ? (
            <form onSubmit={handleSubmitImport}>
              <button type="submit">Import</button>
            </form>
          ) : null}
          <CardsViewer
            cards={cardsItems}
            actionElement={
              <CardAction
                onRemove={(id) => dispatch({ type: "remove", payload: { id } })}
              />
            }
          />
        </>
      ) : null}
    </div>
  );
}

function CardAction({ card, onRemove }) {
  return <button onClick={() => onRemove(card.id)}>X</button>;
}

/**
 *
 * @param {CardCollectionItem[]} state  @param {ImportAction} action */
function importReducer(state, action) {
  switch (action.type) {
    case "clean": {
      return [];
    }
    case "append": {
      return mergeCardCollections(state, action.payload.list);
    }
    case "remove": {
      return state.filter((item) => item.id !== action.payload.id);
    }
    default: {
      throw Error(`Unexpected action type '${action.type}'`);
    }
  }
}
