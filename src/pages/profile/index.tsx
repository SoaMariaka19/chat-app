import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Form, NavLink } from 'react-bootstrap';
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

// Schéma de validation des données du formulaire
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
  // Initialisation du formulaire et des cookies
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
  });
  const [cookies] = useCookies(['authToken']);

  // État pour stocker les données du profil de l'utilisateur
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    // Appel à la fonction pour récupérer les données du profil lors du chargement de la page
    fetchProfileData();
  }, []);

  const accessToken = cookies.authToken;

  const updateProfile = async (data: ProfileFormData) => {
    try {
      // Envoi de la requête PUT pour mettre à jour le profil de l'utilisateur
      const response = await fetch('http://localhost:8080/user', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,  
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
      // Envoi de la requête GET pour récupérer les données du profil de l'utilisateur
      const response = await fetch('http://localhost:8080/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        
        // Mise à jour de l'état avec les données du profil
        setProfileData(data.user);
        setValue('name', data.user.name);
        setValue('email', data.user.email);
        setValue('bio', data.user.bio || '');
      } else {
        console.error('Erreur lors de la récupération des informations du profil');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations du profil', error);
    }
  };
  
  const onSubmit = (data: ProfileFormData) => {
    // Appel à la fonction de mise à jour du profil lors de la soumission du formulaire
    updateProfile(data);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-start p-3">
            <NavLink href="/channel/create">
              Créer un channel
            </NavLink>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
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
                  <Button variant="primary" type="submit" className="updateProfileButton">Update Profile</Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
