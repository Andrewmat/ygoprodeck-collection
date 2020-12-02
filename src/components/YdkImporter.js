import { useReducer, useState } from "react";
import { mergeCardCollections } from "_/model/CardCollectionItem";
import CardsViewer from "_/components/CardsViewer";
import CardActions from "_/components/CardActions";
import OfflineService from "_/service/OfflineService";
import YgoService from "_/service/YgoService";
import { getFormDataFromEvent } from "_/utils/form";
import { replace } from "_/utils/arrays";

/**
 * @typedef {'append' | 'remove' | 'clean' | 'increment' | 'decrement'} ImportActionType
 * @typedef {{type: ImportActionType, payload: object}} ImportAction
 * @typedef {import("../model/CardCollectionItem").CardCollectionItem} CardCollectionItem
 * @typedef {import("../model/Form").SubmitEventHandler} SubmitEventHandler
 */

export default function YdkImporter({ onSubmit }) {
  // for form reset
  const [formKey, setFormKey] = useState(Date.now());

  /** @type {[CardCollectionItem[], (action: ImportAction)]} */
  const [cardsItems, dispatch] = useReducer(importReducer, []);

  /** @param {React.FormEvent<HTMLFormElement>} e */
  async function handleFileUpload(e) {
    e.preventDefault();

    /** @type {{ydkFile?: FileList}} */
    const { ydkFile } = getFormDataFromEvent(e);
    cleanForm();
    const ydkImport = await OfflineService.importYdk(ydkFile[0]);
    const cardsData = await YgoService.fetchCardsCollectionData(ydkImport);
    dispatch({
      type: "append",
      payload: { list: cardsData },
    });
  }

  /** @type {SubmitEventHandler} */
  function handleSubmitImport(e) {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(cardsItems);
    }
  }

  /** @type {SubmitEventHandler} */
  function handleClear(e) {
    e.preventDefault();
    dispatch({ type: "clean", payload: {} });
  }

  function handleIncrement(id) {
    dispatch({ type: "increment", payload: { id } });
  }
  function handleDecrement(id) {
    dispatch({ type: "decrement", payload: { id } });
  }
  function handleRemove(id) {
    dispatch({ type: "remove", payload: { id } });
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
            <form onSubmit={handleSubmitImport} onReset={handleClear}>
              <button type="submit">Import</button>
              <button type="reset">Clear</button>
            </form>
          ) : null}
          <CardsViewer cards={cardsItems}>
            <CardsViewer.Child name="action">
              <CardActions
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onRemove={handleRemove}
              />
            </CardsViewer.Child>
          </CardsViewer>
        </>
      ) : null}
    </div>
  );
}

/**
 *
 * @param {CardCollectionItem[]} state  @param {ImportAction} action */
function importReducer(state, action) {
  switch (action.type) {
    case "clean": {
      return [];
    }

    case "increment": {
      const itemIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex < 0) {
        console.warn(`Could not find item with id '${action.payload.id}'.`);
        return state;
      }

      let item = state[itemIndex];
      item = { ...item, qty: item.qty + 1 };

      return replace(state, itemIndex, item);
    }

    case "decrement": {
      const itemIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex < 0) {
        console.warn(`Could not find item with id '${action.payload.id}'.`);
        return state;
      }
      let item = state[itemIndex];
      item = { ...item, qty: item.qty - 1 };

      // remove if zero
      if (item.qty === 0) {
        return importReducer(state, {
          type: "remove",
          payload: action.payload,
        });
      }

      return replace(state, itemIndex, item);
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
