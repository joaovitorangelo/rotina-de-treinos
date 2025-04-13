import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { token, title, body, image, link } = req.body;

  if (!token || !title || !body || !link) {
    return res.status(400).json({ error: 'Campos obrigatórios: token, title, body e link' });
  }

  try {
    const messaging = getMessaging();

    const message = {
      token,
      notification: {
        title,
        body,
        image: image || undefined,
      },
      webpush: {
        fcmOptions: {
          link,
        },
      },
    };

    const response = await messaging.send(message);
    return res.status(200).json({ success: true, response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao enviar notificação' });
  }
}
