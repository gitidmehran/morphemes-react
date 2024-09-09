import { http } from "../../https";

type Data = {
  rootWord: string;
  wordId: string;
};

const getAllMatchingWords = async (data: Data) =>
  await http.post(`/words-by-wordid`, data);

export { getAllMatchingWords };
