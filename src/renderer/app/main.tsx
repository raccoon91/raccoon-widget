import ReactDOM from "react-dom/client";

import { App } from "@app/App";
import { Provider } from "@app/components/ui/provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider>
    <App />
  </Provider>,
);
