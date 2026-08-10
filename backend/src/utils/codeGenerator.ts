export const generateRequestNumber = (): string => {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `REQ-${year}-${randomDigits}`;
};

export const generateDonationNumber = (): string => {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `DON-${year}-${randomDigits}`;
};

export const generateDistributionNumber = (): string => {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `DIST-${year}-${randomDigits}`;
};

export const generateReceiptVerificationCode = (kebeleName?: string): string => {
  const year = new Date().getFullYear();
  const kebeleMatch = kebeleName?.match(/\d+/);
  const kebeleNum = kebeleMatch ? kebeleMatch[0].padStart(2, '0') : '05';
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `ADM-K${kebeleNum}-${year}-${randomDigits}`;
};
