import genericParser from "./GenericParser";

/**
 * @typedef {{id: number, qty: number }} csvItem
 * @typedef {{keys: {indexId: number, indexQty: number}}} csvParserState
 * @typedef {import("./GenericParser").GenericParser<csvItem, csvParserState>} CsvParser
 * */

/** @returns {CsvParser} */
const csvParser = () =>
  genericParser({
    parseLine(line, _, state) {
      if (!state.keys) {
        const keys = line.split(",");
        const indexId = keys.findIndex((k) => k === "Id");
        const indexQty = keys.findIndex((k) => k === "Quantity");
        state.keys = { indexId, indexQty };
        return;
      }

      const { indexId, indexQty } = state.keys;

      const values = line.split(",");
      return {
        id: Number(values[indexId]),
        qty: Number(values[indexQty]),
      };
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

export default csvParser;
