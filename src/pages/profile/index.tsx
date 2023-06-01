import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup'; 
import { useCookies } from 'react-cookie';

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  bio: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  email: yup.string().email('Adresse email invalide').required('L\'adresse email est requise'),
  currentPassword: yup.string().required('Le mot de passe actuel est requis'),
  newPassword: yup
    .string()
    .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
    .required('Le nouveau mot de passe est requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
  bio: yup.string().nullable(),
});

const ProfilePage = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
  });
  const [cookies] = useCookies(['authToken']);
  const accessToken = cookies.authToken;
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const updateProfile = async (data: ProfileFormData) => {
    try {
      const response = await fetch('http://localhost:8080/user', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJlbGluLm1hc2tAdGVzdC5jb20iLCJpYXQiOjE2ODQzMzA4OTF9.Ow0PUX0BLGIGDfWEzS822Ftiaixj0Kpa5iELd7T_T1s"}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        console.log('Profil mis à jour avec succès');
        setProfileData(data);
      } else {
        console.error('Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
    }
  };
  
  const fetchProfileData = async () => {
    try {
      const response = await fetch('http://localhost:8080/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJlbGluLm1hc2tAdGVzdC5jb20iLCJpYXQiOjE2ODQzMzA4OTF9.Ow0PUX0BLGIGDfWEzS822Ftiaixj0Kpa5iELd7T_T1s"}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        
        setProfileData(data);
        setValue('name', data.name);
        setValue('email', data.email);
        setValue('bio', data.bio || '');
      } else {
        console.error('Erreur lors de la récupération des informations du profil');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations du profil', error);
    }
  };
  
  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Modifier le profil</h2>
        <Form name="editProfileForm" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="name">
            <Form.Label>Nom:</Form.Label>
            <Form.Control type="text" {...register('name')} />
            {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" {...register('email')} />
            {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>}
          </Form.Group>

          <Form.Group controlId="currentPassword">
            <Form.Label>Mot de passe actuel:</Form.Label>
            <Form.Control type="password" {...register('currentPassword')} />
            {errors.currentPassword && <Form.Text className="text-danger">{errors.currentPassword.message}</Form.Text>}
          </Form.Group>

          <Form.Group controlId="newPassword">
            <Form.Label>Nouveau mot de passe:</Form.Label>
            <Form.Control type="password" {...register('newPassword')} />
            {errors.newPassword && <Form.Text className="text-danger">{errors.newPassword.message}</Form.Text>}
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirmer le mot de passe:</Form.Label>
            <Form.Control type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && <Form.Text className="text-danger">{errors.confirmPassword.message}</Form.Text>}
          </Form.Group>

          <Form.Group controlId="bio">
            <Form.Label>Biographie:</Form.Label>
            <Form.Control as="textarea" rows={3} {...register('bio')} />
            {errors.bio && <Form.Text className="text-danger">{errors.bio.message}</Form.Text>}
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit">Enregistrer</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
