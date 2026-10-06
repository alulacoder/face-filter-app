const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const canvasCtx = canvasElement.getContext('2d');
const loadingMessage = document.getElementById('loadingMessage');
const surpriseEffect = document.getElementById('surpriseEffect');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'none';
let time = 0; // For animations

// UI Controls
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
    });
});

function dist(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Drawing Functions

function drawClown(landmarks, w, h) {
    const nose = landmarks[4];
    const leftCheek = landmarks[205];
    const rightCheek = landmarks[425];
    const topLip = landmarks[13];
    const bottomLip = landmarks[14];
    
    // Clown White Makeup (Around mouth)
    canvasCtx.beginPath();
    canvasCtx.ellipse(((topLip.x + bottomLip.x)/2)*w, ((topLip.y + bottomLip.y)/2)*h, 40, 30, 0, 0, 2*Math.PI);
    canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    canvasCtx.fill();

    // Red Lips
    canvasCtx.beginPath();
    canvasCtx.ellipse(((topLip.x + bottomLip.x)/2)*w, ((topLip.y + bottomLip.y)/2)*h, 25, 10, 0, 0, 2*Math.PI);
    canvasCtx.fillStyle = '#ff0000';
    canvasCtx.fill();

    // Big Red Nose
    canvasCtx.beginPath();
    canvasCtx.arc(nose.x * w, nose.y * h, 25, 0, 2 * Math.PI);
    
    // Nose highlight for 3D effect
    let gradient = canvasCtx.createRadialGradient(nose.x*w - 5, nose.y*h - 5, 2, nose.x*w, nose.y*h, 25);
    gradient.addColorStop(0, '#ff9999');
    gradient.addColorStop(1, '#8B0000');
    
    canvasCtx.fillStyle = gradient;
    canvasCtx.fill();
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'darkred';
    canvasCtx.stroke();
    
    // Colorful Cheeks
    canvasCtx.beginPath();
    canvasCtx.arc(leftCheek.x * w, leftCheek.y * h, 20, 0, 2 * Math.PI);
    canvasCtx.arc(rightCheek.x * w, rightCheek.y * h, 20, 0, 2 * Math.PI);
    canvasCtx.fillStyle = 'rgba(255, 20, 147, 0.7)';
    canvasCtx.fill();
    
    // Clown Hat (triangle on top of head)
    const forehead = landmarks[10];
    canvasCtx.beginPath();
    canvasCtx.moveTo(forehead.x * w - 30, forehead.y * h - 20);
    canvasCtx.lineTo(forehead.x * w + 30, forehead.y * h - 20);
    canvasCtx.lineTo(forehead.x * w, forehead.y * h - 100);
    canvasCtx.fillStyle = '#1e90ff';
    canvasCtx.fill();
    
    // Hat pompom
    canvasCtx.beginPath();
    canvasCtx.arc(forehead.x * w, forehead.y * h - 100, 15, 0, 2*Math.PI);
    canvasCtx.fillStyle = 'yellow';
    canvasCtx.fill();
}

function drawNeon(landmarks, w, h) {
    canvasCtx.save();
    canvasCtx.shadowBlur = 15;
    const colors = ['#ff00ff', '#00ffff', '#00ff00'];
    const color = colors[Math.floor((time / 10) % colors.length)];
    canvasCtx.shadowColor = color;
    drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color: color, lineWidth: 1.5});
    canvasCtx.restore();
}

function drawAlien(landmarks, w, h) {
    // Fill the face with translucent green
    canvasCtx.save();
    canvasCtx.beginPath();
    // Trace the face oval
    for(let i=0; i<FACEMESH_FACE_OVAL.length; i++) {
        const point = landmarks[FACEMESH_FACE_OVAL[i][0]];
        if(i===0) canvasCtx.moveTo(point.x*w, point.y*h);
        else canvasCtx.lineTo(point.x*w, point.y*h);
    }
    canvasCtx.closePath();
    canvasCtx.fillStyle = 'rgba(50, 255, 50, 0.4)'; // Green skin
    canvasCtx.fill();
    
    // Draw huge gradient eyes
    const leftEye = landmarks[159]; 
    const rightEye = landmarks[386]; 
    
    const eyeGradL = canvasCtx.createRadialGradient(leftEye.x*w, leftEye.y*h, 5, leftEye.x*w, leftEye.y*h, 30);
    eyeGradL.addColorStop(0, '#333');
    eyeGradL.addColorStop(1, '#000');
    
    const eyeGradR = canvasCtx.createRadialGradient(rightEye.x*w, rightEye.y*h, 5, rightEye.x*w, rightEye.y*h, 30);
    eyeGradR.addColorStop(0, '#333');
    eyeGradR.addColorStop(1, '#000');

    canvasCtx.beginPath();
    canvasCtx.ellipse(leftEye.x * w - 5, leftEye.y * h + 10, 30, 50, Math.PI / 5, 0, 2 * Math.PI);
    canvasCtx.fillStyle = eyeGradL;
    canvasCtx.fill();
    
    canvasCtx.beginPath();
    canvasCtx.ellipse(rightEye.x * w + 5, rightEye.y * h + 10, 30, 50, -Math.PI / 5, 0, 2 * Math.PI);
    canvasCtx.fillStyle = eyeGradR;
    canvasCtx.fill();
    
    canvasCtx.restore();
}

