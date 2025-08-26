import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { ActivityIndicator, FAB, Searchbar } from "react-native-paper";
import SalaCard from "../components/SalaCard";
import { getSalas, Sala, marcarComoLimpa } from "../api/rooms";
import { useAuth } from "../context/AuthContext";
import FiltersBar from "../components/FiltersBar";
import { saveRooms, loadRooms } from "../data/db";
import { schedulePendingNotifications } from "../utils/notify";
import { useNavigation } from "@react-navigation/native";

const MOCK: Sala[] = [
  {id:"1", nome:"Laboratório 101", campus:"Campus A", bloco:"B1", status:"pendente"},
  {id:"2", nome:"Sala 202", campus:"Campus B", bloco:"B2", status:"limpa", ultimaLimpeza:new Date().toISOString()},
];

export default function RoomsListScreen(){
  const { user, token } = useAuth();
  const nav = useNavigation<any>();
  const [query,setQuery] = useState("");
  const [status,setStatus] = useState<"todos"|"pendente"|"limpa">("todos");
  const [campus,setCampus] = useState<string|"todos">("todos");
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);
  const [salas,setSalas] = useState<Sala[]>([]);

  async function load() {
    setLoading(true);
    try {
      const local = await loadRooms();
      if (local.length) setSalas(local);
      const apiData = token ? await getSalas(token) : MOCK;
      setSalas(apiData);
      await saveRooms(apiData);
      await schedulePendingNotifications(apiData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, []);

  const filtered = useMemo(()=> salas.filter(s => {
    const byQ = s.nome.toLowerCase().includes(query.toLowerCase());
    const byS = status==="todos" ? true : s.status===status;
    const byC = campus==="todos" ? true : s.campus===campus;
    return byQ && byS && byC;
  }), [salas, query, status, campus]);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (loading) return <View style={{flex:1,justifyContent:"center"}}><ActivityIndicator/></View>;

  const isAdmin = user?.role === "admin";

  return (
    <View style={{flex:1, padding:12}}>
      <Searchbar value={query} onChangeText={setQuery} placeholder="Buscar sala..." />
      <FiltersBar status={status} setStatus={setStatus} campus={campus} setCampus={setCampus}/>
      <FlatList
        data={filtered}
        keyExtractor={i=>i.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        renderItem={({item})=>(
          <SalaCard
            sala={item}
            onPress={()=>nav.navigate("RoomDetails", {id:item.id})}
            isAdmin={isAdmin}
            onMarkClean={async ()=>{
              await marcarComoLimpa(item.id, token ?? undefined);
              await load();
            }}
          />
        )}
      />
      {isAdmin && (
        <FAB icon="qrcode" style={{position:"absolute", right:16, bottom:16}} onPress={()=>nav.navigate("QRScanner")} />
      )}
    </View>
  );
}
