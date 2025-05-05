import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonToast, IonList, IonItem, IonLabel,
  IonModal, IonDatetime, IonTextarea, IonItemDivider,
  IonButtons, IonIcon, IonPopover, IonListHeader
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { notificationsOutline, ellipsisVertical } from 'ionicons/icons';

const Pcreservation: React.FC = () => {
  const [pcs, setPcs] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPCId, setSelectedPCId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [startTime, setStartTime] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);

  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(undefined);

  const [menuPopoverEvent, setMenuPopoverEvent] = useState<MouseEvent | undefined>();
  const [showMenuPopover, setShowMenuPopover] = useState(false);

  const history = useHistory();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPCs();
      fetchNotifications();
    }
  }, [userId]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
  };

  const fetchPCs = async () => {
    const { data: pcData } = await supabase.from('pcs').select('*');
    const { data: reservations } = await supabase.from('reservations').select('pc_id, user_id');

    const reservedMap = new Map(reservations?.map(r => [r.pc_id, r.user_id]));
    const merged = pcData?.map((pc) => ({
      ...pc,
      isReserved: reservedMap.has(pc.id),
      isMine: reservedMap.get(pc.id) === userId
    })) ?? [];

    setPcs(merged);
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error.message);
    }

    if (data) {
      console.log('Fetched notifications:', data);
      setNotifications(data);
    }
  };

  const openModal = (pcId: number) => {
    setSelectedPCId(pcId);
    setReason('');
    setStartTime('');
    setShowModal(true);
  };

  const submitReservation = async () => {
    if (!userId || !selectedPCId || !startTime || !reason) return;

    const { error } = await supabase
      .from('reservations')
      .insert([{
        pc_id: selectedPCId,
        user_id: userId,
        reason,
        start_time: startTime
      }]);

    if (!error) {
      setToastMessage('PC successfully reserved!');
      fetchPCs();
    } else {
      setToastMessage('Reservation failed: ' + error.message);
    }

    setShowToast(true);
    setShowModal(false);
  };

  const handleCancel = async (pcId: number) => {
    if (!userId) return;

    const { error } = await supabase
      .from('reservations')
      .delete()
      .match({ pc_id: pcId, user_id: userId });

    if (!error) {
      setToastMessage('Reservation cancelled.');
      await supabase.from('notifications').insert([{
        user_id: userId,
        message: `❌ You’ve cancelled your reservation for PC #${pcId}.`
      }]);
      fetchPCs();
    } else {
      setToastMessage('Cancel failed: ' + error.message);
    }

    setShowToast(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    history.replace('/pcreservation');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PC Reservation</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={(e) => {
                setPopoverEvent(e.nativeEvent);
                setShowPopover(true);
              }}
              style={{ position: 'relative' }}
            >
              <IonIcon icon={notificationsOutline} />
              {notifications.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                }} />
              )}
            </IonButton>
            <IonButton onClick={(e) => {
              setMenuPopoverEvent(e.nativeEvent);
              setShowMenuPopover(true);
            }}>
              <IonIcon icon={ellipsisVertical} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {pcs.map((pc) => (
            <IonItem key={pc.id}>
              <IonLabel>
                {pc.name} - {pc.isMine ? 'Reserved by You' : pc.isReserved ? 'Reserved' : 'Available'}
              </IonLabel>
              {pc.isMine ? (
                <IonButton slot="end" color="danger" onClick={() => handleCancel(pc.id)}>
                  Cancel
                </IonButton>
              ) : (
                <IonButton
                  slot="end"
                  disabled={pc.isReserved}
                  onClick={() => openModal(pc.id)}
                >
                  Reserve
                </IonButton>
              )}
            </IonItem>
          ))}
        </IonList>

        {/* Reservation Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Reservation Details</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItemDivider>Reason</IonItemDivider>
            <IonTextarea
              value={reason}
              onIonChange={e => setReason(e.detail.value!)}
              placeholder="Why are you reserving this PC?"
            />

            <IonItemDivider>Start Time</IonItemDivider>
            <IonDatetime
              presentation="date-time"
              value={startTime}
              onIonChange={e => {
                const value = e.detail.value;
                if (typeof value === 'string') setStartTime(value);
                else setStartTime('');
              }}
            />

            <IonButton expand="block" className="ion-margin-top" onClick={submitReservation}>
              Submit Reservation
            </IonButton>
            <IonButton expand="block" color="medium" onClick={() => setShowModal(false)}>
              Cancel
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color="primary"
        />
      </IonContent>

      {/* Notifications Popover */}
      <IonPopover
        event={popoverEvent}
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
      >
        <IonList>
          <IonListHeader>Notifications</IonListHeader>
          {notifications.length === 0 && (
            <IonItem>
              <IonLabel>No new notifications</IonLabel>
            </IonItem>
          )}
          {notifications.map(n => (
            <IonItem key={n.id} button onClick={async () => {
              await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', n.id);
              setNotifications(prev => prev.filter(x => x.id !== n.id));
              setShowPopover(false);
            }}>
              <IonLabel>
                <p>{n.message}</p>
                <small>{new Date(n.created_at).toLocaleString()}</small>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonPopover>

      {/* Menu Popover */}
      <IonPopover
        event={menuPopoverEvent}
        isOpen={showMenuPopover}
        onDidDismiss={() => setShowMenuPopover(false)}
      >
        <IonList>
          <IonItem button onClick={handleLogout}>
            <IonLabel>Log out</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>
    </IonPage>
  );
};

export default Pcreservation;
