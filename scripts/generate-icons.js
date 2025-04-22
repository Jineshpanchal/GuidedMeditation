const fs = require('fs');
const path = require('path');

// Ensure the icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create simple SVG placeholder icons
const createSvgIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#5a67d8"/>
    <text x="${size/2}" y="${size/2 + 10}" font-family="Arial" font-size="${size/4}" fill="white" text-anchor="middle">BK</text>
  </svg>`;
};

// Sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate the icons
sizes.forEach(size => {
  const svgContent = createSvgIcon(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svgContent);
  console.log(`Created icon-${size}x${size}.svg`);
});

console.log('\nPlaceholder icons generated in public/icons/');
console.log('Important: For production, replace these with proper PNG images of the same sizes.');
console.log('You can convert SVGs to PNGs using tools like SVGOMG, Inkscape, or online converters.'); 