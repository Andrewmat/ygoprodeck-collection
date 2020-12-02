/**
 * A function that replaces one item inside an array without mutation
 * @param {any[]} array
 * @param {number} itemIndex
 * @param {any} value
 */
export function replace(array, itemIndex, value) {
  if (itemIndex < 0) {
    throw Error(`Index '${itemIndex}' is not expected`);
  }
  let beforeItem = array.slice(0, itemIndex);
  let afterItem = array.slice(itemIndex + 1);

  return [...beforeItem, value, ...afterItem];
}
