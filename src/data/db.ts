import * as SQLite from "expo-sqlite";
import { Sala } from "../api/rooms";
const db = SQLite.openDatabase("salas.db");

export function initDb() {
  db.transaction(tx=>{
    tx.executeSql(`CREATE TABLE IF NOT EXISTS salas (
      id TEXT PRIMARY KEY,
      nome TEXT,
      campus TEXT,
      bloco TEXT,
      status TEXT,
      ultimaLimpeza TEXT
    );`);
  });
}
initDb();

export function saveRooms(salas: Sala[]): Promise<void> {
  return new Promise((resolve,reject)=>{
    db.transaction(tx=>{
      salas.forEach(s=>{
        tx.executeSql(
          `INSERT OR REPLACE INTO salas (id,nome,campus,bloco,status,ultimaLimpeza) VALUES (?,?,?,?,?,?);`,
          [s.id, s.nome, s.campus, s.bloco, s.status, s.ultimaLimpeza ?? null]
        );
      });
    }, reject, resolve);
  });
}

export function loadRooms(): Promise<Sala[]> {
  return new Promise((resolve,reject)=>{
    db.readTransaction(tx=>{
      tx.executeSql(`SELECT * FROM salas;`, [], (_, {rows})=>{
        const arr: Sala[] = rows._array as any;
        resolve(arr);
      });
    }, reject);
  });
}
