document.getElementById("video-upload-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("video-file");
    const uploadStatus = document.getElementById("upload-status");
    const uploadedVideo = document.getElementById("uploaded-video");

    const formData = new FormData();
    formData.append("video", fileInput.files[0]);

    fetch("/upload", {
        method: "POST",
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            uploadStatus.innerHTML = "Video uploaded successfully!";
            uploadedVideo.src = data.videoUrl;
            uploadedVideo.style.display = "block";
        } else {
            uploadStatus.innerHTML = "Failed to upload video.";
        }
    })
    .catch((error) => {
        uploadStatus.innerHTML = "Error: " + error.message;
    });
});
