// This is a mock service to simulate sending emails.
// In a production environment, this would communicate with a backend API (e.g., SendGrid, AWS SES).

export interface EmailDetails {
  to: string;
  name: string;
  roomName: string;
  dates: string;
  amount: number;
}

export interface ReceptionNotification {
  type: 'ROOM_BOOKING' | 'DINING_BOOKING' | 'TOUR_BOOKING' | 'INQUIRY';
  guestName: string;
  details: string;
  amount?: number;
  contact?: string;
}

const RECEPTION_EMAIL = 'NAINAGARH.reception@gmail.com';

export const sendBookingConfirmation = async (details: EmailDetails): Promise<boolean> => {
  console.log(`[Email Service] Sending confirmation to GUEST: ${details.to}...`);
  
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log(`
    --- GUEST EMAIL ---
    To: ${details.to}
    Subject: Booking Confirmation - Nainagarh Palace
    Dear ${details.name}, your stay for ${details.roomName} (${details.dates}) is confirmed.
    Total: ₹${details.amount.toLocaleString()}
    -------------------
  `);

  return true;
};

export const sendReceptionNotification = async (notif: ReceptionNotification): Promise<boolean> => {
  console.log(`[Email Service] Sending notification to RECEPTION: ${RECEPTION_EMAIL}...`);
  
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log(`
    --- RECEPTION ALERT ---
    To: ${RECEPTION_EMAIL}
    Subject: NEW ${notif.type} Alert
    Guest: ${notif.guestName}
    Details: ${notif.details}
    ${notif.amount ? `Amount: ₹${notif.amount.toLocaleString()}` : ''}
    ${notif.contact ? `Contact: ${notif.contact}` : ''}
    -----------------------
  `);

  return true;
};