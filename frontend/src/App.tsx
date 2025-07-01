import { Outlet } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
}
export default App;
