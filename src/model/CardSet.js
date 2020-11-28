/**
 * @typedef {{
 *   code: string,
 *   name: string,
 *   price: string,
 *   rarity: string,
 *   rarityCode: string,
 * }} CardSet
 * */

/** @returns {CardSet} */
export function formatToCardSet(ygoproCardSetData) {
  const d = ygoproCardSetData;
  return {
    code: d.set_code,
    name: d.set_name,
    price: d.set_price,
    rarity: d.set_rarity,
    rarityCode: d.set_rarity_code,
  };
}
