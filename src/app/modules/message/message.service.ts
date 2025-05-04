import unlinkImage from '../../utils/unlinkImage';
import { TMessage } from './message.interface';
import Message from './message.mode';

const createMessage = async (payload: Partial<TMessage>) => {
  const result = await Message.create(payload);
  return result;
};

const uploadImage = async (payload: Partial<TMessage>) => {
  return {
    success: true,
    path: payload.image,
  };
};

const deleteImage = async (payload: { path: string }) => {
  const path = `./${payload.path}`;
  await unlinkImage(path as string);
};

export const MessageService = {
  createMessage,
  uploadImage,
  deleteImage,
};
