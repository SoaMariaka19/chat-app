import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

interface Message {
  id: string;
  content: string;
  author: string;
}

const ChannelPage: React.FC = () => {
  const { channel_id } = useParams<{ channel_id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Récupérer les messages du channel depuis le backend
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/channels/${channel_id}/messages`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages du channel :', error);
      }
    };

    fetchMessages();
  }, [channel_id]);

  const handleSendMessage = async () => {
    // Envoyer le nouveau message au backend
    try {
      const response = await axios.post(`/api/channels/${channel_id}/messages`, { content: newMessage });
      const newMessageData = response.data.message;
      setMessages((prevMessages) => [...prevMessages, newMessageData]);
      setNewMessage(''); // Réinitialiser le champ du nouveau message
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  return (
    <div>
      <h2>Channel: {channel_id}</h2>
      <div>
        <h3>Messages</h3>
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              <strong>{message.author}: </strong>
              {message.content}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Envoyer un message</h3>
        <Form>
          <Form.Group controlId="newMessageForm">
            <Form.Control
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSendMessage}>Envoyer</Button>
        </Form>
      </div>
    </div>
  );
};

export default ChannelPage;
