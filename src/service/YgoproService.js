import { formatToCard } from "../model/Card";

/**
 * @typedef {import("../model/Card").Card} Card
 */

export class YgoproService {
  /**
   * @param {string[]} listIds
   * @returns {Promise<Card[]>}
   * */
  static async getCardsByIds(listIds) {
    const distinctListIds = [...new Set(listIds)];
    const endpointUrl = new URL(
      "https://db.ygoprodeck.com/api/v7/cardinfo.php"
    );
    endpointUrl.searchParams.set("id", distinctListIds);
    const response = await fetch(endpointUrl);
    if (!response.ok) {
      throw Error(
        `[YgoproService.getCardsByIds] (${response.status}) ${response.statusText}`
      );
    }

    const json = await response.json();
    return json.data?.map(formatToCard);
  }
}
