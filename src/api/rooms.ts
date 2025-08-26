import { api } from "./client";

export type Sala = {
  id: string;
  nome: string;
  campus: string;
  bloco: string;
  status: "limpa"|"pendente";
  ultimaLimpeza?: string;
};

export async function loginApi(email: string, password: string) {
  const {data} = await api.post("/auth/login", {email, password});
  // esperado: { token, user: {id, name, role} }
  return data;
}
export async function meApi(token: string) {
  const {data} = await api.get("/auth/me", { headers: {Authorization:`Bearer ${token}`} });
  return data; // {id,name,role}
}
export async function getSalas(token?: string) {
  const {data} = await api.get<Sala[]>("/salas", token ? {headers:{Authorization:`Bearer ${token}`}} : undefined);
  return data;
}
export async function getSala(id: string, token?: string) {
  const {data} = await api.get<Sala>(`/salas/${id}`, token ? {headers:{Authorization:`Bearer ${token}`}} : undefined);
  return data;
}
export async function marcarComoLimpa(id: string, token?: string) {
  const {data} = await api.post(`/salas/${id}/limpezas`, {}, token ? {headers:{Authorization:`Bearer ${token}`}} : undefined);
  return data; // por ex. { ok:true, limpeza:{id, salaId, data} }
}
export async function getHistorico(id: string, token?: string) {
  const {data} = await api.get<{id:string; data:string; usuario:string}[]>(`/salas/${id}/limpezas`, token ? {headers:{Authorization:`Bearer ${token}`}} : undefined);
  return data;
}
