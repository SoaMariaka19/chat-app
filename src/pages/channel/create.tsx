import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useRouter } from 'next/router'; 
import { yupResolver } from '@hookform/resolvers/yup'; // Import du validateur yupResolver pour react-hook-form


import { getAllUsers } from '../api/users'; // Remplacez par l'import approprié pour récupérer la liste des utilisateurs depuis votre API

interface ChannelFormData {
  name: string;
  users: string[];
}

const schema = yup.object().shape({
  name: yup.string().required('Le nom du channel est requis'),
  users: yup.array().of(yup.string()).min(1, 'Veuillez sélectionner au moins un utilisateur'),
});

const CreateChannelPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ChannelFormData>({
    resolver: yupResolver(schema),
  });

  const [users, setUsers] = useState<string[]>([]);
  const router = useRouter(); // Initialisation du hook useRouter

  useEffect(() => {
    // Récupérer la liste des utilisateurs depuis votre API
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers(); // Remplacez cette ligne avec votre code pour récupérer la liste des utilisateurs
        setUsers(users);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data: ChannelFormData) => {
    try {
      // Envoyer les données du formulaire vers le serveur pour création du channel
      // Remplacez cette partie avec votre code pour créer le channel avec les informations fournies
      const newChannel = {
        name: data.name,
        users: data.users,
      };

      // Exemple de requête vers l'API pour créer le channel
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChannel),
      });

      if (response.ok) {
        const createdChannel = await response.json();
        // Rediriger l'utilisateur vers la page du channel nouvellement créé
        router.push(`/channel/${createdChannel.id}`);
      } else {
        // Gérer les erreurs de création du channel
        console.error('Erreur lors de la création du channel');
      }
    } catch (error) {
      console.error('Erreur lors de la création du channel', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Créer un nouveau channel</h2>
        <Form name="createChannelForm" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="name">
            <Form.Label>Nom du channel:</Form.Label>
            <Form.Control type="text" {...register('name')} />
            {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
          </Form.Group>

          <Form.Group controlId="users">
            <Form.Label>Utilisateurs à ajouter au channel:</Form.Label>
            {users.map((user) => (
              <Form.Check
                key={user.id}
                type="checkbox"
                label={user.name}
                value={user.id}
                {...register('users')}
              />
            ))}
            {errors.users && <Form.Text className="text-danger">{errors.users.message}</Form.Text>}
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit">Créer</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateChannelPage;
