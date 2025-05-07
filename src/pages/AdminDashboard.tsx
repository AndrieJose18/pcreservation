import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonButton, IonToast,
  IonButtons, IonIcon, IonPopover, IonListHeader
} from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';

const AdminDashboard: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>();

  const router = useIonRouter();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, pcs(name), user_id, is_approved');

    console.log("Fetched Reservations:", data); // Log fetched data for debugging
    if (data) {
      setReservations(data);
    } else {
      console.error('Error fetching reservations:', error);
    }
  };

  const sendNotification = async (userId: string) => {
    const { error } = await supabase
      .from('notifications')
      .insert([{ user_id: userId, message: 'HEY! Your PC reservation is approved! ⚓', is_read: false }]);

    if (!error) {
      setToastMessage('Notification sent successfully.');
    } else {
      setToastMessage('Failed to send notification.');
      console.error(error);
    }
    setShowToast(true);
  };

  const handleApprove = async (reservationId: string, userId: string) => {
    // Update the reservation to approved in the database
    const { data, error } = await supabase
      .from('reservations')
      .update({ is_approved: true })
      .eq('id', reservationId)
      .select(); // Add select here to get updated data

    if (error) {
      console.error('Failed to approve reservation:', error);
      setToastMessage('Failed to approve reservation.');
      setShowToast(true);
      return;
    }

    console.log('Updated reservation:', data); // Log the updated reservation
    await sendNotification(userId);

    // Refetch reservations to reflect the updated data
    await fetchReservations();
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
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={(e) => {
              setPopoverEvent(e.nativeEvent);
              setShowPopover(true);
            }}>
              <IonIcon icon={ellipsisVertical} />
            </IonButton>
          </IonButtons>
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
              <IonButton
                color="success"
                slot="end"
                onClick={() => handleApprove(res.id, res.user_id)}
                disabled={res.is_approved} // Disable the button if already approved
              >
                {res.is_approved ? 'Approved' : 'Approve & Notify'}
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

        <IonPopover
          isOpen={showPopover}
          event={popoverEvent}
          onDidDismiss={() => setShowPopover(false)}
        >
          <IonList>
            <IonItem button onClick={logout}>
              <IonLabel>Log Out</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
