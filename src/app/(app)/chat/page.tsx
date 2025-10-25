import ChatClient from './chat-client';

export default function ChatPage() {
  // In a real application, you would fetch the authenticated user's
  // phone number from your database (e.g., Firestore).
  const mockFarmerPhone = '+919999999999'; // Replace with a real number for testing

  return (
    <div>
      <ChatClient farmerPhone={mockFarmerPhone} />
    </div>
  );
}
