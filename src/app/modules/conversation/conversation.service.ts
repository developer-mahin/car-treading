import mongoose from 'mongoose';
import { TAuthUser } from '../../interface/authUser';
import Conversation from './conversation.model';
import Message from '../message/message.mode';

const createConversation = async (
  data: { receiverId: string },
  user: TAuthUser,
) => {
  let result;
  result = await Conversation.findOne({
    users: { $all: [user.userId, data.receiverId], $size: 2 },
  });

  if (!result) {
    result = await Conversation.create({
      users: [user.userId, data.receiverId],
    });
  }

  return result;
};

const getMyConverSation = async (user: TAuthUser) => {
  const result = await Conversation.aggregate([
    {
      $match: {
        users: {
          $all: [new mongoose.Types.ObjectId(String(user.userId))],
        },
      },
    },
    {
      $lookup: {
        from: 'messages',
        let: { convId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$conversationId', '$$convId'] },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ],
        as: 'lastMessage',
      },
    },
    { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        let: { userIds: '$users' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$userIds'],
              },
            },
          },
        ],
        as: 'allUsers',
      },
    },
    {
      $addFields: {
        self: {
          $first: {
            $filter: {
              input: '$allUsers',
              as: 'u',
              cond: {
                $eq: [
                  '$$u._id',
                  new mongoose.Types.ObjectId(String(user.userId)),
                ],
              },
            },
          },
        },
        otherUser: {
          $first: {
            $filter: {
              input: '$allUsers',
              as: 'u',
              cond: {
                $ne: [
                  '$$u._id',
                  new mongoose.Types.ObjectId(String(user.userId)),
                ],
              },
            },
          },
        },
      },
    },
    // Lookup self profile
    {
      $lookup: {
        from: 'profiles',
        localField: 'self.profile',
        foreignField: '_id',
        as: 'self.profile',
      },
    },
    {
      $unwind: {
        path: '$self.profile',
        preserveNullAndEmptyArrays: true,
      },
    },
    // Lookup otherUser profile
    {
      $lookup: {
        from: 'profiles',
        localField: 'otherUser.profile',
        foreignField: '_id',
        as: 'otherUser.profile',
      },
    },
    {
      $unwind: {
        path: '$otherUser.profile',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        users: 0,
        allUsers: 0,
      },
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        lastMessage: 1,
        'self._id': 1,
        'self.profile': 1,
        'otherUser._id': 1,
        'otherUser.profile': 1,
      },
    },
  ]);

  return result;
};

const getConversationMessages = async (conversationId: string) => {
  const result = await Message.aggregate([
    {
      $match: {
        conversationId: new mongoose.Types.ObjectId(String(conversationId)),
      },
    },
  ]);

  return result;
};

export const ConversationService = {
  createConversation,
  getMyConverSation,
  getConversationMessages,
};
