import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup'; 
import { useCookies } from 'react-cookie';

interface ChannelFormData {
  users: string[];
}

interface User {
  id: string;
  name: string;
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
  const [cookies] = useCookies(['authToken']);
  const accessToken = cookies.authToken;
  const [showUserList, setShowUserList] = useState(false); 
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]); 



  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await fetch(`http://localhost:8080/channel/${channel_id}`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`, 
          }
        }); 
        
        if (response.ok) {
          const channelData = await response.json();
          setChannel(channelData);
        } else {
          throw new Error('Erreur lors de la récupération des informations du canal');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du canal', error);
      }
    };
    

    fetchChannel();
  }, [channel_id]);

  const onSubmit = async (data: ChannelFormData) => {
    console.log(data);
    
    try {
      const updatedChannel = {
        id: channel.id,
        users: [...channel.users, ...data.users],
      };
  
      const response = await fetch(`http://localhost:8080/channels/:channelId/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ users: updatedChannel.users }),
      });
  
      if (response.ok) {
        router.push(`/channel/${channel.id}`);
      } else {
        throw new Error('Erreur lors de la mise à jour du canal');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du canal', error);
    }
  };

  const handleUserToggle = (userId: string) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
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
            {errors.users && <Form.Text className="text-danger">{errors.users.message}</Form.Text>}
            </Form.Group>
  
            <div className="d-grid">
              <Button variant="primary" type="submit" className='editChannelButton'>Edit Channel</Button>
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