function drawParty(landmarks, w, h) {
    const leftEye = landmarks[33]; 
    const rightEye = landmarks[263];
    const nose = landmarks[4];
    const eyeDist = (rightEye.x - leftEye.x) * w;
    const gWidth = eyeDist * 2.5;
    const gHeight = gWidth * 0.45;
    const cX = ((leftEye.x + rightEye.x) / 2) * w;
    const cY = ((leftEye.y + rightEye.y) / 2) * h;
    
    canvasCtx.save();
    canvasCtx.translate(cX, cY);
    
    // Rotating star glasses!
    canvasCtx.rotate(Math.sin(time/10) * 0.1);
    
    // Funky frames
    canvasCtx.beginPath();
    canvasCtx.roundRect(-gWidth/2, -gHeight/2, gWidth, gHeight, 20);
    canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    canvasCtx.fill();
    canvasCtx.lineWidth = 8;
    canvasCtx.strokeStyle = 'hsl(' + (time*5 % 360) + ', 100%, 50%)'; // Rainbow stroke
    canvasCtx.stroke();
    
    canvasCtx.restore();
    
    // Confetti on nose
    canvasCtx.beginPath();
    canvasCtx.arc(nose.x*w, nose.y*h, 10, 0, 2*Math.PI);
    canvasCtx.fillStyle = 'yellow';
    canvasCtx.fill();
}

function drawCyberpunk(landmarks, w, h) {
    const rightEye = landmarks[263];
    const leftCheek = landmarks[205];
    const forehead = landmarks[10];
    const jaw = landmarks[152];
    
    // Tactical Visor over left eye
    const leftEye = landmarks[33];
    canvasCtx.beginPath();
    canvasCtx.rect(leftEye.x*w - 30, leftEye.y*h - 15, 60, 30);
    canvasCtx.fillStyle = 'rgba(0, 255, 255, 0.6)';
    canvasCtx.fill();
    canvasCtx.strokeStyle = '#00ffff';
    canvasCtx.lineWidth = 2;
    canvasCtx.stroke();
    
    // Targetting Reticle over right eye
    canvasCtx.beginPath();
    canvasCtx.arc(rightEye.x * w, rightEye.y * h, 20, 0, 2 * Math.PI);
    canvasCtx.strokeStyle = '#ff003c';
    canvasCtx.lineWidth = 3;
    canvasCtx.setLineDash([10, 5]);
    canvasCtx.stroke();
    canvasCtx.setLineDash([]);
    canvasCtx.beginPath();
    canvasCtx.arc(rightEye.x * w, rightEye.y * h, 5, 0, 2 * Math.PI);
    canvasCtx.fillStyle = '#ff003c';
    canvasCtx.shadowBlur = 20;
    canvasCtx.shadowColor = '#ff003c';
    canvasCtx.fill();
    canvasCtx.shadowBlur = 0;
    
    // Circuit Lines on Cheeks
    canvasCtx.beginPath();
    canvasCtx.moveTo(landmarks[103].x * w, landmarks[103].y * h);
    canvasCtx.lineTo(landmarks[67].x * w, landmarks[67].y * h);
    canvasCtx.lineTo(landmarks[109].x * w, landmarks[109].y * h);
    canvasCtx.lineTo(landmarks[109].x * w - 20, landmarks[109].y * h + 20);
    canvasCtx.strokeStyle = '#fcee0a';
    canvasCtx.lineWidth = 3;
    canvasCtx.stroke();

    // Data stream on forehead
    canvasCtx.fillStyle = '#00ff00';
    canvasCtx.font = "14px Courier";
    canvasCtx.fillText("UPLINK SECURE", forehead.x*w - 40, forehead.y*h - 10);
    canvasCtx.fillText("MEM: 99%", forehead.x*w - 40, forehead.y*h + 5);
}

