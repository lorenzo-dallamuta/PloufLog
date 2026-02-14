/**
 * getRandomArrayElements 
 * @param arr 
 * @param count 
 * @returns a list of length count of randomly selected elements of arr 
 * ( if the length of arr is less than count an array of that length is returned instead )
 */
export const getRandomArrayElements = <T>(arr: T[], count: number): T[] => {
  const result = [];
  const temp = Array.from(arr);
  for (let i = 0; i < count && temp.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * temp.length);
    result.push(temp.splice(randomIndex, 1)[0]);
  }
  return result;
};