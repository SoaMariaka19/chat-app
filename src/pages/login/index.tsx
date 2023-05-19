import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/login', { email, password });
      // Stocker les informations utilisateur dans le stockage local
      localStorage.setItem('token', response.data.token);
      // Rediriger l'utilisateur vers la page de création de channel
      history.push('/channel/create');
    } catch (error) {
      setError('Adresse e-mail ou mot de passe incorrect');
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      {error && <p>{error}</p>}
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="emailForm">
          <Form.Label>Adresse e-mail:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="passwordForm">
          <Form.Label>Mot de passe:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Se connecter</Button>
      </Form>
    </div>
  );
};

export default Login;
