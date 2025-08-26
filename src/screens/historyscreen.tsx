import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { List } from "react-native-paper";
import { useRoute, RouteProp } from "@react-navigation/native";
import { getHistorico } from "../api/rooms";
import { useAuth } from "../context/AuthContext";

export default function HistoryScreen(){
  const { params } = useRoute<RouteProp<{History:{roomId?:string}}, 'History'>>();
  const { token } = useAuth();
  const [items,setItems] = useState<{id:string; data:string; usuario:string}[]>([]);

  useEffect(()=>{ (async ()=>{
    if (!params?.roomId) return;
    const h = await getHistorico(params.roomId, token ?? undefined);
    setItems(h);
  })() }, [params?.roomId]);

  return (
    <View style={{flex:1}}>
      <FlatList
        data={items}
        keyExtractor={i=>i.id}
        renderItem={({item})=>(
          <List.Item
            title={new Date(item.data).toLocaleString()}
            description={`Responsável: ${item.usuario}`}
            left={props => <List.Icon {...props} icon="check" />}
          />
        )}
      />
    </View>
  );
}
