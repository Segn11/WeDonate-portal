import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'admin123';

const hashPassword = async (plainPassword: string) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Plain password:', plainPassword);
  console.log('Hashed password:', hash);
};

hashPassword(password).catch(console.error);
