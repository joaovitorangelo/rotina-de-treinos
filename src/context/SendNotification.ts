export const SendNotification = async (token: string) => {
    try {
      const response = await fetch('/api/sendNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          title: 'Seja bem vindo 💪',
          body: 'Clique para cadastrar um treino!',
          image: 'https://emojis.wiki/pt/musculos/',
          link: 'https://rotina-de-treinos.vercel.app/account',
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Notificação enviada com sucesso!', data);
      } else {
        console.error('Erro ao enviar notificação:', data.error);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };
  