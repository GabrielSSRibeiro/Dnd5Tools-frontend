import { AuthProvider } from "./contexts/Auth";
import Routes from "./routes";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
