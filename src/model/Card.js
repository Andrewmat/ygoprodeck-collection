import { formatToCardImage } from "./CardImage";
import { formatToCardSet } from "./CardSet";

/**
 * @typedef {import("./CardImage").CardImage} CardImage
 * @typedef {import("./CardSet").CardSet} CardSet
 *
 * @typedef {{
 *   id: number,
 *   name: string,
 *   desc: string,
 *   type: string,
 *   images: CardImage[],
 *   atk: number,
 *   def: number,
 *   level: number,
 *   race: string,
 *   attribute: string,
 *   sets: CardSet[],
 *   prices: any
 * }} Card
 */

/** @returns {Card} */
export function formatToCard(ygoproCardData) {
  const d = ygoproCardData;
  return {
    id: d.id,
    name: d.name,
    desc: d.desc,
    type: d.type,
    images: d.card_images?.map(formatToCardImage),
    atk: d.atk,
    def: d.def,
    level: d.level,
    race: d.race,
    attribute: d.attribute,
    sets: d.card_sets?.map(formatToCardSet),
    prices: d.card_prices,
  };
}
