import { USER_ROLE, USER_STATUS } from '../constant';

export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = keyof typeof USER_STATUS;
