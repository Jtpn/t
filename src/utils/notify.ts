import * as Notifications from "expo-notifications";
import { Sala } from "../api/rooms";

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldPlaySound: false, shouldShowAlert: true, shouldSetBadge: false }),
});

export async function ensurePermission(){
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const r = await Notifications.requestPermissionsAsync();
    if (r.status !== "granted") return false;
  }
  return true;
}

export async function schedulePendingNotifications(salas: Sala[]) {
  const ok = await ensurePermission();
  if (!ok) return;
  const pendentes = salas.filter(s=>s.status==="pendente");
  if (!pendentes.length) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Limpezas pendentes",
      body: `Existem ${pendentes.length} sala(s) para limpar.`,
    },
    trigger: { seconds: 5 },
  });
}
