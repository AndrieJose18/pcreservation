import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonDatetime } from '@ionic/react';
import { useState } from 'react';

const Reserve: React.FC = () => {
  const [pcId, setPcId] = useState('');
  const [reservationDate, setReservationDate] = useState('');

  const handleReserve = async () => {
    // TODO: Save reservation to Supabase
    console.log('Reserving PC:', pcId, reservationDate);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reserve PC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">PC ID</IonLabel>
          <IonInput value={pcId} onIonChange={(e) => setPcId(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Reservation Date</IonLabel>
          <IonDatetime
            presentation="date-time"
            value={reservationDate}
            onIonChange={(e) => setReservationDate(typeof e.detail.value === 'string' ? e.detail.value ?? '' : e.detail.value?.[0] ?? '')}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleReserve} className="ion-margin-top">
          Reserve
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Reserve;
