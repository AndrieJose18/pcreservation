import {
  IonContent,
  IonHeader,
  IonMenu,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { Route, useHistory, Redirect } from 'react-router-dom'; // <- use react-router-dom
import Pcreservation from '../pages/Pcreservation';
import { supabase } from '../utils/supabaseClient';

const Home: React.FC = () => {
  const history = useHistory();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    history.replace('/pcreservation');
  };

  return (
    <IonSplitPane contentId="main">
      {/* Side Menu */}
      <IonMenu contentId="main">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem button onClick={handleLogout}>
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Main Content */}
      <IonPage id="main">
        <IonRouterOutlet>
          <Route exact path="/pcreservation/app/home" component={Pcreservation} />
          <Route exact path="/pcreservation/app">
            <Redirect to="/pcreservation/app/home" />
          </Route>
        </IonRouterOutlet>
      </IonPage>
    </IonSplitPane>
  );
};

export default Home;
