import { 
  IonButtons,
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar 
} from '@ionic/react';
import FeedContainer from '../../components/FeedContainer';

import React from 'react';

const Feed: React.FC = () => {
  return (
    <div>
      <h2>Feed</h2>
      <p>This is the Feed tab content.</p>
    </div>
  );
};


export default Feed;