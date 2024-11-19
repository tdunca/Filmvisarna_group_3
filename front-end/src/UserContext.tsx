import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { useCookies } from "react-cookie";

interface User {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
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
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  useEffect(() => {
    console.log("Cookies:", cookies); // Debugging: Log cookies to check their values
    if (cookies.token) {
      fetch("/api/user/info", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            console.log("User data:", data.user); // Debugging: Log user data
          } else if (data.error) {
            console.log("Error:", data.error); // Debugging: Log error
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error); // Debugging: Log fetch error
        });
    } else {
      setUser(null); // Clear user state if token is removed
    }
  }, [cookies.token]);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
