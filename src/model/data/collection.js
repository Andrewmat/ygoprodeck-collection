import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { replace } from "_/utils/arrays";
import { mergeCardCollections } from "../CardCollectionItem";

/**
 * @typedef {'append' | 'remove' | 'increment' | 'decrement'} CollectionActionType
 * @typedef {{type: CollectionActionType, payload: object}} CollectionAction
 * @typedef {import("../Card").Card} Card
 * @typedef {import("../CardCollectionItem").CardCollectionItem} CardCollectionItem
 */

const ctx = createContext(undefined);

export function CollectionProvider({ children }) {
  const [collection, dispatch] = useReducer(collectionReducer, { cards: [] });

  return (
    <ctx.Provider value={{ collection, dispatch }}>{children}</ctx.Provider>
  );
}

export function useCollection() {
  return useCollectionContext().collection;
}

export function useAppend() {
  const { dispatch } = useCollectionContext();
  return useCallback(
    (list) =>
      dispatch({
        type: "append",
        payload: { list },
      }),
    [dispatch]
  );
}

export function useRemove() {
  const { dispatch } = useCollectionContext();
  return useCallback(
    (id) =>
      dispatch({
        type: "remove",
        payload: { id },
      }),
    [dispatch]
  );
}

export function useSteppers() {
  const { dispatch } = useCollectionContext();
  const increment = useCallback(
    (id) =>
      dispatch({
        type: "increment",
        payload: { id },
      }),
    [dispatch]
  );
  const decrement = useCallback(
    (id) =>
      dispatch({
        type: "decrement",
        payload: { id },
      }),
    [dispatch]
  );
  return useMemo(() => ({ increment, decrement }), [increment, decrement]);
}

/**
 * @returns {{
 *   dispatch: (action: CollectionAction) => void,
 *   collection: {cards: CardCollectionItem[]}
 * }}
 * */
function useCollectionContext() {
  const value = useContext(ctx);
  if (value == null) {
    throw Error("useCollection must be used inside CollectionProvider");
  }
  return value;
}

/**
 * @param {{cards: CardCollectionItem[]}} state
 * @param {CollectionAction} action
 * @returns {{cards: CardCollectionItem[]}}
 * */
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
