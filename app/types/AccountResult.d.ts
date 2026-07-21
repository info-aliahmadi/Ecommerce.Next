enum AccountStatusEnum {
  Succeeded = 0,
  Failed = 1,
  Invalid = 2,
  RequiresTwoFactor = 3,
  IsLockedOut = 4,
  IsNotAllowed = 5,
  RequireConfirmedEmail = 6,
  ErrorExternalProvider = 7,
  NullExternalLoginInfo = 8,
  ExternalLoginFailure = 9,
  InvalidCode = 10,
  OtpSent = 11,
  PhoneNotFound = 12,
}

interface AccountResult {
  succeeded: boolean;
  status: AccountStatusEnum;
  statusDescription: string;
  message: string;
  errors: string[];
}
