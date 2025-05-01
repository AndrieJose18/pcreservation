import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';

const MyReservations: React.FC = () => {
  // Mock data; replace with fetch from Supabase
  const reservations = [
    { id: 1, pcId: 'PC-001', date: '2025-05-01 10:00' },
    { id: 2, pcId: 'PC-002', date: '2025-05-02 14:00' },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Reservations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {reservations.map((res) => (
            <IonItem key={res.id}>
              <IonLabel>
                <h2>{res.pcId}</h2>
                <p>{res.date}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MyReservations;