function drawCat(landmarks, w, h) {
    const nose = landmarks[4];
    const leftForehead = landmarks[54];
    const rightForehead = landmarks[284];
    
    // Cute Nose
    canvasCtx.beginPath();
    canvasCtx.ellipse(nose.x * w, nose.y * h, 12, 8, 0, 0, 2*Math.PI);
    canvasCtx.fillStyle = '#ff6699';
    canvasCtx.fill();
    
    // Ears
    canvasCtx.beginPath();
    canvasCtx.moveTo(leftForehead.x * w, leftForehead.y * h);
    canvasCtx.lineTo(leftForehead.x * w - 20, leftForehead.y * h - 50);
    canvasCtx.lineTo(leftForehead.x * w + 20, leftForehead.y * h - 20);
    canvasCtx.fillStyle = '#333';
    canvasCtx.fill();
    canvasCtx.beginPath();
    canvasCtx.moveTo(leftForehead.x * w, leftForehead.y * h);
    canvasCtx.lineTo(leftForehead.x * w - 10, leftForehead.y * h - 35);
    canvasCtx.lineTo(leftForehead.x * w + 10, leftForehead.y * h - 15);
    canvasCtx.fillStyle = 'pink';
    canvasCtx.fill();
    
    canvasCtx.beginPath();
    canvasCtx.moveTo(rightForehead.x * w, rightForehead.y * h);
    canvasCtx.lineTo(rightForehead.x * w + 20, rightForehead.y * h - 50);
    canvasCtx.lineTo(rightForehead.x * w - 20, rightForehead.y * h - 20);
    canvasCtx.fillStyle = '#333';
    canvasCtx.fill();
    canvasCtx.beginPath();
    canvasCtx.moveTo(rightForehead.x * w, rightForehead.y * h);
    canvasCtx.lineTo(rightForehead.x * w + 10, rightForehead.y * h - 35);
    canvasCtx.lineTo(rightForehead.x * w - 10, rightForehead.y * h - 15);
    canvasCtx.fillStyle = 'pink';
    canvasCtx.fill();
    
    // Whiskers
    canvasCtx.strokeStyle = '#fff';
    canvasCtx.lineWidth = 3;
    canvasCtx.lineCap = 'round';
    
    const leftCheek = landmarks[205];
    const rightCheek = landmarks[425];
    
    // Left
    canvasCtx.beginPath(); canvasCtx.moveTo(leftCheek.x*w, leftCheek.y*h); canvasCtx.lineTo(leftCheek.x*w - 50, leftCheek.y*h - 10); canvasCtx.stroke();
    canvasCtx.beginPath(); canvasCtx.moveTo(leftCheek.x*w, leftCheek.y*h+10); canvasCtx.lineTo(leftCheek.x*w - 55, leftCheek.y*h + 10); canvasCtx.stroke();
    canvasCtx.beginPath(); canvasCtx.moveTo(leftCheek.x*w, leftCheek.y*h+20); canvasCtx.lineTo(leftCheek.x*w - 50, leftCheek.y*h + 30); canvasCtx.stroke();
    
    // Right
    canvasCtx.beginPath(); canvasCtx.moveTo(rightCheek.x*w, rightCheek.y*h); canvasCtx.lineTo(rightCheek.x*w + 50, rightCheek.y*h - 10); canvasCtx.stroke();
    canvasCtx.beginPath(); canvasCtx.moveTo(rightCheek.x*w, rightCheek.y*h+10); canvasCtx.lineTo(rightCheek.x*w + 55, rightCheek.y*h + 10); canvasCtx.stroke();
    canvasCtx.beginPath(); canvasCtx.moveTo(rightCheek.x*w, rightCheek.y*h+20); canvasCtx.lineTo(rightCheek.x*w + 50, rightCheek.y*h + 30); canvasCtx.stroke();
}

function drawBandit(landmarks, w, h) {
    const leftEyeOut = landmarks[33];
    const rightEyeOut = landmarks[263];
    const nose = landmarks[197];
    
    // Dark mask covering eyes
    canvasCtx.beginPath();
    canvasCtx.moveTo(leftEyeOut.x*w - 20, leftEyeOut.y*h - 20);
    canvasCtx.lineTo(rightEyeOut.x*w + 20, rightEyeOut.y*h - 20);
    canvasCtx.lineTo(rightEyeOut.x*w + 30, rightEyeOut.y*h + 30);
    canvasCtx.lineTo(nose.x*w, nose.y*h + 10);
    canvasCtx.lineTo(leftEyeOut.x*w - 30, leftEyeOut.y*h + 30);
    canvasCtx.closePath();
    
    // Add a dark cloth texture pattern
    canvasCtx.fillStyle = 'rgba(15, 15, 15, 0.95)';
    canvasCtx.fill();
    canvasCtx.lineWidth = 4;
    canvasCtx.strokeStyle = 'black';
    canvasCtx.stroke();
}

