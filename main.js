// main.js

// DOM Elements
const canvas = document.getElementById('signature-pad');
const fullNameInput = document.getElementById('fullName');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const colorBoxes = document.querySelectorAll('.color-box');

// Initialize SignaturePad
const signaturePad = new SignaturePad(canvas);

// Default color (black)
let selectedColor = "#000000";
signaturePad.penColor = selectedColor;

/**
 * Determines if a hex color is "light" based on brightness.
 * brightness = (R*299 + G*587 + B*114) / 1000
 * Returns true if brightness > 200 (tweak if desired).
 */
function isLightColor(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 200;
}

/**
 * Update the canvas background for drawing:
 * - White color => black background so white strokes are visible
 * - Other color => white background
 */
function updateCanvasBackground(color) {
  if (isLightColor(color)) {
    canvas.style.backgroundColor = "#000";
  } else {
    canvas.style.backgroundColor = "#fff";
  }
}

/**
 * Update the appearance of the fullNameInput based on selectedColor.
 * - If color is light => black background, text in chosen color
 * - If color is dark => white background, text in chosen color
 */
function updateFullNameInputAppearance(color) {
  if (isLightColor(color)) {
    fullNameInput.style.background = "#000";
    fullNameInput.style.color = color; // e.g. #FFFFFF for white
  } else {
    fullNameInput.style.background = "#fff";
    fullNameInput.style.color = color; // e.g. #000000 for black
  }
}

// Initial setup
updateCanvasBackground(selectedColor);
updateFullNameInputAppearance(selectedColor);

// Handle color box clicks
colorBoxes.forEach(box => {
  box.addEventListener('click', () => {
    // If there's already something drawn, confirm clearing
    if (!signaturePad.isEmpty()) {
      const confirmChange = confirm(
        "Changing color will clear the current signature. Continue?"
      );
      if (!confirmChange) {
        return; // User canceled color change
      }
      // Clear the signature
      signaturePad.clear();
    }

    // Remove 'selected' from all boxes
    colorBoxes.forEach(b => b.classList.remove('selected'));
    // Mark the clicked box as selected
    box.classList.add('selected');

    // Update selected color
    selectedColor = box.getAttribute('data-color');
    signaturePad.penColor = selectedColor;

    // Update the canvas and input box for drawing
    updateCanvasBackground(selectedColor);
    updateFullNameInputAppearance(selectedColor);
  });
});

// Clear button
clearBtn.addEventListener('click', () => {
  signaturePad.clear();
});

// Save button
saveBtn.addEventListener('click', () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
    return;
  }

  const fullName = fullNameInput.value.trim();
  const width = canvas.width;
  const height = canvas.height;

  // Create an offscreen canvas
  // We do NOT fill any background => result is transparent by default
  const extraHeight = fullName ? 30 : 0;
  const combinedCanvas = document.createElement('canvas');
  combinedCanvas.width = width;
  combinedCanvas.height = height + extraHeight;
  const ctx = combinedCanvas.getContext('2d');

  // For all colors except white, we want a transparent background
  // For white, we prompt if user wants black background or transparent
  if (selectedColor.toUpperCase() === "#FFFFFF") {
    // White color => show popup
    const useBlackBg = confirm(
      "You chose white strokes. Click OK for black background, or Cancel for transparent."
    );
    if (useBlackBg) {
      // Fill with black
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height + extraHeight);
    }
    // If user chooses Cancel, do nothing => stays transparent
  } 
  // If not white => remain transparent

  // Draw the signature from the original canvas
  ctx.drawImage(canvas, 0, 0);

  // If a full name is entered, draw it below
  if (fullName) {
    ctx.font = "23px 'Times New Roman', Times, serif";
    ctx.fillStyle = selectedColor; // same stroke color
    ctx.textAlign = "center";
    const textX = width / 2;
    const textY = height + extraHeight - 22;
    ctx.fillText(fullName, textX, textY);
  }

  // Trigger download
  const finalDataURL = combinedCanvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.href = finalDataURL;
  downloadLink.download = fullName ? 'signature_with_name.png' : 'signature.png';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
});
