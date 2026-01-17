export const generateOTP = (length = 6): string => {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .slice(0, length);
};

export const isOTPExpired = (createdAt: Date, expiryMinutes = 10): boolean => {
  const expiryTime = new Date(createdAt.getTime() + expiryMinutes * 60 * 1000);
  return new Date() > expiryTime;
};
