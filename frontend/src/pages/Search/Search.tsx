import {
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { useRef, type ChangeEvent } from "react";
import type { User as UserProps } from "@/types";
import FormField from "@/components/FormField";
import UserCard from "@/components/UserCard";
import { searchUsers } from "@/lib/api";
import styles from "./Search.module.css";

function Search() {
  const { users } = useLoaderData<{ users: UserProps[] }>();
  const { handleChange } = useDebounceSearch();
  return (
    <main className={styles.container}>
      <form>
        <FormField
          fieldType="input"
          type="text"
          aria-label="search"
          placeholder="Search..."
          onChange={handleChange}
          pattern="^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$"
        />
      </form>
      <hr />
      {!users.length ? (
        <p className={styles.empty}>No users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <UserCard {...user} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

const useDebounceSearch = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      navigate(`/search?q=${e.target.value}`, {
        viewTransition: true,
        replace: true,
      });
    }, 350);
  };

  return { handleChange } as const;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const res = await searchUsers(query);
  if (!res.ok) throw res;

  return res.json();
};

export default Search;
