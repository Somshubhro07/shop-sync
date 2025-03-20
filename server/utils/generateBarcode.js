// server/utils/generateBarcode.js
const bwipjs = require('bwip-js');

const generateBarcode = (text) => {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: 'code128', // Barcode type
        text: text, // Text to encode
        scale: 3, // 3x scaling factor
        height: 10, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: 'center', // Center text
      },
      (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const base64 = buffer.toString('base64');
          resolve(`data:image/png;base64,${base64}`);
        }
      }
    );
  });
};

module.exports = { generateBarcode };