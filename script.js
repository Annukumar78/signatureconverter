
document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('image');
    const signatureInput = document.getElementById('image1');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const downloadButton = document.getElementById('btn');
    const updatedButton = document.getElementById('updatedbtn');
    const clearButton = document.getElementById('clearbtn');
    const imageContainer = document.querySelector('.image-contaner');
    const refreshButton = document.querySelector('.refreshbtn'); // Added refresh icon button

    // Add event listeners
    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageUrl = event.target.result;
                const img = new Image();
                img.src = imageUrl;
                img.onload = function () {
                    widthInput.value = img.width;
                    heightInput.value = img.height;
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Generate a capture when the page loads
    refreshCapture();

    // Add event listener to updated button
    updatedButton.addEventListener('click', function () {
        const capture = document.getElementById('capture').value;
        const captureValidate = document.getElementById('capturevalidate').value;
        const customWidth = parseInt(widthInput.value, 10);
        const customHeight = parseInt(heightInput.value, 10);

        if (capture === captureValidate && imageInput.files.length > 0 && signatureInput.files.length > 0) {
            const readerImage = new FileReader();
            const readerSignature = new FileReader();

            readerImage.onload = function (eventImage) {
                const imageUrl = eventImage.target.result;

                readerSignature.onload = function (eventSignature) {
                    const signatureUrl = eventSignature.target.result;
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = 400;
                    canvas.height = 350;

                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    img.src = imageUrl;
                    img.onload = function () {
                        ctx.drawImage(img, 0, 0, 400, 300);

                        const signatureImg = new Image();
                        signatureImg.src = signatureUrl;
                        signatureImg.onload = function () {
                            ctx.drawImage(signatureImg, 0, canvas.height - 120, canvas.width, 80);

                            const newImg = document.createElement('img');
                            newImg.src = canvas.toDataURL('image/png');

                            imageContainer.innerHTML = '';
                            imageContainer.appendChild(newImg);

                            downloadButton.addEventListener('click', function () {
                                const link = document.createElement('a');
                                link.href = canvas.toDataURL('image/png');
                                link.download = 'passport_image.png';
                                link.click();
                            });
                        };
                    };
                };

                readerSignature.readAsDataURL(signatureInput.files[0]);
            };

            readerImage.readAsDataURL(imageInput.files[0]);
        } else {
            alert('Capture validation failed or image/signature not selected!');
        }
    });

    // Add event listener to download button
    downloadButton.addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'passport_image.png';
        link.click();
    });

    // Add event listener to clear button
    clearButton.addEventListener('click', function () {
        imageInput.value = '';
        signatureInput.value = '';
        document.getElementById('capture').value = '';
        document.getElementById('capturevalidate').value = '';
        imageContainer.innerHTML = '';
        widthInput.value = '';
        heightInput.value = '';
        refreshCapture();
    });

    // Add event listener to refresh icon button
    refreshButton.addEventListener('click', function () {
        refreshCapture();
    });

    function refreshCapture() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let capture = '';

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            capture += characters[randomIndex];
        }

        document.getElementById('capture').value = capture;
        document.getElementById('capturevalidate').value = '';
    }
});

