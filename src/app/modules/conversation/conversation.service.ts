import QueryBuilder from '../../QueryBuilder/queryBuilder';
import Message from '../message/message.mode';
import { TConversation } from './conversation.interface';
import Conversation from './conversation.model';

const createConversation = async (
  payload: Partial<TConversation>,
  userId: string,
) => {
  const result = await Conversation.create({ ...payload, senderId: userId });
  return result;
};

const getConversationList = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // Delete conversations where conversationName is null
  await Conversation.deleteMany(
    {
      senderId: userId,
      conversationName: null,
    },
    { new: true },
  );

  // const result = await ;

  const conversationQuery = new QueryBuilder(
    Conversation.find({ senderId: userId }),
    query,
  )
    .search(['conversationName'])
    .paginate()
    .sort();

  const result = await conversationQuery.queryModel;
  const meta = await conversationQuery.countTotal();

  return { result, meta };
};

const getMessageBaseOnConversation = async (conversationId: string) => {
  return await Message.find({ conversationId });
};

// const findUnnamedConversation = async () => {
//     const result = await Conversation.find({
//         conversationName: null
//     });
//     return result;
// }

// setInterval(async () => {
//     const data = await findUnnamedConversation()

//     // await Conversation.deleteMany({
//     //     _id: {
//     //         $in: data.map((item) => item._id)
//     //     }
//     // })
// }, 200000);

export const ConversationService = {
  createConversation,
  getConversationList,
  getMessageBaseOnConversation,
};
