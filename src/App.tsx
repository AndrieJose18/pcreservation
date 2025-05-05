import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; // ✅ Use the new layout with the menu and main content

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/pcreservation" component={Login} />
        <Route exact path="/pcreservation/register" component={Register} />
        <Route path="/pcreservation/app" component={Home} />
        <Redirect exact from="/" to="/pcreservation" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
