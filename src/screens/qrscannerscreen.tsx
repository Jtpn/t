import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function QRScannerScreen(){
  const [hasPermission, setHasPermission] = useState<boolean|null>(null);
  const nav = useNavigation<any>();

  useEffect(()=>{ (async ()=>{
    const {status} = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status==="granted");
  })(); }, []);

  if (hasPermission===null) return <Text>Solicitando permissão…</Text>;
  if (hasPermission===false) return <Text>Sem permissão de câmera.</Text>;

  return (
    <View style={{flex:1}}>
      <BarCodeScanner
        style={{flex:1}}
        onBarCodeScanned={({data})=>{
          nav.replace("RoomDetails", { id: String(data) });
        }}
      />
    </View>
  );
}
