import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';

interface SendMessageFormData {
  message: string;
}

const schema = yup.object().shape({
  message: yup.string().required('Le contenu du message est requis'),
});

// Fonction fictive pour créer un nouveau message (à remplacer par votre propre code)
async function createMessage(messageData: any) {
  try {
    const response = await fetch('URL_DE_VOTRE_API/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du message');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Erreur lors de la création du message');
  }
}

const MessagePage = ({ userId }: { userId: string }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SendMessageFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SendMessageFormData) => {
    try {
      // Envoyer le message vers le serveur pour création dans la base de données
      // Remplacez cette partie avec votre code pour envoyer le message à votre API back-end
      const newMessage = {
        sender: 'ID_DE_L_EXPEDITEUR',
        recipient: userId,
        content: data.message,
      };

      // Exemple de requête vers l'API pour créer le nouveau message
      const response = await createMessage(newMessage);

      if (response.ok) {
        // Réinitialiser le formulaire
        reset();
        // Actualiser la liste des messages ou effectuer d'autres actions nécessaires
      } else {
        // Gérer les erreurs d'envoi du message
        console.error('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        {/* Afficher les informations de l'autre utilisateur */}
        <h2>Nom de l'autre utilisateur</h2>

        {/* Afficher la liste des messages directs échangés */}

        {/* Formulaire pour envoyer un nouveau message */}
        <Form name="sendMessageForm" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="message">
            <Form.Label>Contenu du message:</Form.Label>
            <Form.Control as="textarea" rows={3} {...register('message')} />
            {errors.message && <Form.Text className="text-danger">{errors.message.message}</Form.Text>}
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit">Envoyer</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MessagePage;
