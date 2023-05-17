// Importation des dépendances
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

// Définition du composant SignupPage
const SignupPage = () => {
  // Récupération de l'objet router pour la navigation
  const router = useRouter();

  // Déclaration des états pour les champs du formulaire
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [bio, setBio] = useState('');

  // Effet se déclenchant lors du montage du composant
  useEffect(() => {
    // Récupération des informations depuis le local storage
    const storedNom = localStorage.getItem('nom');
    const storedEmail = localStorage.getItem('email');
    const storedMotDePasse = localStorage.getItem('motDePasse');
    const storedBio = localStorage.getItem('bio');

    // Vérification si toutes les informations existent dans le local storage
    if (storedNom && storedEmail && storedMotDePasse && storedBio) {
      // Redirection vers la page de chat global
      router.push('/global-chat');
    }
  }, []);

  // Fonction appelée lors du clic sur le bouton d'inscription
  const handleSignup = () => {
    // Enregistrement des informations dans le local storage
    localStorage.setItem('nom', nom);
    localStorage.setItem('email', email);
    localStorage.setItem('motDePasse', motDePasse);
    localStorage.setItem('bio', bio);

    // Redirection vers la page de chat global
    router.push('/global-chat');
  };

  return (
    <div className="form-wrapper">
      <Container>
        <Row>
          <Col>
            <Form className="form-container">
              <h2 className="form-title">Inscription</h2>

              <Form.Group className="form-input" controlId="formNom">
                <Form.Label>Nom</Form.Label>
                <Form.Control type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
              </Form.Group>

              <Form.Group className="form-input" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group className="form-input" controlId="formMotDePasse">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="form-input" controlId="formConfirmationMotDePasse">
                <Form.Label>Confirmation du mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmationMotDePasse}
                  onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="form-input" controlId="formBio">
                <Form.Label>Bio</Form.Label>
                <Form.Control as="textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
              </Form.Group>

              <Button className="form-button" variant="primary" onClick={handleSignup}>
                S'inscrire
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignupPage;
