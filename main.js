// Remove this line:
// import SignaturePad from 'signature_pad';

const canvas = document.getElementById('signature-pad');
const signaturePad = new SignaturePad(canvas);

// Clear functionality
document.getElementById('clear').addEventListener('click', function () {
  signaturePad.clear();
});

document.getElementById('save').addEventListener('click', function () {
    if (signaturePad.isEmpty()) {
      alert("Please provide a signature first.");
    } else {
      // Get the PNG data URL
      const dataURL = signaturePad.toDataURL('image/png');
      
      // Create a temporary link element
      const downloadLink = document.createElement('a');
      downloadLink.href = dataURL;
      downloadLink.download = 'signature.png';
      
      // Append the link, trigger click, then remove it
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  });
  

console.log("Main.js is loaded, SignaturePad:", SignaturePad);

