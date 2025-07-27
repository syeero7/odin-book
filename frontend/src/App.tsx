import { Outlet, useNavigation } from "react-router-dom";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Fallback from "@/components/Fallback";

function App() {
  const navigation = useNavigation();

  return (
    <AuthProvider>
      {navigation.state !== "idle" && <Fallback />}
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
}
export default App;
