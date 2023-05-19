import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

const CreateChannel: React.FC = () => {
  const history = useHistory();
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('');

  // Obtenez les informations d'identification de l'utilisateur à partir du contexte ou du state
  const userId = 'userID'; // Remplacez 'userID' par l'ID de l'utilisateur actuel

  const handleCreateChannel = async () => {
    try {
      const response = await axios.post('/api/channel', {
        name: channelName,
        type: channelType,
        createdBy: userId,
      });

      const channelId = response.data.channelId;
      history.push(`/edit/${channelId}`);
    } catch (error) {
      console.error('Erreur lors de la création du channel :', error);
    }
  };

  return (
    <div>
      <h2>Créer un nouveau channel</h2>
      <Form>
        <Form.Group controlId="channelNameForm">
          <Form.Label>Nom du channel:</Form.Label>
          <Form.Control
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="channelTypeForm">
          <Form.Label>Type du channel:</Form.Label>
          <Form.Control
            as="select"
            value={channelType}
            onChange={(e) => setChannelType(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Privé</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={handleCreateChannel}>Créer le channel</Button>
      </Form>
    </div>
  );
};

export default CreateChannel;
