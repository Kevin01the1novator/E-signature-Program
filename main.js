// If using modules with a bundler, uncomment the import line below.
// Otherwise, if you're using the global SignaturePad from the script tag, you can remove this line.
// import SignaturePad from 'signature_pad';

const canvas = document.getElementById('signature-pad');
const signaturePad = new SignaturePad(canvas);

// Clear functionality
document.getElementById('clear').addEventListener('click', function () {
  signaturePad.clear();
});

// Save functionality with Full Name overlay if provided
document.getElementById('save').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
    return;
  }

  const fullName = document.getElementById('fullName').value.trim();
  const originalDataURL = signaturePad.toDataURL('image/png');

  // If a full name is provided, create a combined image
  if (fullName !== "") {
    // Get the original canvas dimensions
    const originalCanvas = canvas;
    const width = originalCanvas.width;
    const height = originalCanvas.height;
    // Extra space for the full name text below the signature
    const extraHeight = 30;

    // Create an offscreen canvas to combine signature and text
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = width;
    combinedCanvas.height = height + extraHeight;
    const ctx = combinedCanvas.getContext('2d');

    // Draw the signature image from the original canvas
    ctx.drawImage(originalCanvas, 0, 0);

    // Set up text style: Times New Roman, centered
    ctx.font = "23px 'Times New Roman', Times, serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";

    // Calculate the text position
    const textX = width / 2;
    // Adjust vertical position to be in the middle of the extra space
    const textY = height + extraHeight - 22;

    // Draw the full name on the combined canvas
    ctx.fillText(fullName, textX, textY);

    // Create the combined image data URL
    const combinedDataURL = combinedCanvas.toDataURL('image/png');

    // Create a temporary download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = combinedDataURL;
    downloadLink.download = 'signature_with_name.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } else {
    // If no full name is provided, simply download the signature image
    const downloadLink = document.createElement('a');
    downloadLink.href = originalDataURL;
    downloadLink.download = 'signature.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
});
