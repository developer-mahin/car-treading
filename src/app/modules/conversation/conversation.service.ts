import mongoose from 'mongoose';
import { TAuthUser } from '../../interface/authUser';
import Conversation from './conversation.model';

const createConversation = async (
  data: { receiverId: string },
  user: TAuthUser,
) => {
  let result
  result = await Conversation.findOne({
    users: { $all: [user.userId, data.receiverId], $size: 2 },
  });

  if (!result) {
    result = await Conversation.create({
      users: [
        user.userId,
        data.receiverId
      ]
    })
  }

  return result

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
        from: "messages",
        let: { convId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$conversationId", "$$convId"] },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ],
        as: "lastMessage",
      },
    },
    {
      $unwind: {
        path: "$lastMessage",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        otherUserId: {
          $filter: {
            input: "$users",
            as: "userId",
            cond: {
              $ne: ["$$userId", new mongoose.Types.ObjectId(String(user.userId))],
            },
          },
        },
      },
    },
    {
      $unwind: "$otherUserId",
    },
    {
      $lookup: {
        from: "users",
        localField: "otherUserId",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $unwind: "$users",
    },

    {
      $lookup: {
        from: "profiles",
        localField: "users.profile",
        foreignField: "_id",
        as: "users.profile",
      },
    },
    {
      $unwind: "$users.profile",
    },
    {
      $project: {
        _id: 1,
        user: {
          firstName: "$users.profile.first_name",
          lastName: "$users.profile.last_name",
          profileImage: "$users.profile.profileImage",
          phoneNumber: "$users.profile.phoneNumber",
          email: "$users.email",
          userId: "$users._id",
        },
        lastMessage: 1
      }
    }
  ]);

  return result;
};

export const ConversationService = {
  createConversation,
  getMyConverSation
};
