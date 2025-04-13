import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const db = getFirestore();
    const messaging = getMessaging();

    const usersSnapshot = await db.collection('users').get();
    const tokens: string[] = [];

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.fcmToken) {
        tokens.push(data.fcmToken);
      }
    });

    if (tokens.length === 0) {
      return res.status(200).json({ message: 'Nenhum token encontrado.' });
    }

    // Envio paralelo com Promise.allSettled
    const results = await Promise.allSettled(
        tokens.map(token =>
        messaging.send({
            token,
            webpush: {
            notification: {
                title: 'Dia de treino 💪',
                body: 'Veja quais serão os músculos do dia!',
                image: 'https://emojis.wiki/pt/musculos/',
            },
            fcmOptions: {
                link: 'https://rotina-de-treinos.vercel.app',
            },
            },
        }).then(response => ({
            token,
            success: true,
            response,
        })).catch(error => {
            console.error(`Erro ao enviar para token ${token}:`, error);
            return {
            token,
            success: false,
            error: error.message || error,
            };
        })
        )
    );
  
    return res.status(200).json({
      success: true,
      total: results.length,
      enviados: results.filter(r => r.status === 'fulfilled').length,
      falhas: results.filter(r => r.status === 'rejected').length,
      detalhes: results.map(r => r.status === 'fulfilled' ? r.value : r.reason),
    });
  } catch (err) {
    console.error('Erro geral ao enviar notificações:', err);
    return res.status(500).json({ error: 'Erro ao enviar notificações.' });
  }
}
