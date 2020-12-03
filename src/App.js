import { Router } from "@reach/router";
import CollectionManager from "_/components/CollectionManager";
import Importer from "_/components/Importer";
import { CollectionProvider } from "./model/data/collection";

function App() {
  return (
    <div className="App">
      <CollectionProvider>
        <Router>
          <CollectionManager path="/" />
          <Importer path="/import" />
        </Router>
      </CollectionProvider>
    </div>
  );
}

export default App;
