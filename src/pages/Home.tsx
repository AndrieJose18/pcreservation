import { 
  IonButton,
    IonButtons,
      IonContent, 
      IonHeader, 
      IonIcon, 
      IonLabel, 
      IonMenuButton, 
      IonPage, 
      IonRouterOutlet, 
      IonTabBar, 
      IonTabButton, 
      IonTabs, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router';
import Favorites from './home-tabs/Favorites';
// import Feed from './home-tabs/Feed';
import { bookOutline, search, star } from 'ionicons/icons';
import Feed from './home-tabs/Feed';
  
  const Home: React.FC = () => {
     const tabs=[
      {name:'Feed',tab:'feed',url:'/pcreservation/app/home/feed',icon:bookOutline},
      {name:'Seach',tab:'search',url:'/pcreservation/app/home/search',icon:search},
      {name:'Favorites',tab:'favorites',url:'/pcreservation/app/home/favorites',icon:star}
     ]
    return (
      <IonReactRouter>
        <IonTabs>
          <IonTabBar slot="bottom">
          {tabs.map((item, index) => (
            <IonTabButton key={index} tab={item.tab} href={item.url}>
              <IonIcon icon={item.icon} />
              <IonLabel>{item.name}</IonLabel>
            </IonTabButton>
          ))}

          </IonTabBar>
          <IonRouterOutlet>
            <Route exact path="/pcreservation/app/home/feed" render={Feed}/>
            <Route exact path="/pcreservation/app/home">
              <Redirect to="/pcreservation/app/home/feed"/>
            </Route>
          </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    );
  };
  
  export default Home;