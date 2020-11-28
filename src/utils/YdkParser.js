/**
 * @typedef {{id: number, qty: number}} YdkItem
 */

export default class YdkParser {
  #unparsed = "";
  #parsed = [];

  /** @param {string} strFileBatch @returns {YdkParser} */
  parse(strFileBatch) {
    const lines = this.#unparsed.concat(strFileBatch).split("\n");

    lines.forEach((line) => {
      // ignore !side
      if (line.startsWith("!")) {
        return;
      }
      const [content] = line.split("#");
      if (!content?.length) {
        return;
      }
      const id = content.trim();
      this.#parsed.push(id);
    });

    if (!strFileBatch.endsWith("\n")) {
      this.#unparsed = this.#parsed.pop();
    }
    return this;
  }

  /** @returns {YdkItem[]} */
  end() {
    const result = this.#parsed;
    if (this.#unparsed.length) {
      result.push(this.#unparsed);
    }

    this.#parsed = [];
    this.#unparsed = "";

    return result.map((item) => ({
      id: item,
      qty: 1,
    }));
  }
}
