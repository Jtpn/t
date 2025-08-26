import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RoomsListScreen from "../screens/RoomsListScreen";
import RoomDetailsScreen from "../screens/RoomDetailsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import QRScannerScreen from "../screens/QRScannerScreen";

export type RootStackParamList = {
  Login: undefined;
  RoomsList: undefined;
  RoomDetails: { id: string };
  History: { roomId?: string } | undefined;
  QRScanner: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Router() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen name="RoomsList" component={RoomsListScreen} options={{title:"Salas"}} />
          <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} options={{title:"Detalhes da Sala"}} />
          <Stack.Screen name="History" component={HistoryScreen} options={{title:"Histórico"}} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{title:"Scanner QR"}} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
