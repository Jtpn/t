import React from "react";
import { View } from "react-native";
import { Chip } from "react-native-paper";

type Props = {
  status: "todos"|"pendente"|"limpa";
  setStatus: (s: Props["status"]) => void;
  campus: string | "todos";
  setCampus: (c: string | "todos") => void;
};
export default function FiltersBar({status,setStatus,campus,setCampus}:Props){
  return (
    <View style={{flexDirection:"row", flexWrap:"wrap", gap:8, marginBottom:8}}>
      <Chip selected={status==="todos"} onPress={()=>setStatus("todos")}>Todos</Chip>
      <Chip selected={status==="pendente"} onPress={()=>setStatus("pendente")}>Pendentes</Chip>
      <Chip selected={status==="limpa"} onPress={()=>setStatus("limpa")}>Limpas</Chip>
      <Chip selected={campus==="todos"} onPress={()=>setCampus("todos")}>Todos Campi</Chip>
      {/* Em produção, renderize chips dinamicamente a partir dos campus/bloco disponíveis */}
      <Chip selected={campus==="Campus A"} onPress={()=>setCampus("Campus A")}>Campus A</Chip>
      <Chip selected={campus==="Campus B"} onPress={()=>setCampus("Campus B")}>Campus B</Chip>
    </View>
  );
}
