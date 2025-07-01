import { NavLink } from "react-router-dom";
import {
  CircleUser,
  Bell,
  House,
  Search,
  SquarePen,
  LogOut,
} from "lucide-react";
import styles from "./Navbar.module.css";
import { useAuth } from "../AuthProvider";

function Navbar() {
  const { user, logout } = useAuth();

  //   if (!user) return null;

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <NavLink to={"/"} viewTransition title="home">
            <House />
          </NavLink>
        </li>

        <li>
          <NavLink to={"/search"} viewTransition title="search">
            <Search />
          </NavLink>
        </li>

        <li>
          <NavLink to={"/new"} viewTransition title="new post">
            <SquarePen />
          </NavLink>
        </li>

        <li>
          <NavLink to={"/notifications"} viewTransition title="notifications">
            <Bell />
          </NavLink>
        </li>

        <li>
          <NavLink to={"/profile"} viewTransition title="profile">
            <CircleUser />
          </NavLink>
        </li>

        <li>
          <button aria-label="logout" title="logout" onClick={logout}>
            <LogOut />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
