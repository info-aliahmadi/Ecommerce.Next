
enum ResultStatusEnum {
  Succeeded = 200,
  Failed = 500,
  InvalidValidation = 501,
  NotFound = 404,
  IsNotAuthorized = 401,
  IsNotAllowed = 502,
  ItsDuplicate = 503,
  ExceptionThrowed = 504,
  FileIsTooLarge = 505,
  FileIsTooSmall = 506,
  RequiresTwoFactor = 507,
  IsLockedOut = 508
}
export default ResultStatusEnum;