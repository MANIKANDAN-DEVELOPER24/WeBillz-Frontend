
import useSession from "./hooks/useSession";
import LoginPage from "./pages/Login";
import SalesCounterPage from "./pages/SalesCounterPage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const { user, login, logout } = useSession();

  if (!user) return <LoginPage onLogin={login} />;

  if (user.role === "admin") {
    return <AdminDashboard session={user} onLogout={logout} />;
  }

  return <SalesCounterPage session={user} onLogout={logout} />;
}
