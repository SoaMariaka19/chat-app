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

async function createMessage(messageData: SendMessageFormData) {
  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (response.ok) {
      const createdMessage = await response.json();
      return createdMessage;
    } else {
      throw new Error('Erreur lors de la création du message');
    }
  } catch (error) {
    console.error('Erreur lors de la création du message', error);
    throw error;
  }
}

const ChannelPage = ({ channelId }: { channelId: string }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SendMessageFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SendMessageFormData) => {
    try {
      const newMessage: SendMessageFormData = {
        message: data.message,
      };

      const response = await createMessage(newMessage);

      if (response) {
        reset();
      } else {
        console.error('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2>Nom du channel</h2>

        {/* Afficher la liste des messages du channel */}

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

export default ChannelPage;
