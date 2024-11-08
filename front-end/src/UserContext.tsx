import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect,
} from "react";
import { useCookies } from "react-cookie";
interface User {
  name: string;
  email: string;
  // Add other user properties here
}

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => null, // No-op function with the correct type
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cookies] = useCookies(["token"]);
  useEffect(() => {
    if (cookies.token) {
      fetch("/api/user/info", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else if (data.error) {
            console.log(data.error);
          }
        });
    }
  }, [cookies.token]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
