import { getSalas } from "../api/rooms";
import { saveRooms } from "./db";

export async function backgroundSync(token?: string|null) {
  if (!token) return;
  const fresh = await getSalas(token);
  await saveRooms(fresh);
}
