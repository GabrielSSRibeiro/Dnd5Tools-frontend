import { ContextProvider } from "./contexts/myContext";
import Routes from "./routes";

import "./styles/global.css";

function App() {
  return (
    <ContextProvider>
      <Routes />
    </ContextProvider>
  );
}

export default App;
