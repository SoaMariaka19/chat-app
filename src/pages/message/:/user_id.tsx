import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

interface Message {
  id: string;
  content: string;
  sender: string;
  receiver: string;
}

const MessagePage: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Récupérer les messages de l'utilisateur depuis le backend
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${user_id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages de l\'utilisateur :', error);
      }
    };

    fetchMessages();
  }, [user_id]);

  const handleSendMessage = async () => {
    // Envoyer le nouveau message au backend
    try {
      const response = await axios.post(`/api/messages/${user_id}`, { content: newMessage });
      const newMessageData = response.data.message;
      setMessages((prevMessages) => [...prevMessages, newMessageData]);
      setNewMessage(''); // Réinitialiser le champ du nouveau message
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  return (
    <div>
      <h2>Messages avec l'utilisateur : {user_id}</h2>
      <div>
        <h3>Messages</h3>
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              <strong>{message.sender}: </strong>
              {message.content}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Envoyer un message</h3>
        <Form>
          <Form.Group controlId="messageForm">
            <Form.Control
              as="textarea"
              rows={3}
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

export default MessagePage;
