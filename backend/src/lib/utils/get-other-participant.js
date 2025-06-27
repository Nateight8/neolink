// Helper function to get the other participant in a conversation
export const getOtherParticipant = (conversationId, currentUserId) => {
  const participants = conversationId.split("-");
  return participants.find((id) => id !== currentUserId) || participants[0];
};
