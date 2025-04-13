import firebase_app from '../firebase/firebaseAppConfig';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const NotificationPermission = async () => {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator)) return null;

  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    console.warn('Notificações push requerem HTTPS');
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log('Permissão negada para notificações');
    return null;
  }

  const registration = await navigator.serviceWorker.register('/sw.js');

  const { getMessaging, getToken } = await import('firebase/messaging');
  const messaging = getMessaging(firebase_app);

  try {
    const token = await getToken(messaging, {
      vapidKey: 'BG_LP_eDnXtjbhSRdChdShVPY1PwWBnF8AYnZEWrlV_KnTHTuYlgkpgXSIuvLJbY-pf8FIcRiqfFOa8cFRIRmxg',
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('Token gerado:', token);

      // Salvar no Firestore
      const auth = getAuth(firebase_app);
      const user = auth.currentUser;
      const db = getFirestore(firebase_app);

      if (user) {
        await setDoc(doc(db, 'users', user.uid), { fcmToken: token }, { merge: true });
        console.log('Token salvo no Firestore com sucesso!');
      } else {
        console.warn('Usuário não autenticado. Token não salvo.');
      }

      return token;
    } else {
      console.warn('Token FCM não foi gerado');
      return null;
    }
  } catch (err) {
    console.error('Erro ao obter token FCM:', err);
    return null;
  }
};
