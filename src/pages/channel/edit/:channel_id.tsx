import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { getChannel, updateChannel } from '../api/channel'; // Remplacez par l'import approprié pour récupérer et mettre à jour les informations du channel depuis votre API
import { yupResolver } from '@hookform/resolvers/yup'; // Import du validateur yupResolver pour react-hook-form

interface ChannelFormData {
  users: string[];
}

const schema = yup.object().shape({
  users: yup.array().of(yup.string()).min(1, 'Veuillez sélectionner au moins un utilisateur'),
});

const EditChannelPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ChannelFormData>({
    resolver: yupResolver(schema),
  });

  const [channel, setChannel] = useState<any>(null);
  const router = useRouter();

  const { channel_id } = router.query;

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channelData = await getChannel(channel_id as string); // Remplacez cette ligne avec votre code pour récupérer les informations du channel
        setChannel(channelData);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du channel', error);
      }
    };

    fetchChannel();
  }, [channel_id]);

  const onSubmit = async (data: ChannelFormData) => {
    try {
      // Envoyer les données du formulaire vers le serveur pour mise à jour du channel
      // Remplacez cette partie avec votre code pour mettre à jour les informations du channel avec les utilisateurs supplémentaires
      const updatedChannel = {
        id: channel.id,
        users: [...channel.users, ...data.users],
      };

      // Exemple de requête vers l'API pour mettre à jour le channel
      const response = await updateChannel(updatedChannel);

      if (response.ok) {
        // Rediriger l'utilisateur vers la page du channel édité
        router.push(`/channel/${channel.id}`);
      } else {
        // Gérer les erreurs de mise à jour du channel
        console.error('Erreur lors de la mise à jour du channel');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du channel', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Modifier le channel</h2>
        {channel ? (
          <Form name="editChannelForm" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="users">
              <Form.Label>Utilisateurs à ajouter au channel:</Form.Label>
              {channel.users.map((user: any) => (
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
              <Button variant="primary" type="submit">Enregistrer</Button>
            </div>
          </Form>
        ) : (
          <div>Chargement du channel...</div>
        )}
      </div>
    </div>
  );
};

export default EditChannelPage;
