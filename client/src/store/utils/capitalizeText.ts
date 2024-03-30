export const capitalizeText = (str: string) => {
  return str.split(" ").join("").charAt(0).toUpperCase() + str.slice(1);
};
