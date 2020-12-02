/**
 * @type {(submitEvent: React.FormEvent<HTMLFormElement>) => ({} | {[key: string]: FileList | string})}
 * */
export function getFormDataFromEvent(submitEvent) {
  /** @type HTMLInputElement[] */
  const elements = [...submitEvent.target.elements];
  let formData = {};
  for (const element of elements) {
    const name = element.getAttribute("name");
    const type = element.getAttribute("type");
    if (name) {
      /** @type {FileList | string} */
      let value = element.value;
      if (type === "file") {
        value = element.files;
      }
      formData[name] = value;
    }
  }
  return formData;
}
