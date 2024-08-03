export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    console.log(`Original file size: ${file.size} bytes`);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set the canvas size
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log(`Compressed file size: ${blob.size} bytes`); // Log compressed size
              console.log(
                `Size reduction: ${(
                  ((file.size - blob.size) / file.size) *
                  100
                ).toFixed(2)}%`
              );
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/jpeg",
          0.9
        ); // (0.9 = 90% quality)
      };
    };
    reader.onerror = (error) => reject(error);
  });
}
