import React from "react";
import { Card, Text, Button, Chip } from "react-native-paper";
import { Sala } from "../api/rooms";

export default function SalaCard({
  sala,
  onPress,
  onMarkClean,
  isAdmin,
}: {
  sala: Sala;
  onPress: () => void;
  onMarkClean?: () => void;
  isAdmin?: boolean;
}) {
  const pending = sala.status === "pendente";
  return (
    <Card style={{marginVertical:6}} onPress={onPress}>
      <Card.Title title={sala.nome} subtitle={`${sala.campus} • ${sala.bloco}`} />
      <Card.Content>
        <Chip compact>{pending ? "Pendente" : "Limpa"}</Chip>
        {sala.ultimaLimpeza && <Text style={{marginTop:6}}>Última limpeza: {new Date(sala.ultimaLimpeza).toLocaleString()}</Text>}
      </Card.Content>
      {isAdmin && pending && onMarkClean && (
        <Card.Actions>
          <Button onPress={onMarkClean}>Marcar como limpa</Button>
        </Card.Actions>
      )}
    </Card>
  );
}
