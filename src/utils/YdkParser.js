/**
 * @typedef {{id: number, qty: number}} YdkItem
 */

export default class YdkParser {
  #unparsed = "";

  /** @type {YdkItem[]} */
  #parsed = [];

  #appendId = (id) => {
    const currentParsed = this.#parsed.find((item) => item.id === id);
    // if it already exists, increment qty
    if (currentParsed) {
      currentParsed.qty++;
      return;
    }

    // if it does not exist, create entry
    this.#parsed.push({ id, qty: 1 });
  };

  /** @param {string} strFileBatch @returns {YdkParser} */
  parse(strFileBatch) {
    const totalBatch = this.#unparsed.concat(strFileBatch);
    const lines = totalBatch.split("\n").filter(Boolean);

    if (!totalBatch.endsWith("\n")) {
      this.#unparsed = lines.pop();
    }

    lines.forEach((line) => {
      // ignore !side
      if (line.startsWith("!")) {
        return;
      }
      // ignore # comments
      const [content] = line.split("#");
      // ignore empty ids
      if (!content?.length) {
        return;
      }
      this.#appendId(Number(content.trim()));
    });

    return this;
  }

  /** @returns {YdkItem[]} */
  end() {
    if (this.#unparsed.length) {
      this.#appendId(this.#unparsed);
    }
    const result = this.#parsed;

    this.#parsed = [];
    this.#unparsed = "";

    return result;
  }
}
