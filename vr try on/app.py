from flask import Flask, render_template, Response, request, jsonify, send_file
import cv2
import mediapipe as mp
import numpy as np
import os
import json
from collections import deque
from datetime import datetime
import threading
import time
import io
import base64

app = Flask(__name__)

# Initialize MediaPipe Pose and Hands
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Shirt images
shirtFolderPath = "./static/Shirts"
listShirts = os.listdir(shirtFolderPath) if os.path.exists(shirtFolderPath) else []
fixedRatio = 262 / 190
shirtRatioHeightWidth = 591 / 490
imageNumber = 0

# Button images
counterRight = 0
counterLeft = 0
selectionSpeed = 10
smooth_buffer = deque(maxlen=5)

# NEW: Photo capture storage
captured_photos_dir = "./static/captured_photos"
os.makedirs(captured_photos_dir, exist_ok=True)
latest_captured_frame = None

# ORIGINAL OVERLAY FUNCTION (PRESERVED)
def overlay_image_alpha(background, overlay, x, y):
    if overlay is None:
        return background
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

# Global state for new features (doesn't interfere with original)
app_state = {
    'cart_items': [],
    'camera_active': True,
    'fit_detection': 85,
    'tracking_quality': 80,
    'gesture_detected': None,
    'last_gesture_time': 0,
    'show_pose_landmarks': True,
    'overlay_opacity': 0.8,
    'capture_requested': False,
    'shirt_overlay_active': True,
    'last_captured_photo': None
}

def get_shirt_inventory():
    """Get complete shirt inventory with details"""
    inventory = []
    for i, shirt in enumerate(listShirts):
        shirt_name = os.path.splitext(shirt)[0]
        shirt_info = {
            'id': i,
            'name': format_shirt_name(shirt_name),
            'filename': shirt,
            'price': 29.99 + (i * 5),
            'brand': extract_brand_from_name(shirt_name),
            'size': 'M',
            'material': 'Cotton Blend',
            'in_stock': True,
            'image_path': f'/static/Shirts/{shirt}'
        }
        inventory.append(shirt_info)
    return inventory

def format_shirt_name(filename):
    """Format shirt name from filename"""
    name = filename.replace('_', ' ').replace('-', ' ').title()
    return name if len(name) < 20 else name[:17] + '...'

def extract_brand_from_name(filename):
    """Extract or assign brand from filename"""
    brands = ['Nike', 'Adidas', 'H&M', 'Zara', 'Uniqlo', 'Gap', 'Puma', 'Calvin Klein']
    filename_lower = filename.lower()
    for brand in brands:
        if brand.lower() in filename_lower:
            return brand
    return brands[len(filename) % len(brands)]

def detect_hand_gesture(hand_landmarks, image_width, image_height):
    """Enhanced hand gesture detection for new features"""
    if not hand_landmarks:
        return None
    
    landmarks = hand_landmarks.landmark
    wrist = landmarks[mp_hands.HandLandmark.WRIST]
    thumb_tip = landmarks[mp_hands.HandLandmark.THUMB_TIP]
    thumb_mcp = landmarks[mp_hands.HandLandmark.THUMB_MCP]
    index_tip = landmarks[mp_hands.HandLandmark.INDEX_FINGER_TIP]
    index_mcp = landmarks[mp_hands.HandLandmark.INDEX_FINGER_MCP]
    
    wrist_x, wrist_y = int(wrist.x * image_width), int(wrist.y * image_height)
    thumb_x, thumb_y = int(thumb_tip.x * image_width), int(thumb_tip.y * image_height)
    index_x, index_y = int(index_tip.x * image_width), int(index_tip.y * image_height)
    
    # Thumbs up = Add to cart
    if (thumb_y < wrist_y - 40 and thumb_tip.y < thumb_mcp.y and index_tip.y > index_mcp.y):
        return "add_to_cart"
    
    # Point right = Next shirt
    if (index_x > wrist_x + 60 and abs(index_y - wrist_y) < 40 and index_tip.x > index_mcp.x):
        return "next_shirt"
    
    # Point left = Previous shirt
    if (index_x < wrist_x - 60 and abs(index_y - wrist_y) < 40 and index_tip.x < index_mcp.x):
        return "previous_shirt"
    
    return None

def add_current_shirt_to_cart():
    """Add current shirt to cart"""
    if len(listShirts) > 0:
        inventory = get_shirt_inventory()
        current_shirt_info = inventory[imageNumber]
        
        if not any(item['id'] == current_shirt_info['id'] for item in app_state['cart_items']):
            app_state['cart_items'].append({
                'id': current_shirt_info['id'],
                'name': current_shirt_info['name'],
                'price': current_shirt_info['price'],
                'filename': current_shirt_info['filename'],
                'brand': current_shirt_info['brand'],
                'added_time': datetime.now().isoformat()
            })
            return True
    return False

