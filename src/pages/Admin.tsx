// pages/AdminLogin.tsx
import React, { useState } from 'react';
import {
  IonPage, IonContent, IonInput, IonButton, IonToast, IonHeader, IonToolbar, IonTitle
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setToast(error.message);

    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!admin) {
      setToast('You are not an admin.');
      await supabase.auth.signOut();
      return;
    }

    history.push('/pcreservation/admin');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          label="Email"
          type="email"
          value={email}
          onIonChange={e => setEmail(e.detail.value!)}
        />
        <IonInput
          label="Password"
          type="password"
          value={password}
          onIonChange={e => setPassword(e.detail.value!)}
        />
        <IonButton expand="block" onClick={handleLogin}>
          Login
        </IonButton>
        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={2000}
          onDidDismiss={() => setToast('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminLogin;
