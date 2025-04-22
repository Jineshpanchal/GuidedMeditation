// This script requires the 'sharp' package
// Install it using: npm install sharp --save-dev

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '../public/icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Function to convert SVG to PNG
async function convertSvgToPng(size) {
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  if (!fs.existsSync(svgPath)) {
    console.log(`SVG icon for size ${size}x${size} not found. Skipping.`);
    return;
  }

  try {
    const svgBuffer = fs.readFileSync(svgPath);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    
    console.log(`Converted: icon-${size}x${size}.svg -> icon-${size}x${size}.png`);
  } catch (error) {
    console.error(`Error converting size ${size}x${size}:`, error);
  }
}

// Convert all sizes
async function convertAllIcons() {
  console.log('Starting SVG to PNG conversion...');
  
  for (const size of sizes) {
    await convertSvgToPng(size);
  }
  
  console.log('\nConversion complete!');
  console.log('If you encountered any errors, make sure you have installed the sharp package:');
  console.log('npm install sharp --save-dev');
}

// Run the conversion
convertAllIcons(); 