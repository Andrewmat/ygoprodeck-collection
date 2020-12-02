/**
 * @template P,S
 * @typedef {{
 *   parse: (strFileBatch: string) => GenericParser<P,S>,
 *   end: () => P[]
 * }} GenericParser
 * */
/**
 * @template P,S
 * @param {{
 *   parseLine: (line: string, index?: number, state?: S) => P,
 *   appendParsed: (parsedValues: P[], newParsed: P) => P[]
 * }} param0
 * @returns {GenericParser<P,S>}
 */
export default function genericParser({ parseLine, appendParsed }) {
  let unparsed = "";
  let parsed = [];
  let state = {};

  let self = {
    parse,
    end,
  };

  function parse(strFileBatch) {
    const totalBatch = unparsed.concat(strFileBatch);
    const lines = totalBatch.split("\n");
    if (lines[lines.length - 1].length > 0) {
      unparsed = lines.pop();
    }
    lines.forEach((line, index) => {
      const result = parseLine(line, index, state);
      parsed = appendParsed(parsed, result);
    });
    return self;
  }

  function end() {
    if (unparsed.length) {
      const result = parseLine(unparsed, 0, state);
      parsed = appendParsed(parsed, result);
    }
    const ret = parsed;
    parsed = [];
    unparsed = "";
    return ret;
  }

  return self;
}
