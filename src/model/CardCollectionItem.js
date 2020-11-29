/**
 * @typedef {import("./Card").Card} Card
 * @typedef {{
 *   id: number,
 *   qty: number,
 *   card: Card,
 * }} CardCollectionItem
 */

/** @param {Card} card @returns {CardCollectionItem} */
export function formatCardCollectionItem(card, qty) {
  return {
    id: card.id,
    qty: qty,
    card,
  };
}

/** @param {CardCollectionItem[]} cardCollection1 @param {CardCollectionItem[]} cardCollection2 @returns {CardCollectionItem[]} */
export function mergeCardCollections(cardCollection1, cardCollection2) {
  let coll1 = cardCollection1.concat();
  let coll2 = cardCollection2.concat();
  let collFinal = [];
  coll1.forEach((cardItem1) => {
    let cardItem = cardItem1;
    const cardItem2Index = coll2.findIndex((cardItem2) => {
      return cardItem1.id === cardItem2.id;
    });

    if (cardItem2Index != null) {
      const cardItem2 = coll2[cardItem2Index];
      cardItem = {
        ...cardItem1,
        qty: cardItem1.qty + cardItem2.qty,
      };
      coll2.splice(cardItem2Index, 1);
    }
    collFinal.push(cardItem);
  });

  collFinal = collFinal.concat(coll2);
  return collFinal;
}
