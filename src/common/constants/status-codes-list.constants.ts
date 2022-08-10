export const EStatusCodesList = {
  authorizedAccess: 1000,
  success: 1001,
  validationError: 1002,
  internalServerError: 1003,
  notFound: 1004,
  unauthorizedAccess: 1005,
  tokenExpired: 1006,
  tooManyTries: 1007,
  serviceUnAvailable: 1008,
  throttleError: 1009,
  forbidden: 1010,
  incorrectOldPassword: 1011,
  userInactive: 1012,
  badRequest: 1013,
  invalidCredentials: 1014,
  invalidRefreshToken: 1015,
  unsupportedFileType: 1016,
  otpRequired: 1017,
  deleteDefaultError: 1018,
  refreshTokenExpired: 1019,
} as const