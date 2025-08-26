import React, { useState } from "react";
import { View } from "react-native";
import { Button, TextInput, HelperText, Card, Text, Switch } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [simulate, setSimulate] = useState(true);
  const [loading,setLoading] = useState(false);
  const invalid = !email || !password;

  const onSubmit = async () => {
    setLoading(true);
    try { await signIn(email, password, simulate); } finally { setLoading(false); }
  };

  return (
    <View style={{flex:1, justifyContent:"center", padding:16}}>
      <Card>
        <Card.Title title="Acesso" />
        <Card.Content>
          <TextInput label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{marginTop:12}} />
          <HelperText type="info">Ative “Simulado” para testar sem API.</HelperText>
          <View style={{flexDirection:"row", alignItems:"center", marginTop:8}}>
            <Switch value={simulate} onValueChange={setSimulate} />
            <Text style={{marginLeft:8}}>Login simulado</Text>
          </View>
          <Button mode="contained" disabled={invalid||loading} loading={loading} style={{marginTop:16}} onPress={onSubmit}>
            Entrar
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
