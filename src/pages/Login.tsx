import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  useIonRouter,
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import logo from '../assets/lab2.gif';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const doLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      setAlertMessage('Incorrect email or password.');
      setShowAlert(true);
      return;
    }

    const userId = data.user.id;
    const { data: adminCheck, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('id', userId)
      .single();

    if (adminError) {
      // Not an admin, go to normal user app
      setShowSuccessModal(true);
      return;
    }

    // Admin detected
    navigation.push('/pcreservation/admin', 'forward', 'replace');
  };

  return (
    <IonPage>
      <IonContent
        className="ion-padding"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20%',
            padding: '10px',
            backdropFilter: 'blur(2px)',
          }}
        >
          <IonAvatar style={{ width: '260px', height: '260px', marginBottom: '15px' }}>
            <img alt="App Logo" src={logo} />
          </IonAvatar>

          <h1
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '2.2rem',
              color: '#333',
              marginBottom: '10px',
            }}
          >
            PC RESERVATION
          </h1>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '25px',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '90vw',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            <IonInput
              label="Email"
              labelPlacement="floating"
              fill="outline"
              type="email"
              placeholder="Enter your email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
            <IonInput
              style={{ marginTop: '15px' }}
              fill="outline"
              type="password"
              placeholder="Password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            >
              <IonInputPasswordToggle slot="end" />
            </IonInput>

            <IonButton
              onClick={doLogin}
              expand="block"
              shape="round"
              color="primary"
              style={{
                marginTop: '20px',
                fontWeight: 'bold',
              }}
            >
              Login
            </IonButton>

            <IonButton
              routerLink="/pcreservation/register"
              expand="block"
              fill="clear"
              shape="round"
              style={{ marginTop: '10px' }}
            >
              Don't have an account?
            </IonButton>
          </div>
        </div>

        {/* Error Alert */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Login Error"
          message={alertMessage}
          buttons={['OK']}
        />

        {/* Success Alert */}
        <IonAlert
          isOpen={showSuccessModal}
          onDidDismiss={() => {
            setShowSuccessModal(false);
            navigation.push('/pcreservation/app', 'forward', 'replace');
          }}
          header="Welcome!"
          message="You have successfully logged in."
          buttons={['Continue']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
