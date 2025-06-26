import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProfileService } from './profile.service';
import { TAuthUser } from '../../interface/authUser';
import { MulterFile } from '../../middleware/imageConverter';

const getMyProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.getMyProfile(req.user as TAuthUser);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile fetched successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { profileId } = req.params;
  if (req.file) {
    req.body.profileImage = req.file.path;
  }

  const fields = ['profileImage', 'companyLogo'];

  const files = req.files as { [fieldname: string]: MulterFile[] };

  for (const field of fields) {
    if (files[field]) {
      req.body[field] = files[field][0].path;
    }
  }

  const result = await ProfileService.updateProfile(profileId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Profile updated successfully',
    data: result,
  });
});

const editProfile = catchAsync(async (req, res) => {
  const { profileId } = req.params;

  const result = await ProfileService.editProfile(profileId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Profile updated successfully',
    data: result,
  });
});

export const ProfileController = {
  getMyProfile,
  updateProfile,
  editProfile,
};
