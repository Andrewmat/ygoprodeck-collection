/**
 * @param {Event} submitEvent
 */
export function collectFormDataFromEvent(submitEvent) {
  /** @type HTMLElement[] */
  const elements = [...submitEvent.target.elements];
  let formData = {};
  for (const element of elements) {
    const name = element.getAttribute("name");
    const type = element.getAttribute("type");
    if (name) {
      let value = element.value;
      if (type === "file") {
        value = element.files;
      }
      formData[name] = value;
    }
  }
  return formData;
}
