import bcrypt from "bcrypt";

export const hashPassword = async (passwprd) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwprd, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (passwprd, hashedPassword) => {
  return bcrypt.compare(passwprd, hashedPassword);
};