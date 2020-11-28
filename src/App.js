import { useState } from "react";
import OfflineService from "./service/OfflineService";
import { YgoproService } from "./service/YgoproService";
import { collectFormDataFromEvent } from "./utils/form";

/**
 * @typedef {import("./model/Card").Card} Card
 */

function App() {
  const [formKey, setFormKey] = useState(Date.now());
  /** @type {[Card[], function]} */
  const [cards, setCards] = useState([]);

  /** @param {Event} e */
  async function handleSubmit(e) {
    e.preventDefault();

    /** @type {{ydkFile: File}} */
    const { ydkFile } = collectFormDataFromEvent(e);
    cleanForm();
    const ids = await OfflineService.importYdk(ydkFile[0]);
    const cardsData = await YgoproService.getCardsByIds(ids);
    setCards(cardsData);
  }

  function cleanForm() {
    setFormKey(Date.now());
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit} key={formKey}>
        <input
          type="file"
          name="ydkFile"
          onChange={(e) => e.target.form.requestSubmit()}
        />
      </form>
      {cards.length ? (
        <ul>
          {cards.map((card) => (
            <li key={card.id}>
              <img src={card.images[0]?.srcThumb} alt={card.name} />
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://db.ygoprodeck.com/card/?search=${card.id}`}
              >
                {card.name}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default App;
