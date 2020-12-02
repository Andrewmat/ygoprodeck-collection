import genericParser from "_/utils/parser/GenericParser";

/**
 * @typedef {{id: number, qty: number}} ydkItem
 * @typedef {import("./GenericParser").GenericParser<ydkItem>} YdkParser
 */

/** @returns {YdkParser} */
const ydkParser = () =>
  genericParser({
    parseLine(line) {
      // ignore !side
      if (line.startsWith("!")) {
        return;
      }
      // ignore # comments
      let [content] = line.split("#");
      content = content.trim();

      // ignore empty ids
      if (!content?.length) {
        return;
      }
      return { id: Number(content), qty: 1 };
    },
    appendParsed(parsedValues, newParsed) {
      if (newParsed == null) {
        return parsedValues;
      }
      const found = parsedValues.find((item) => item.id === newParsed.id);
      if (found) {
        found.qty += newParsed.qty;
        return parsedValues;
      }
      parsedValues.push(newParsed);
      return parsedValues;
    },
  });

export default ydkParser;
