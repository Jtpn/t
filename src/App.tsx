import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Router from "./navigation/Router";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <Router/>
      </PaperProvider>
    </AuthProvider>
  );
}
