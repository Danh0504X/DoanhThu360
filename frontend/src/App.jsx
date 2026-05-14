import { AppRoutes } from './routes/AppRoutes.jsx';
import { useAuthBootstrap } from './hooks/useAuthBootstrap.js';

function App() {
  useAuthBootstrap();
  return <AppRoutes />;
}

export default App;
