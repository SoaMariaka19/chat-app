import React from 'react';
import { useForm } from 'react-hook-form'; 
import * as yup from 'yup'; 
import { Button, Form, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie'; 
import { yupResolver } from '@hookform/resolvers/yup'; 
import Link from 'next/link';
import router from 'next/router';

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
    resolver: yupResolver(schema), 
  });

  const [cookies, setCookie] = useCookies(['authToken']); 
  const onSubmit = async (data: FormData) => {
    try{
    const response = await fetch('http://localhost:8080/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });


    if (response.ok) {
      setCookie('authToken', (await response.json()).user.token)
      router.push('/profile');
    } else {
      // Afficher le message d'erreur si l'authentification a échoué
      console.error('Erreur lors de l\'authentification');
    }
}catch(error){
  console.error('Erreur lors de l\'authentification');
}}

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Header>
          <h3>Authentification</h3>
        </Card.Header>
        <Card.Body>
          <Form name="loginForm" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label> 
              <Form.Control type="email" {...register('email', { required: true })} /> 
              {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label> 
              <Form.Control type="password" {...register('password', { required: true })} /> 
              {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>} 
            </Form.Group>

            <Button type="submit" className="loginButton">Login</Button> 

            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              Vous n'avez pas de compte ?{' '}
              <Link href="/signup">
                <Button variant="link">S'inscrire</Button>
              </Link>
            </div>
            
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginForm;
