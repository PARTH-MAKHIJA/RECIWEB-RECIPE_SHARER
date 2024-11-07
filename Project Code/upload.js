// document.getElementById("video-upload-form").addEventListener("submit", function (e) {
//     e.preventDefault();

//     const fileInput = document.getElementById("video-file");
//     const uploadStatus = document.getElementById("upload-status");
//     const uploadedVideo = document.getElementById("uploaded-video");

//     const formData = new FormData();
//     formData.append("video", fileInput.files[0]);

//     fetch("/upload", {
//         method: "POST",
//         body: formData,
//     })
//     .then((response) => response.json())
//     .then((data) => {
//         if (data.success) {
//             uploadStatus.innerHTML = "Video uploaded successfully!";
//             uploadedVideo.src = data.videoUrl;
//             uploadedVideo.style.display = "block";
//         } else {
//             uploadStatus.innerHTML = "Failed to upload video.";
//         }
//     })
//     .catch((error) => {
//         uploadStatus.innerHTML = "Error: " + error.message;
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
    const videoUploadForm = document.getElementById("video-upload-form");
    const fileInput = document.getElementById("video-file");
    const uploadStatus = document.getElementById("upload-status");
    const uploadedVideo = document.getElementById("uploaded-video");
    const videoPreview = document.getElementById("video-preview");
    const deleteVideoButton = document.getElementById("delete-video");

    const startCameraButton = document.getElementById("start-camera");
    const stopCameraButton = document.getElementById("stop-camera");
    const cameraFeed = document.getElementById("camera-feed");

    const storedVideosSection = document.getElementById("stored-videos");

    // Function to display video from localStorage
    const displayStoredVideos = () => {
        storedVideosSection.innerHTML = ""; // Clear existing videos
        const videos = JSON.parse(localStorage.getItem("uploadedVideos")) || [];

        videos.forEach((videoSrc, index) => {
            const videoElement = document.createElement("video");
            videoElement.src = videoSrc;
            videoElement.controls = true;
            videoElement.title = `Uploaded Video ${index + 1}`;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-button");
            deleteBtn.style.marginTop = "5px";
            deleteBtn.addEventListener("click", () => {
                deleteStoredVideo(index);
            });

            const videoContainer = document.createElement("div");
            videoContainer.style.display = "flex";
            videoContainer.style.flexDirection = "column";
            videoContainer.style.alignItems = "center";
            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(deleteBtn);

            storedVideosSection.appendChild(videoContainer);
        });
    };

    // Function to delete a stored video
    const deleteStoredVideo = (index) => {
        let videos = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
        videos.splice(index, 1);
        localStorage.setItem("uploadedVideos", JSON.stringify(videos));
        displayStoredVideos();
    };

    // Handle video upload form submission
    videoUploadForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            uploadStatus.textContent = "Please select a video file.";
            return;
        }

        // Show loading status
        uploadStatus.textContent = "Uploading...";

        const reader = new FileReader();
        reader.onload = function () {
            const videoDataUrl = reader.result;

            // Simulate upload by storing in localStorage
            let videos = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
            videos.push(videoDataUrl);
            localStorage.setItem("uploadedVideos", JSON.stringify(videos));

            // Update UI
            uploadStatus.textContent = "Video uploaded successfully!";
            uploadedVideo.src = videoDataUrl;
            uploadedVideo.style.display = "block";
            deleteVideoButton.style.display = "inline-block";

            // Reset form
            videoUploadForm.reset();

            // Refresh stored videos
            displayStoredVideos();
        };

        reader.onerror = function () {
            uploadStatus.textContent = "Error reading file.";
        };

        reader.readAsDataURL(file);
    });

    // Handle delete button click
    deleteVideoButton.addEventListener("click", () => {
        uploadedVideo.pause();
        uploadedVideo.src = "";
        uploadedVideo.style.display = "none";
        deleteVideoButton.style.display = "none";

        // Remove the last uploaded video from localStorage
        let videos = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
        videos.pop();
        localStorage.setItem("uploadedVideos", JSON.stringify(videos));

        uploadStatus.textContent = "Video deleted.";
        displayStoredVideos();
    });

    // Camera Feature
    let cameraStream = null;

    startCameraButton.addEventListener("click", async () => {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraFeed.srcObject = cameraStream;
            cameraFeed.style.display = "block";
            startCameraButton.style.display = "none";
            stopCameraButton.style.display = "inline-block";
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Unable to access the camera. Please check permissions.");
        }
    });

    stopCameraButton.addEventListener("click", () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            cameraFeed.srcObject = null;
        }
        cameraFeed.style.display = "none";
        startCameraButton.style.display = "inline-block";
        stopCameraButton.style.display = "none";
    });

    // Initial display of stored videos
    displayStoredVideos();
});
