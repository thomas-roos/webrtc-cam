let cap = null;
let src = null;
let dst = null;
let gray = null;
let faces = null;
let classifier = null;

// function onOpenCvReady() {
//     // Load face classifier
//     classifier = new cv.CascadeClassifier();
//     let faceCascadeFile = 'models/haarcascade_frontalface_default.xml';

//     utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
//         classifier.load(faceCascadeFile); // Load pre-trained classifier
//     });
// }

function processVideo() {
    try {
        const video = document.querySelector('.remote-view');
        const canvas = document.getElementById('canvasOutput');

        if (!video || video.paused || video.ended) {
            return setTimeout(processVideo, 30);
        }

        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        src = cv.imread(canvas);
        dst = new cv.Mat();
        gray = new cv.Mat();
        faces = new cv.RectVector();

        // Convert to grayscale
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        // Detect faces
        classifier.detectMultiScale(gray, faces, 1.1, 3, 0);

        // Draw rectangles around detected faces
        for (let i = 0; i < faces.size(); ++i) {
            let face = faces.get(i);
            let point1 = new cv.Point(face.x, face.y);
            let point2 = new cv.Point(face.x + face.width, face.y + face.height);
            cv.rectangle(src, point1, point2, [255, 0, 0, 255], 2);
        }

        // Show result
        cv.imshow('canvasOutput', src);

        // Clean up
        src.delete();
        dst.delete();
        gray.delete();
        faces.delete();

        // Continue processing
        setTimeout(processVideo, 30);
    } catch (err) {
        console.error('Error in processVideo:', err);
    }
}

// Add controls for video analysis
function addVideoAnalysisControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.innerHTML = `
        <div class="video-analysis-controls mt-3">
            <button id="startAnalysis" class="btn btn-primary">Start Analysis</button>
            <button id="stopAnalysis" class="btn btn-danger">Stop Analysis</button>
            <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" id="showFaces" checked>
                <label class="form-check-label" for="showFaces">
                    Show Face Detection
                </label>
            </div>
        </div>
    `;

    document.querySelector('#viewer').appendChild(controlsDiv);

    let analysisInterval = null;

    document.getElementById('startAnalysis').addEventListener('click', () => {
        if (!analysisInterval) {
            processVideo();
        }
    });

    document.getElementById('stopAnalysis').addEventListener('click', () => {
        if (analysisInterval) {
            clearTimeout(analysisInterval);
            analysisInterval = null;
        }
    });
}
