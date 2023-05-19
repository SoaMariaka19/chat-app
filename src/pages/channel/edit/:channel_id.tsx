import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Spinner } from 'react-bootstrap';

interface Channel {
  id: string;
  name: string;
  type: string;
  createdBy: string;
}

interface User {
  id: string;
  name: string;
}

const EditChannelPage: React.FC = () => {
  const { channel_id } = useParams<{ channel_id: string }>();
  const history = useHistory();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les informations du channel depuis le backend
    const fetchChannel = async () => {
      try {
        const response = await axios.get(`/api/channels/${channel_id}`);
        setChannel(response.data.channel);
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du channel :', error);
      }
    };

    fetchChannel();
  }, [channel_id]);

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleSave = async () => {
    // Envoyer la requête de mise à jour du channel avec les nouveaux utilisateurs
    try {
      await axios.put(`/api/channels/${channel_id}`, { users: selectedUsers });
      history.push(`/channel/${channel_id}`); // Rediriger vers la page du channel après la modification
    } catch (error) {
      console.error('Erreur lors de la mise à jour du channel :', error);
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>; // Afficher un indicateur de chargement pendant la récupération des données
  }

  return (
    <div>
      <h2>Modifier le channel : {channel?.name}</h2>
      <div>
        <h3>Ajouter de nouveaux utilisateurs</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <Form.Check
                type="checkbox"
                id={user.id}
                label={user.name}
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleUserSelect(user.id)}
              />
            </li>
          ))}
        </ul>
      </div>
      <Button variant="primary" onClick={handleSave}>Enregistrer</Button>
    </div>
  );
};

export default EditChannelPage;
