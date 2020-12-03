import CollectionViewer from "_/components/CollectionViewer";
import { Link } from "@reach/router";
import { useCollection, useRemove, useSteppers } from "_/model/data/collection";

/**
 * @typedef {'append' | 'remove' | 'increment' | 'decrement'} CollectionActionType
 * @typedef {{type: CollectionActionType, payload: object}} CollectionAction
 * @typedef {import("../model/Card").Card} Card
 * @typedef {import("../model/CardCollectionItem").CardCollectionItem} CardCollectionItem
 */

export default function CollectionManager() {
  const collection = useCollection();
  const remove = useRemove();
  const { increment, decrement } = useSteppers();

  return (
    <>
      <Link to="/import">Import</Link>
      <CollectionViewer
        cards={collection.cards}
        onRemove={remove}
        onIncrement={increment}
        onDecrement={decrement}
      />
    </>
  );
}