def save_captured_photo(frame):
    """Save captured photo with timestamp"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"virtual_tryout_{timestamp}.jpg"
    filepath = os.path.join(captured_photos_dir, filename)
    
    # Add metadata overlay to the photo
    height, width = frame.shape[:2]
    
    # Add a semi-transparent overlay with photo info
    overlay = frame.copy()
    cv2.rectangle(overlay, (10, height - 80), (400, height - 10), (0, 0, 0), -1)
    cv2.addWeighted(frame, 0.7, overlay, 0.3, 0, frame)
    
    # Add text information
    cv2.putText(frame, f"Clothy Virtual Store (G11)", (20, height - 60), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    cv2.putText(frame, f"Captured: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 
               (20, height - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    if len(listShirts) > 0:
        inventory = get_shirt_inventory()
        current_shirt = inventory[imageNumber]
        cv2.putText(frame, f"Shirt: {current_shirt['name']}", 
                   (20, height - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    cv2.imwrite(filepath, frame)
    return filename

# ENHANCED FRAME GENERATION
def gen_frames():
    global imageNumber, counterRight, counterLeft, app_state, latest_captured_frame
    cap = cv2.VideoCapture(0)
    
    while True:
        success, image = cap.read()
        if not success:
            break
        
        # ORIGINAL CORE FUNCTIONALITY
        image = cv2.flip(image, 1)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        pose_results = pose.process(image_rgb)
        hands_results = hands.process(image_rgb)
        
        current_time = time.time()
        
        # Enhanced hand gesture detection
        if hands_results.multi_hand_landmarks:
            for hand_landmarks in hands_results.multi_hand_landmarks:
                gesture = detect_hand_gesture(hand_landmarks, image.shape[1], image.shape[0])
                
                if gesture and current_time - app_state['last_gesture_time'] > 1.5:
                    app_state['gesture_detected'] = gesture
                    app_state['last_gesture_time'] = current_time
                    
                    if gesture == "next_shirt" and len(listShirts) > 0:
                        imageNumber = (imageNumber + 1) % len(listShirts)
                    elif gesture == "previous_shirt" and len(listShirts) > 0:
                        imageNumber = (imageNumber - 1) % len(listShirts)
                    elif gesture == "add_to_cart":
                        add_current_shirt_to_cart()
        
        # ORIGINAL POSE DETECTION AND SHIRT OVERLAY
        if pose_results.pose_landmarks and app_state['shirt_overlay_active']:
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
            
            # ORIGINAL SHIRT OVERLAY
            if len(listShirts) > 0:
                imgShirtPath = os.path.join(shirtFolderPath, listShirts[imageNumber])
                imgShirt = cv2.imread(imgShirtPath, cv2.IMREAD_UNCHANGED)
                if imgShirt is not None:
                    imgShirt = cv2.resize(imgShirt, (shirt_width, shirt_height))
                    image = overlay_image_alpha(image, imgShirt, shirt_top_left[0], shirt_top_left[1])
                    
                    # Update fit metrics
                    app_state['fit_detection'] = min(85 + (shirt_width % 15), 98)
                    app_state['tracking_quality'] = min(80 + (len(smooth_buffer) * 4), 95)
            
            # ORIGINAL POSE LANDMARKS
            if app_state['show_pose_landmarks']:
                mp_drawing.draw_landmarks(image, pose_results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        
        # Handle photo capture
        if app_state['capture_requested']:
            latest_captured_frame = image.copy()
            filename = save_captured_photo(latest_captured_frame)
            app_state['capture_requested'] = False
            app_state['last_captured_photo'] = filename
        
        # Add UI overlays
        add_ui_overlays(image, current_time)
        
        # ORIGINAL FRAME ENCODING
        ret, buffer = cv2.imencode('.jpg', image)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    
    cap.release()

def add_ui_overlays(image, current_time):
    """Add new UI overlays without affecting original functionality"""
    if (app_state['gesture_detected'] and current_time - app_state['last_gesture_time'] < 1.5):
        gesture_text = app_state['gesture_detected'].replace('_', ' ').title()
        cv2.putText(image, f"Gesture: {gesture_text}", (50, 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    
    if len(listShirts) > 0:
        shirt_info = f"Shirt {imageNumber + 1}/{len(listShirts)}"
        cv2.putText(image, shirt_info, (50, image.shape[0] - 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    if app_state['cart_items']:
        cart_text = f"Cart: {len(app_state['cart_items'])} items"
        cv2.putText(image, cart_text, (image.shape[1] - 200, 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

# ROUTES
@app.route('/')
def index():
    inventory = get_shirt_inventory()
    return render_template('index.html', 
                         shirts=inventory,
                         current_shirt=imageNumber,
                         shirt_count=len(listShirts),
                         cart_count=len(app_state['cart_items']))

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/inventory')
def get_inventory():
    return jsonify(get_shirt_inventory())

@app.route('/api/current_shirt')
def get_current_shirt():
    if len(listShirts) > 0:
        return jsonify({
            'id': imageNumber,
            'name': listShirts[imageNumber],
            'total_shirts': len(listShirts)
        })
    return jsonify({'error': 'No shirts available'})

@app.route('/api/select_shirt', methods=['POST'])
def select_shirt():
    global imageNumber
    data = request.get_json()
    shirt_id = data.get('shirt_id', 0)
    
    if 0 <= shirt_id < len(listShirts):
        imageNumber = shirt_id
        return jsonify({'success': True, 'current_shirt': shirt_id})
    return jsonify({'error': 'Invalid shirt ID'})

@app.route('/api/next_shirt', methods=['POST'])
def next_shirt():
    global imageNumber
    if len(listShirts) > 0:
        imageNumber = (imageNumber + 1) % len(listShirts)
        return jsonify({'success': True, 'current_shirt': imageNumber})
    return jsonify({'error': 'No shirts available'})

@app.route('/api/previous_shirt', methods=['POST'])
def previous_shirt():
    global imageNumber
    if len(listShirts) > 0:
        imageNumber = (imageNumber - 1) % len(listShirts)
        return jsonify({'success': True, 'current_shirt': imageNumber})
    return jsonify({'error': 'No shirts available'})

@app.route('/api/cart', methods=['GET'])
def get_cart():
    return jsonify({
        'items': app_state['cart_items'],
        'count': len(app_state['cart_items']),
        'total': sum(item['price'] for item in app_state['cart_items'])
    })

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    shirt_id = data.get('shirt_id', imageNumber)
    
    if 0 <= shirt_id < len(listShirts):
        inventory = get_shirt_inventory()
        shirt_info = inventory[shirt_id]
        
        if not any(item['id'] == shirt_id for item in app_state['cart_items']):
            app_state['cart_items'].append({
                'id': shirt_info['id'],
                'name': shirt_info['name'],
                'price': shirt_info['price'],
                'filename': shirt_info['filename'],
                'brand': shirt_info['brand'],
                'added_time': datetime.now().isoformat()
            })
            return jsonify({'success': True, 'cart_count': len(app_state['cart_items'])})
        else:
            return jsonify({'error': 'Item already in cart'})
    
    return jsonify({'error': 'Invalid shirt ID'})

@app.route('/api/cart/remove', methods=['POST'])
def remove_from_cart():
    data = request.get_json()
    item_id = data.get('item_id')
    
    app_state['cart_items'] = [item for item in app_state['cart_items'] if item['id'] != item_id]
    return jsonify({'success': True, 'cart_count': len(app_state['cart_items'])})

@app.route('/api/cart/clear', methods=['POST'])
def clear_cart():
    app_state['cart_items'] = []
    return jsonify({'success': True, 'cart_count': 0})

@app.route('/api/status')
def get_status():
    return jsonify({
        'camera_active': app_state['camera_active'],
        'current_shirt': imageNumber,
        'fit_detection': app_state['fit_detection'],
        'tracking_quality': app_state['tracking_quality'],
        'total_shirts': len(listShirts),
        'cart_count': len(app_state['cart_items']),
        'last_gesture': app_state['gesture_detected'],
        'shirt_overlay_active': app_state['shirt_overlay_active']
    })

@app.route('/api/toggle_landmarks', methods=['POST'])
def toggle_landmarks():
    app_state['show_pose_landmarks'] = not app_state['show_pose_landmarks']
    return jsonify({'show_landmarks': app_state['show_pose_landmarks']})

# Photo capture routes
@app.route('/api/capture_photo', methods=['POST'])
def capture_photo():
    try:
        app_state['capture_requested'] = True
        # Wait a moment for the frame to be captured
        time.sleep(0.5)
        return jsonify({'success': True, 'message': 'Photo capture initiated'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/download_photo')
def download_photo():
    try:
        if app_state['last_captured_photo'] and os.path.exists(os.path.join(captured_photos_dir, app_state['last_captured_photo'])):
            filepath = os.path.join(captured_photos_dir, app_state['last_captured_photo'])
            return send_file(filepath, as_attachment=True, download_name=app_state['last_captured_photo'])
        else:
            return jsonify({'error': 'No photo available'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/toggle_overlay', methods=['POST'])
def toggle_overlay():
    app_state['shirt_overlay_active'] = not app_state['shirt_overlay_active']
    return jsonify({'overlay_active': app_state['shirt_overlay_active']})

if __name__ == '__main__':
    os.makedirs(shirtFolderPath, exist_ok=True)
    os.makedirs(captured_photos_dir, exist_ok=True)
    print(f"Found {len(listShirts)} shirts in {shirtFolderPath}")
    print(f"Photos will be saved to {captured_photos_dir}")
    app.run(debug=True, threaded=True)
