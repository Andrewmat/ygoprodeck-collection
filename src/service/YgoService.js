import { formatToCard } from "_/model/Card";
import { formatCardCollectionItem } from "_/model/CardCollectionItem";

/**
 * @typedef {import("../model/Card").Card} Card
 * @typedef {import("../model/CardCollectionItem").CardCollectionItem} CardCollectionItem
 * @typedef {import("../utils/parser/ydkParser").ydkItem} YdkItem
 */

export default class YgoService {
  /**
   * @param {number[]} listIds
   * @returns {Promise<Card[]>}
   * */
  static async fetchCardsByIds(listIds) {
    const distinctListIds = [...new Set(listIds)]
      .map((v) => String(v))
      .join(",");

    const endpointUrl = new URL(
      "https://db.ygoprodeck.com/api/v7/cardinfo.php"
    );
    endpointUrl.searchParams.set("id", distinctListIds);
    const response = await fetch(String(endpointUrl));
    if (!response.ok) {
      throw Error(
        `[YgoproService.getCardsByIds] (${response.status}) ${response.statusText}`
      );
    }

    const json = await response.json();
    return json.data?.map(formatToCard);
  }

  /** @param {YdkItem[]} ydkParsedItems @returns {Promise<CardCollectionItem[]>} */
  static async fetchCardsCollectionData(ydkParsedItems) {
    const cardsData = await YgoService.fetchCardsByIds(
      ydkParsedItems.map((r) => r.id)
    );

    return cardsData.map((cardData) =>
      formatCardCollectionItem(
        cardData,
        ydkParsedItems.find((item) => cardData.id === item.id)?.qty
      )
    );
  }
}
