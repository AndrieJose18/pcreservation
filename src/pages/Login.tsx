import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonModal,
  useIonRouter,
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import logo from '../assets/onepiecelogo.jpg';

// Pirate-themed AlertBox
const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({
  message,
  isOpen,
  onClose,
}) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="🏴‍☠️ Unauthorized Access"
      subHeader="Straw Hat Pirates"
      message={message}
      buttons={[
        {
          text: 'Aye, Captain!',
          role: 'cancel',
          cssClass: 'alert-button-confirm',
        },
      ]}
      cssClass="pirate-alert"
    />
  );
};

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage("You're not part of the crew! Check your email and password, matey!");
      setShowAlert(true);
      return;
    }

    setShowSuccessModal(true);
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
          <IonAvatar style={{ width: '260px', height: '260px', marginBottom: '15px', border: '4px solid #FFD700' }}>
            <img alt="One Piece Logo" src={logo} />
          </IonAvatar>

          <h1
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#FFE600',
              fontSize: '2.2rem',
              textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
              fontFamily: '"Treasure Map Deadhand", "Georgia", serif',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            STRAWHATS LOGIN
          </h1>

          <div
            style={{
              backgroundColor: 'rgba(255, 253, 208, 0.95)',
              padding: '25px',
              borderRadius: '18px',
              width: '100%',
              maxWidth: '90vw',
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
              border: '2px solid #8B4513',
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
              style={{ '--background': '#fff8dc', '--color': '#000' }}
            />
            <IonInput
              style={{ marginTop: '15px', '--background': '#fff8dc', '--color': '#000' }}
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
              color="warning"
              style={{
                marginTop: '20px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                background: 'linear-gradient(to right, #ffcc00, #ff9900)',
              }}
            >
              Login
            </IonButton>

            <IonButton
              routerLink="/pcreservation/register"
              expand="block"
              fill="clear"
              shape="round"
              style={{
                marginTop: '10px',
                color: '#8B4513',
                fontStyle: 'italic',
              }}
            >
              Don't have an account? Join the crew!
            </IonButton>
          </div>
        </div>

        {/* Themed Alert Box */}
        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

        {/* Pirate-themed Success Modal */}
       {/* Pirate-themed Success Modal */}
       <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)} className="centered-modal" backdropDismiss={false} showBackdrop={true}>
  <div className="modal-content-box">
    <h2
      style={{
        fontFamily: '"Treasure Map Deadhand", serif',
        fontSize: '1.8rem',
        color: '#8B0000',
        marginBottom: '10px',
      }}
    >
      ☠️ Welcome aboard, Captain!
    </h2>
    <p style={{ fontSize: '1rem', color: '#000' }}>
      Ye be part of the Straw Hat crew now!
    </p>
    <IonButton
      color="warning"
      shape="round"
      expand="block"
      style={{ marginTop: '20px', fontWeight: 'bold' }}
      onClick={() => {
        setShowSuccessModal(false);
        navigation.push('/pcreservation/app', 'forward', 'replace');
      }}
    >
      Set Sail!
    </IonButton>
  </div>
</IonModal>




        <style>{`
          .pirate-alert {
            --background: #fff8dc;
            --color: #000;
            --ion-color-primary: #8B4513;
          }
          .centered-modal {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
          }
        `}</style>
      </IonContent>
    </IonPage>
  );
};

export default Login;
