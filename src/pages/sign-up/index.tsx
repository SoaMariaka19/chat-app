import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';

const schema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  email: yup.string().required("L'email est requis").email("L'email n'est pas valide"),
  password: yup.string().required('Le mot de passe est requis').min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), yup.mixed().nullable() as any], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
});

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const [cookies, setCookie] = useCookies(['authToken']);


  const onSubmit = async (data: FormData) => {
    const accessToken = cookies.authToken;

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCookie('authToken', accessToken, { path: '/' });
        router.push('/profile');
      } else {
        console.error('Erreur lors de la création de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur', error);
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Inscription</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="name">
            <Form.Label>Nom:</Form.Label>
            <Form.Control type="text" {...register('name')} /> {/* Champ de formulaire "name" avec enregistrement dans useForm */}
            {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>} {/* Affichage du message d'erreur si présent */}
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" {...register('email')} /> {/* Champ de formulaire "email" avec enregistrement dans useForm */}
            {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>} {/* Affichage du message d'erreur si présent */}
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Mot de passe:</Form.Label>
            <Form.Control type="password" {...register('password')} /> {/* Champ de formulaire "password" avec enregistrement dans useForm */}
            {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>} {/* Affichage du message d'erreur si présent */}
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirmer le mot de passe:</Form.Label>
            <Form.Control type="password" {...register('confirmPassword')} /> {/* Champ de formulaire "confirmPassword" avec enregistrement dans useForm */}
            {errors.confirmPassword && <Form.Text className="text-danger">{errors.confirmPassword.message}</Form.Text>} {/* Affichage du message d'erreur si présent */}
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit">S'inscrire</Button> {/* Bouton de soumission du formulaire */}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