function drawRobot(landmarks, w, h) {
    canvasCtx.save();
    
    // Robotic Plating Overlay
    canvasCtx.globalCompositeOperation = 'color-burn';
    canvasCtx.fillStyle = 'rgba(100, 150, 200, 0.5)';
    canvasCtx.beginPath();
    for(let i=0; i<FACEMESH_FACE_OVAL.length; i++) {
        const p = landmarks[FACEMESH_FACE_OVAL[i][0]];
        if(i===0) canvasCtx.moveTo(p.x*w, p.y*h);
        else canvasCtx.lineTo(p.x*w, p.y*h);
    }
    canvasCtx.fill();
    canvasCtx.globalCompositeOperation = 'source-over';
    
    // Draw rigid mesh
    drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color: '#88aaff', lineWidth: 0.5});
    
    // Robot Jaw joint
    const jawLeft = landmarks[132];
    const jawRight = landmarks[361];
    canvasCtx.beginPath(); canvasCtx.arc(jawLeft.x*w, jawLeft.y*h, 15, 0, 2*Math.PI); canvasCtx.fillStyle = '#333'; canvasCtx.fill();
    canvasCtx.beginPath(); canvasCtx.arc(jawRight.x*w, jawRight.y*h, 15, 0, 2*Math.PI); canvasCtx.fillStyle = '#333'; canvasCtx.fill();
    
    // Glowing forehead core
    const forehead = landmarks[10];
    canvasCtx.beginPath();
    canvasCtx.arc(forehead.x*w, forehead.y*h, 10, 0, 2*Math.PI);
    canvasCtx.fillStyle = '#00ffcc';
    canvasCtx.shadowBlur = 15;
    canvasCtx.shadowColor = '#00ffcc';
    canvasCtx.fill();
    canvasCtx.shadowBlur = 0;
    
    canvasCtx.restore();
}


let faceResults = null;

function onFaceResults(results) {
    faceResults = results;
    loadingMessage.style.display = 'none';
    
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        
        const topLip = landmarks[13];
        const botLip = landmarks[14];
        const mouthDist = dist(topLip, botLip);
        
        const leftEye = landmarks[159];
        const leftEyebrow = landmarks[105];
        const browDist = dist(leftEye, leftEyebrow);
        
        const leftCheek = landmarks[234];
        const rightCheek = landmarks[454];
        const tilt = Math.abs(leftCheek.y - rightCheek.y);
        
        let surpriseText = "";
        let bgColor = "";
        
        if (mouthDist > 0.05) {
            surpriseText = "🔥 FIRE BREATHING! 🔥";
            bgColor = "linear-gradient(45deg, rgba(255,50,0,0.4), rgba(255,150,0,0.4))";
        } else if (browDist > 0.06) {
            surpriseText = "🤯 MIND BLOWN! 🤯";
            bgColor = "linear-gradient(45deg, rgba(138,43,226,0.4), rgba(75,0,130,0.4))";
        } else if (tilt > 0.1) {
            surpriseText = "🌀 DIZZY GLITCH! 🌀";
            bgColor = "linear-gradient(45deg, rgba(0,255,255,0.4), rgba(255,0,255,0.4))";
        }
        
        if (surpriseText) {
            surpriseEffect.innerHTML = surpriseText;
            surpriseEffect.style.background = bgColor;
            surpriseEffect.classList.remove('surprise-hidden');
            surpriseEffect.classList.add('surprise-active');
        } else {
            surpriseEffect.classList.remove('surprise-active');
            surpriseEffect.classList.add('surprise-hidden');
        }
    } else {
        surpriseEffect.classList.remove('surprise-active');
        surpriseEffect.classList.add('surprise-hidden');
    }
}


// Render loop
async function render() {
    time++;
    
    if (!videoElement.videoWidth) {
        requestAnimationFrame(render);
        return;
    }
    
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    const w = canvasElement.width;
    const h = canvasElement.height;
    
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, w, h);
    canvasCtx.drawImage(videoElement, 0, 0, w, h);
    
    if (faceResults && faceResults.multiFaceLandmarks && faceResults.multiFaceLandmarks.length > 0) {
        const landmarks = faceResults.multiFaceLandmarks[0];
        if (currentFilter === 'clown') drawClown(landmarks, w, h);
        else if (currentFilter === 'neon') drawNeon(landmarks, w, h);
        else if (currentFilter === 'alien') drawAlien(landmarks, w, h);
        else if (currentFilter === 'party') drawParty(landmarks, w, h);
        else if (currentFilter === 'cyberpunk') drawCyberpunk(landmarks, w, h);
        else if (currentFilter === 'cat') drawCat(landmarks, w, h);
        else if (currentFilter === 'bandit') drawBandit(landmarks, w, h);
        else if (currentFilter === 'robot') drawRobot(landmarks, w, h);
    }
    
    canvasCtx.restore();
    requestAnimationFrame(render);
}

const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
faceMesh.onResults(onFaceResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
  },
  width: 640,
  height: 480
});

camera.start();
render();
