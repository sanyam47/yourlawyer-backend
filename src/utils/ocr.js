import Tesseract from "tesseract.js";

export const extractTextFromImage = async (imagePath) => {
  const result = await Tesseract.recognize(imagePath, "eng", {
    logger: (m) => console.log(m),
  });

  return result.data.text;
};
