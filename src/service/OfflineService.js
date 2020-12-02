import csvParser from "_/utils/parser/CsvParser";
import ydkParser from "_/utils/parser/ydkParser";

/**
 * @typedef {import("../model/CardCollectionItem").CardCollectionItem} CardCollectionItem
 */

export default class OfflineService {
  /** @param {File} file @param {EventListenerObject=} progressCallback */
  static async importYdk(file, progressCallback) {
    const parser = ydkParser();
    const reader = new FileReader();
    /** @type {ProgressEvent} */
    const progressEvent = await new Promise((resolve, reject) => {
      reader.addEventListener("loadend", resolve);
      reader.addEventListener("abort", reject);
      reader.addEventListener("error", reject);
      if (progressCallback != null) {
        reader.addEventListener("progress", progressCallback);
      }

      reader.readAsText(file, "UTF-8");
    });

    return parser.parse(progressEvent.target.result).end();
  }

  /** @param {File} file @param {EventListenerObject=} progressCallback */
  static async importCsv(file, progressCallback) {
    const parser = csvParser();
    const reader = new FileReader();
    /** @type {ProgressEvent} */
    const progressEvent = await new Promise((resolve, reject) => {
      reader.addEventListener("loadend", resolve);
      reader.addEventListener("abort", reject);
      reader.addEventListener("error", reject);
      if (progressCallback != null) {
        reader.addEventListener("progress", progressCallback);
      }

      reader.readAsText(file, "UTF-8");
    });

    return parser.parse(progressEvent.target.result).end();
  }

  /** @param {CardCollectionItem[]} items */
  static async exportCsv(items) {
    const header = ["Name", "Quantity", "Id", "Link"].join(",");
    const values = items.map((item) =>
      [
        item.card.name,
        item.qty,
        item.card.id,
        `https://db.ygoprodeck.com/card/?search=${item.card.id}`,
      ].join(",")
    );
    const csvContent = [header, ...values].join("\n");

    // download
    const blob = new Blob([csvContent], { type: "text/csv" });

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, "ygo-collection.csv");
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "ygo-collection.csv";
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }
}
