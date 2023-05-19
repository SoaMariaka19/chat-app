import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { ListGroup } from 'react-bootstrap';

interface User {
  id: string;
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Récupérer les informations sur les utilisateurs connectés depuis le backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs connectés :', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Utilisateurs connectés</h2>
      <ListGroup>
        {users.map((user) => (
          <ListGroup.Item key={user.id}>
            <strong>Nom :</strong> {user.name}
            <br />
            <strong>Email :</strong> {user.email}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ProfilePage;
