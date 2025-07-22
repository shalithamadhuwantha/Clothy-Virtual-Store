from flask import Flask, render_template, Response, request
import cv2
import mediapipe as mp
import numpy as np
import os
from collections import deque

app = Flask(__name__)

# Initialize MediaPipe Pose and Hands
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Shirt images
shirtFolderPath = "./static/Shirts"
listShirts = os.listdir(shirtFolderPath)
fixedRatio = 262 / 190
shirtRatioHeightWidth = 591 / 490
imageNumber = 0

# Button images
imgButtonRight = cv2.imread("./static/button.png", cv2.IMREAD_UNCHANGED)
imgButtonLeft = cv2.flip(imgButtonRight, 1)
counterRight = 0
counterLeft = 0
selectionSpeed = 10
smooth_buffer = deque(maxlen=5)

def overlay_image_alpha(background, overlay, x, y):
    background_width = background.shape[1]
    background_height = background.shape[0]
    x = max(0, min(x, background_width - 1))
    y = max(0, min(y, background_height - 1))
    h, w = overlay.shape[0], overlay.shape[1]
    if x + w > background_width: w = background_width - x
    if y + h > background_height: h = background_height - y
    if w <= 0 or h <= 0: return background
    overlay = cv2.resize(overlay, (w, h))
    if overlay.shape[2] < 4:
        overlay = np.concatenate([overlay, np.ones((overlay.shape[0], overlay.shape[1], 1), dtype=overlay.dtype) * 255], axis=2)
    overlay_image = overlay[..., :3]
    mask = overlay[..., 3:] / 255.0
    background[y:y+h, x:x+w] = (1.0 - mask) * background[y:y+h, x:x+w] + mask * overlay_image
    return background

def gen_frames():
    global imageNumber, counterRight, counterLeft
    cap = cv2.VideoCapture(0)
    while True:
        success, image = cap.read()
        if not success:
            break
        image = cv2.flip(image, 1)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        pose_results = pose.process(image_rgb)
        hands_results = hands.process(image_rgb)
        if pose_results.pose_landmarks:
            lm11 = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
            lm12 = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
            ih, iw, _ = image.shape
            lm11_px = (int(lm11.x * iw), int(lm11.y * ih))
            lm12_px = (int(lm12.x * iw), int(lm12.y * ih))
            smooth_buffer.append((lm11_px, lm12_px))
            avg_lm11 = tuple(np.mean([p[0] for p in smooth_buffer], axis=0).astype(int))
            avg_lm12 = tuple(np.mean([p[1] for p in smooth_buffer], axis=0).astype(int))
            shirt_width = int(abs(avg_lm11[0] - avg_lm12[0]) * fixedRatio)
            shirt_height = int(shirt_width * shirtRatioHeightWidth)
            shirt_top_left = (
                max(0, min(iw - shirt_width, min(avg_lm11[0], avg_lm12[0]) - int(shirt_width * 0.15))),
                max(0, min(ih - shirt_height, min(avg_lm11[1], avg_lm12[1]) - int(shirt_height * 0.2)))
            )
            imgShirtPath = os.path.join(shirtFolderPath, listShirts[imageNumber])
            imgShirt = cv2.imread(imgShirtPath, cv2.IMREAD_UNCHANGED)
            if imgShirt is not None:
                imgShirt = cv2.resize(imgShirt, (shirt_width, shirt_height))
                image = overlay_image_alpha(image, imgShirt, shirt_top_left[0], shirt_top_left[1])
            mp_drawing.draw_landmarks(image, pose_results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        image = overlay_image_alpha(image, imgButtonRight, image.shape[1] - imgButtonRight.shape[1] - 10,
                                    image.shape[0] // 2 - imgButtonRight.shape[0] // 2)
        image = overlay_image_alpha(image, imgButtonLeft, 10, image.shape[0] // 2 - imgButtonLeft.shape[0] // 2)
        # Hand gesture logic can be added here if desired
        ret, buffer = cv2.imencode('.jpg', image)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    cap.release()

@app.route('/')
def index():
    return render_template('index.html', shirt_count=len(listShirts))

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
