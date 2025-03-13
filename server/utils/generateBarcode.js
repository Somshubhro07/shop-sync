// server/utils/generateBarcode.js
const { createCanvas } = require('canvas');
const Barcode = require('barcode');

const generateBarcode = async (code) => {
  const canvas = createCanvas();
  const barcode = new Barcode('code128', {
    data: code, // The barcode code (e.g., product ID)
    width: 200,
    height: 50,
    canvas: canvas,
  });

  return new Promise((resolve, reject) => {
    barcode.saveImage((err) => {
      if (err) {
        reject(err);
      } else {
        const base64Image = canvas.toDataURL('image/png'); // Convert to base64
        resolve(base64Image);
      }
    });
  });
};

module.exports = { generateBarcode };