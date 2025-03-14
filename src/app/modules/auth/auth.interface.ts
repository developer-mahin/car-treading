export type TUserCreateData = {
  first_name: string;
  last_name: string;
  phoneNumber: string;
  address: string;
  email: string;
  regNo: string;
  kontoNr: string;
  websiteLink: string;
  password: string;
  profileImage: string;
  cvrNumber?: string;
  role: 'dealer' | 'private_user';
};

export type TRegister = {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  role: 'dealer' | 'private_user';
  isUseTransport?: boolean;
};
