import { 
  IonButtons,
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonItem,
    IonLabel,
    IonList 
} from '@ionic/react';

const Favorites: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonList>
    <IonItem>
      <IonLabel>One Piece</IonLabel>
    </IonItem>
    <IonItem>
      <IonLabel>Vinland Saga</IonLabel>
    </IonItem>
    <IonItem>
      <IonLabel>Bleach</IonLabel>
    </IonItem>
    <IonItem>
      <IonLabel> Solo Leveling </IonLabel>
    </IonItem>
    <IonItem>
      <IonLabel> Demon Slayer</IonLabel>
    </IonItem>
  </IonList>
      </IonContent>
    </IonPage>
    
  );
};

export default Favorites;