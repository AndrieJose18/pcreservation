// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonButton, IonToast
} from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import { supabase } from '../utils/supabaseClient';

const AdminDashboard: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const router = useIonRouter();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, pcs(name), user_id');
    if (data) setReservations(data);
    else console.error(error);
  };

  const sendNotification = async (userId: string) => {
    const { error } = await supabase
      .from('notifications')
      .insert([{ user_id: userId, message: 'HEY! Your PC reservation be approved! ⚓', is_read: false }]);

    if (!error) {
      setToastMessage('Notification sent successfully.');
    } else {
      setToastMessage('Failed to send notification.');
      console.error(error);
    }
    setShowToast(true);
  };

  const handleApprove = async (userId: string) => {
    await sendNotification(userId);
    await fetchReservations(); // Optional: refresh list
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/pcreservation', 'root', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Dashboard</IonTitle>
          <IonButton slot="end" color="danger" onClick={logout}>
            Log Out
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>All Reservations</h2>
        <IonList>
          {reservations.map((res) => (
            <IonItem key={res.id}>
              <IonLabel className="ion-text-wrap">
                <p><strong>PC:</strong> {res.pcs?.name || 'Unknown'}</p>
                <p><strong>User ID:</strong> {res.user_id}</p>
                <p><strong>Reason:</strong> {res.reason}</p>
                <p><strong>Start Time:</strong> {new Date(res.start_time).toLocaleString()}</p>
              </IonLabel>
              <IonButton color="success" slot="end" onClick={() => handleApprove(res.user_id)}>
                Approve & Notify
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
