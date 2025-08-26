import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import * as SecureStore from "expo-secure-store";
import {loginApi, meApi} from "../api/rooms";

type User = { id: string; name: string; role: "admin"|"staff" };
type AuthCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string, simulated?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};
const Ctx = createContext<AuthCtx>({} as any);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({children}:{children:React.ReactNode}) {
  const [user, setUser] = useState<User|null>(null);
  const [token, setToken] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await SecureStore.getItemAsync("token");
      if (t) {
        setToken(t);
        try {
          const u = await meApi(t);
          setUser(u);
        } catch {}
      }
      setLoading(false);
    })();
  }, []);

  const signIn = async (email: string, password: string, simulated = false) => {
    setLoading(true);
    try {
      if (simulated) {
        const fakeUser: User = { id: "1", name: "João", role: "admin" };
        setUser(fakeUser);
        setToken("fake-token");
      } else {
        const {token: tk, user: u} = await loginApi(email, password);
        setToken(tk);
        setUser(u);
        await SecureStore.setItemAsync("token", tk);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync("token");
  };

  const value = useMemo(()=>({user, token, loading, signIn, signOut}), [user, token, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
