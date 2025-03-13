import { TMessage } from './message.interface';
import Message from './message.mode';

const createMessage = async (payload: Partial<TMessage>) => {
  const result = await Message.create(payload);
  return result;
};

export const MessageService = {
  createMessage,
};
