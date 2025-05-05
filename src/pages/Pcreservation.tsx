import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonContent, IonButton, IonToast, IonList, IonItem, IonLabel,
  IonModal, IonInput, IonDatetime, IonTextarea, IonItemDivider,
  IonIcon, IonPopover, IonListHeader
} from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';

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
  const [popoverEvent, setPopoverEvent] = useState<Event | null>(null);

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
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false);

    if (data) setNotifications(data);
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
      await supabase.from('notifications').insert([
        {
          user_id: userId,
          message: `You’ve cancelled your reservation for PC #${pcId}.`
        }
      ]);
      fetchPCs();
    } else {
      setToastMessage('Cancel failed: ' + error.message);
    }

    setShowToast(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/pcreservation";
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PC Reservation</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={(e) => setPopoverEvent(e.nativeEvent)}>
              <IonIcon icon={ellipsisVertical} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover
        event={popoverEvent}
        isOpen={!!popoverEvent}
        onDidDismiss={() => setPopoverEvent(null)}
      >
        <IonList>
        
          <IonItem button onClick={handleLogout}>
            Logout
          </IonItem>
        </IonList>
      </IonPopover>

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

        {/* Modal for Reservation Details */}
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

        {/* Toast for general messages */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color="primary"
        />

        {/* Toasts for Notifications */}
        {notifications.map((n) => (
          <IonToast
            key={n.id}
            isOpen={true}
            message={n.message}
            duration={3000}
            color="success"
            onDidDismiss={async () => {
              await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', n.id);
              setNotifications((prev) => prev.filter((x) => x.id !== n.id));
            }}
          />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Pcreservation;
