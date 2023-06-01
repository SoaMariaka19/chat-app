import React from 'react';
import { useForm } from 'react-hook-form'; // Import du hook useForm de react-hook-form pour la gestion des formulaires
import * as yup from 'yup'; // Import de yup pour la validation des schémas
import { Button, Form, Card } from 'react-bootstrap'; // Import des composants Button, Form et Card de react-bootstrap
import { useCookies } from 'react-cookie'; // Import du hook useCookies de react-cookie
import { yupResolver } from '@hookform/resolvers/yup'; // Import du validateur yupResolver pour react-hook-form

interface FormData {
  email: string;
  password: string;
}

// Définition du schéma de validation yup pour le formulaire
const schema = yup.object().shape({
  email: yup.string().email().required(), // Champ "email" requis et doit être un email valide
  password: yup.string().required(), // Champ "password" requis
});

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema), // Utilisation du yupResolver pour valider le schéma avec react-hook-form
  });

  const [cookies, setCookie] = useCookies(['token']); // Utilisation des cookies pour stocker le token

  const onSubmit = async (data: FormData) => {
    // Appeler votre endpoint d'authentification avec les données (email, password) ici
    const response = await fetch('/votre-endpoint-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      const { token } = responseData;
      setCookie('token', token, { path: '/' }); // Stockage du token dans les cookies
      // Rediriger l'utilisateur vers la page /profile
      window.location.href = '/profile';
    } else {
      // Afficher le message d'erreur si l'authentification a échoué
      console.error(responseData.error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Header>
          <h3>Authentification</h3> {/* Titre de la carte */}
        </Card.Header>
        <Card.Body>
          <Form name="loginForm" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label> {/* Label du champ "email" */}
              <Form.Control type="email" {...register('email', { required: true })} /> {/* Champ de formulaire "email" avec enregistrement dans useForm */}
              {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>} {/* Affichage du message d'erreur si présent */}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label> {/* Label du champ "password" */}
              <Form.Control type="password" {...register('password', { required: true })} /> {/* Champ de formulaire "password" avec enregistrement dans useForm */}
              {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>} {/* Affichage du message d'erreur si présent */}
            </Form.Group>

            <Button type="submit">Se connecter</Button> {/* Bouton de soumission du formulaire */}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginForm;
