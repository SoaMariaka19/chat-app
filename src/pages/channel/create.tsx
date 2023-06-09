import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Form, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCookies } from 'react-cookie';

// Interface pour les données du formulaire
interface ChannelFormData {
  channelName: string;
  members: string[];
  type: string;
}

// Interface pour un utilisateur
interface User {
  id: string;
  name: string;
}

// Interface pour un channel
interface Channel {
  id: string;
  name: string;
}

// Schéma de validation avec yup
const schema = yup.object().shape({
  channelName: yup.string().required('Le nom du channel est requis'),
  members: yup.array().of(yup.string()).min(1, 'Veuillez sélectionner au moins un utilisateur'),
  type: yup
    .string()
    .oneOf(['public', 'private'], 'Le type du channel est requis'),
});

// Composant principal de la page de création du channel
const CreateChannelPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ChannelFormData>({
    resolver: yupResolver(schema),
  });

  const [cookies] = useCookies(['authToken']);
  const [users, setUsers] = useState<User[]>([]); // État local pour les utilisateurs
  const [channels, setChannels] = useState<Channel[]>([]); // État local pour les channels
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // État local pour les utilisateurs sélectionnés
  const [channelType, setChannelType] = useState<string>('public'); // État local pour le type de canal
  const [showUserList, setShowUserList] = useState(false); // État local pour afficher ou masquer la liste des utilisateurs
  const [newChannel, setNewChannel] = useState<Channel | null>(null);
  const router = useRouter();
  const accessToken = cookies.authToken; // Récupération du cookie d'authentification

  // Effectue une requête pour récupérer la liste des utilisateurs et des channels au chargement de la page
useEffect(() => {
  const fetchData = async () => {
    try {
      const usersResponse = await fetch('http://localhost:8080/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (usersResponse.ok) {
        const userData = await usersResponse.json();
        if (userData.status) {
          const users = userData.users || [];
          setUsers(userData.users.reverse()); // Met à jour la liste des utilisateurs
        } else {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
      } else {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      const channelsResponse = await fetch('http://localhost:8080/channels', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (channelsResponse.ok) {
        const channelData = await channelsResponse.json();
        if (channelData.status) {
          setChannels(channelData.channels); // Met à jour la liste des channels
        } else {
          throw new Error('Erreur lors de la récupération des channels');
        }
      } else {
        throw new Error('Erreur lors de la récupération des channels');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
    }
  };

  const intervalId = setInterval(fetchData, 3000); // Appel de la fonction fetchData toutes les 3 secondes

  // Nettoyage de l'intervalle lors du démontage du composant
  return () => {
    clearInterval(intervalId);
  };
}, []);


  // Gère la sélection ou la désélection d'un utilisateur
  const handleUserToggle = (userId: string) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Gère le changement du type de canal
  const handleChannelTypeChange = (value: string) => {
    setChannelType(value);
  };

  // Soumission du formulaire
  const onSubmit = async (data: ChannelFormData) => {
    try {
      const newChannel = {
        name: data.channelName,
        members: selectedUsers,
        type: channelType,
      };

      
      const response = await fetch('http://localhost:8080/channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newChannel),
      });

      

      if (response.ok) {
        const createdChannel = await response.json();
        setNewChannel(createdChannel);
      } else {
        console.error('Erreur lors de la création du channel');
      }
    } catch (error) {
      console.error('Erreur lors de la création du channel', error);
    }
  };

  return (
    <div className="d-flex">
      <Dropdown className="me-4">
        <Dropdown.Toggle variant="light" id="channelDropdown">
          Liste des channels
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {channels.map((channel) => (
            <Dropdown.Item key={channel.id} href={`/channel/${channel.id}`}>
              {channel.name}
            </Dropdown.Item>
          ))}
          {newChannel && (
            <Dropdown.Item key={newChannel.id} href={`/channel/${newChannel.id}`}>
              {newChannel.name}
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <div className="p-4 d-flex flex-column justify-content-center align-items-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Créer un nouveau channel</h2>
        <Form name="createChannelForm" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="channelName">
            <Form.Label>Nom du channel:</Form.Label>
            <Form.Control type="text" {...register('channelName')} />
            {errors.channelName && <Form.Text className="text-danger">{errors.channelName.message}</Form.Text>}
          </Form.Group>

          <Form.Group controlId="members">
            <Form.Label>Utilisateurs à ajouter au channel:</Form.Label>
            <div onClick={() => setShowUserList(!showUserList)} style={{ cursor: 'pointer' }}>
              <span>{selectedUsers.length} utilisateur(s) sélectionné(s)</span>
              <span style={{ marginLeft: '4px' }}>{showUserList ? '▲' : '▼'}</span>
            </div>
            {showUserList && (
              <>
                {users.map((user) => (
                  <Form.Check
                    key={user.id}
                    type="checkbox"
                    label={user.name}
                    value={user.id}
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                  />
                ))}
              </>
            )}
            {errors.members && <Form.Text className="text-danger">{errors.members.message}</Form.Text>}
          </Form.Group>

          <Form.Group controlId="type">
            <Form.Label className="mb-2">Type de canal:</Form.Label>
            <Form.Check
              type="radio"
              id="public"
              label="Public"
              value="public"
              checked={channelType === 'public'}
              onChange={(event) => handleChannelTypeChange(event.target.value)}
            />
            <Form.Check
              type="radio"
              id="private"
              label="Private"
              value="private"
              checked={channelType === 'private'}
              onChange={(event) => handleChannelTypeChange(event.target.value)}
            />
            {errors.type && <Form.Text className="text-danger">{errors.type.message}</Form.Text>}
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit" className="createChannelButton">Create Channel</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateChannelPage;
