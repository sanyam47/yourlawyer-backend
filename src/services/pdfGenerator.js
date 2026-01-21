import fs from "fs";
import PDFDocument from "pdfkit";

export function generatePDF(text, outputPath) {
  const doc = new PDFDocument({ margin: 40 });

  doc.pipe(fs.createWriteStream(outputPath));
  doc.fontSize(12).text(text, {
    align: "left",
  });

  doc.end();
}
