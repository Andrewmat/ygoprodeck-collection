import YdkParser from "../utils/YdkParser";

export default class OfflineService {
  /**
   * @param {File} file
   * @param {function} progressCallback
   */
  static async importYdk(file, progressCallback) {
    const parser = new YdkParser();
    const reader = new FileReader();
    /** @type {ProgressEvent} */
    const progressEvent = await new Promise((resolve, reject) => {
      reader.addEventListener("loadend", resolve);
      reader.addEventListener("abort", reject);
      reader.addEventListener("error", reject);
      if (progressCallback) {
        reader.addEventListener("progress", progressCallback);
      }

      reader.readAsText(file, "UTF-8");
    });

    return parser.parse(progressEvent.target.result).end();
  }
}
