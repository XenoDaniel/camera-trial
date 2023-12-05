let stream;
let recorder;
let chunks = [];

async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    document.getElementById('video').srcObject = stream;
  } catch (error) {
    console.error('Error accessing the camera:', error);
  }
}

function toggleCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  } else {
    initCamera();
  }
}

function startRecording() {
  if (stream) {
    recorder = new MediaRecorder(stream);
    chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'recorded-video.webm';
      a.click();
    };

    recorder.start();
  } else {
    console.warn('Cannot start recording. Camera not initialized.');
  }
}

function stopRecording() {
  if (recorder) {
    recorder.stop();
  } else {
    console.warn('Cannot stop recording. Recorder not initialized.');
  }
}

function takePicture() {
  if (stream) {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = img.src;
    a.download = 'captured-image.png';
    a.click();
  } else {
    console.warn('Cannot take picture. Camera not initialized.');
  }
}

initCamera(); // Initialize the camera when the page loads
