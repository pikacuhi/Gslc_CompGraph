const imageInput = document.getElementById("imageInput");
const grayscaleButton = document.getElementById("grayscaleButton");
const blurButton = document.getElementById("blurButton");
const resetButton = document.getElementById("resetButton");
const originalImage = document.getElementById("originalImage");
const editedCanvas = document.getElementById("editedImage");
const preview = document.getElementById("preview");

const ctx = editedCanvas.getContext("2d");
let uploadedImage = null;

// Load image and enable buttons
imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        uploadedImage = img;
        originalImage.src = e.target.result;
        editedCanvas.width = img.width;
        editedCanvas.height = img.height;

        // Enable effect buttons
        grayscaleButton.disabled = false;
        blurButton.disabled = false;
        resetButton.disabled = false;

        // Hide preview initially
        preview.style.display = "none";
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Apply grayscale 
grayscaleButton.addEventListener("click", () => {
  applyEffect("grayscale");
});

// Apply blur effect
blurButton.addEventListener("click", () => {
  applyEffect("blur");
});

// Reset application
resetButton.addEventListener("click", () => {
  uploadedImage = null;
  ctx.clearRect(0, 0, editedCanvas.width, editedCanvas.height);
  originalImage.src = "";
  preview.style.display = "none";
  imageInput.value = null;

  // Disable effect buttons
  grayscaleButton.disabled = true;
  blurButton.disabled = true;
  resetButton.disabled = true;
});

// Apply selected effect and show hasilny
function applyEffect(effect) {
  if (!uploadedImage) return;

  // Clear and draw original image
  ctx.clearRect(0, 0, editedCanvas.width, editedCanvas.height);
  ctx.drawImage(uploadedImage, 0, 0);

  if (effect === "grayscale") {
    const imageData = ctx.getImageData(0, 0, editedCanvas.width, editedCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  } else if (effect === "blur") {
    ctx.filter = "blur(10px)";
    ctx.drawImage(uploadedImage, 0, 0);
    ctx.filter = "none"; // Reset filter stlh drawing
  }

  // Show 
  preview.style.display = "block";
}
