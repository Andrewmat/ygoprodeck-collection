/**
 * @typedef {{
 *   id: number,
 *   src: string,
 *   srcThumb: string,
 * }} CardImage
 * */

/** @returns {CardImage} */
export function formatToCardImage(ygoproCardImageData) {
  const d = ygoproCardImageData;
  return {
    id: d.id,
    src: d.image_url,
    srcThumb: d.image_url_small,
  };
}
