import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import { getSala, marcarComoLimpa, Sala } from "../api/rooms";
import { useAuth } from "../context/AuthContext";
import { saveRooms } from "../data/db";

export default function RoomDetailsScreen() {
  const { params } = useRoute<RouteProp<{RoomDetails:{id:string}}, 'RoomDetails'>>();
  const { token, user } = useAuth();
  const [sala,setSala] = useState<Sala|null>(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{ (async ()=>{
    const data = await getSala(params.id, token ?? undefined);
    setSala(data); setLoading(false);
  })(); }, [params.id]);

  const markClean = async () => {
    await marcarComoLimpa(params.id, token ?? undefined);
    const updated = await getSala(params.id, token ?? undefined);
    setSala(updated);
    await saveRooms([updated]);
  };

  if (loading || !sala) return null;

  return (
    <View style={{padding:12}}>
      <Card>
        <Card.Title title={sala.nome} subtitle={`${sala.campus} • ${sala.bloco}`} />
        <Card.Content>
          <Text>Status: {sala.status}</Text>
          {sala.ultimaLimpeza && <Text>Última limpeza: {new Date(sala.ultimaLimpeza).toLocaleString()}</Text>}
        </Card.Content>
        {user?.role==="admin" && sala.status==="pendente" && (
          <Card.Actions>
            <Button mode="contained" onPress={markClean}>Marcar como Limpa</Button>
          </Card.Actions>
        )}
      </Card>
      <Button style={{marginTop:12}} onPress={()=> (window as any).navigation?.navigate?.("History", {roomId:sala.id})}>
        Ver histórico de limpezas
      </Button>
    </View>
  );
}
