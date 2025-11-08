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
from pymongo import MongoClient
from bson import ObjectId
from bson.errors import InvalidId
import requests
from io import BytesIO
from PIL import Image as PILImage
import re

app = Flask(__name__)

# MongoDB Connection
MONGO_URI = "mongodb+srv://group11saalmsrusl:seK8BiD5rPgYg15A@cluster0.ovjz0tq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client['test']
products_collection = db['products']

# Initialize MediaPipe Pose and Hands
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Global variables
fixedRatio = 262 / 190
shirtRatioHeightWidth = 591 / 490
imageNumber = 0
current_product_id = None
product_images = []

# Button images
counterRight = 0
counterLeft = 0
selectionSpeed = 10
smooth_buffer = deque(maxlen=5)

# Photo capture storage
captured_photos_dir = "./static/captured_photos"
upload_folder = "./static/uploads"
os.makedirs(captured_photos_dir, exist_ok=True)
os.makedirs(upload_folder, exist_ok=True)
latest_captured_frame = None

# Global state
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
    'last_captured_photo': None,
    'current_product': None
}


# ============ JSON ENCODER FOR OBJECTID ============

class JSONEncoder(json.JSONEncoder):
    """Custom JSON encoder to handle MongoDB ObjectId"""
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


app.json_encoder = JSONEncoder


# ============ MONGODB FUNCTIONS ============

def get_product_by_any_id(identifier):
    """Get product by productId, _id, or slug"""
    try:
        print(f"\n🔍 Searching for product with identifier: {identifier}")
        
        # Method 1: Try as productId field
        product = products_collection.find_one({'productId': identifier})
        if product:
            print(f"✅ Found by productId field")
            return product
        
        # Method 2: Try as ObjectId
        if len(str(identifier)) == 24:
            try:
                product = products_collection.find_one({'_id': ObjectId(identifier)})
                if product:
                    print(f"✅ Found by MongoDB _id")
                    return product
            except InvalidId:
                pass
        
        # Method 3: Try as slug
        product = products_collection.find_one({'slug': identifier})
        if product:
            print(f"✅ Found by slug field")
            return product
        
        return None
        
    except Exception as e:
        print(f"❌ Error fetching product: {e}")
        return None


def search_products_by_tags(search_query):
    """Search products by tags (color, type, etc.)"""
    try:
        print(f"\n🔎 Searching products with query: {search_query}")
        
        # Normalize search query
        query_lower = search_query.lower().strip()
        
        # Search in multiple fields
        search_filter = {
            '$or': [
                {'tag': {'$regex': query_lower, '$options': 'i'}},
                {'title.en': {'$regex': query_lower, '$options': 'i'}},
                {'description.en': {'$regex': query_lower, '$options': 'i'}},
                {'productId': {'$regex': query_lower, '$options': 'i'}},
            ],
            'status': 'show'
        }
        
        products = list(products_collection.find(search_filter).limit(20))
        
        print(f"✅ Found {len(products)} products")
        return products
        
    except Exception as e:
        print(f"❌ Error searching products: {e}")
        return []


def analyze_image_tags(image_path):
    """
    Analyze uploaded image and extract color/type tags
    This is a simple implementation - you can enhance with ML models
    """
    try:
        # Load image
        img = PILImage.open(image_path)
        img_array = np.array(img)
        
        # Convert to RGB if needed
        if len(img_array.shape) == 2:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)
        elif img_array.shape[2] == 4:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
        
        # Get dominant colors
        pixels = img_array.reshape(-1, 3)
        avg_color = pixels.mean(axis=0)
        
        # Determine color name
        color_name = get_color_name(avg_color)
        
        # Basic shape detection (placeholder - enhance with ML)
        detected_tags = [color_name]
        
        print(f"🎨 Detected tags from image: {detected_tags}")
        return detected_tags
        
    except Exception as e:
        print(f"❌ Error analyzing image: {e}")
        return []


def get_color_name(rgb):
    """Convert RGB to color name"""
    r, g, b = rgb
    
    # Define color ranges
    colors = {
        'red': (200, 50, 50),
        'blue': (50, 50, 200),
        'green': (50, 200, 50),
        'yellow': (200, 200, 50),
        'black': (50, 50, 50),
        'white': (200, 200, 200),
        'orange': (200, 100, 50),
        'purple': (150, 50, 150),
        'pink': (200, 100, 150),
        'brown': (100, 50, 50),
        'gray': (128, 128, 128),
    }
    
    # Find closest color
    min_distance = float('inf')
    closest_color = 'unknown'
    
    for color_name, color_rgb in colors.items():
        distance = np.sqrt(sum((a - b) ** 2 for a, b in zip(rgb, color_rgb)))
        if distance < min_distance:
            min_distance = distance
            closest_color = color_name
    
    return closest_color


def load_product_images(product):
    """Load and process images from MongoDB product"""
    global product_images
    product_images = []
    
    if not product or 'image' not in product:
        print("⚠️  No images found in product")
        return []
    
    images = product['image']
    print(f"\n📷 Loading {len(images)} images...")
    
    for idx, img_url in enumerate(images):
        try:
            print(f"   Loading image {idx + 1}: {img_url[:60]}...")
            response = requests.get(img_url, timeout=10)
            if response.status_code == 200:
                image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
                img = cv2.imdecode(image_array, cv2.IMREAD_UNCHANGED)
                
                if img is not None:
                    if len(img.shape) == 2:
                        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
                    elif img.shape[2] == 3:
                        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
                    product_images.append(img)
                    print(f"   ✅ Loaded successfully")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"✅ Total images loaded: {len(product_images)}")
    return product_images


def get_all_products():
    """Get all products from MongoDB"""
    try:
        products = list(products_collection.find({'status': 'show'}))
        return products
    except Exception as e:
        print(f"Error fetching products: {e}")
        return []


def format_product_for_inventory(product):
    """Format MongoDB product for frontend"""
    try:
        return {
            'id': str(product['_id']),
            'productId': product.get('productId', ''),
            'name': product['title'].get('en', 'Unknown Product') if isinstance(product['title'], dict) else str(product.get('title', 'Unknown Product')),
            'slug': product.get('slug', ''),
            'price': float(product['prices']['price']),
            'original_price': float(product['prices'].get('originalPrice', product['prices']['price'])),
            'discount': float(product['prices'].get('discount', 0)),
            'brand': extract_brand_from_tags(product.get('tag', [])),
            'stock': int(product.get('stock', 0)),
            'images': product.get('image', []),
            'description': product['description'].get('en', '') if isinstance(product.get('description'), dict) else str(product.get('description', '')),
            'categories': [str(cat) if isinstance(cat, ObjectId) else cat for cat in product.get('categories', [])],
            'tags': product.get('tag', []),
            'in_stock': product.get('stock', 0) > 0,
            'sku': product.get('sku', ''),
            'barcode': product.get('barcode', '')
        }
    except Exception as e:
        print(f"❌ Error formatting product: {e}")
        return None


def extract_brand_from_tags(tags):
    """Extract brand from product tags"""
    brands = ['Nike', 'Adidas', 'H&M', 'Zara', 'Uniqlo', 'Gap', 'Puma', 'Calvin Klein', "Levi's"]
    for tag in tags:
        for brand in brands:
            if brand.lower() in str(tag).lower():
                return brand
    return tags[0] if tags else 'Generic'


# ============ OVERLAY & GESTURE FUNCTIONS ============

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


def detect_hand_gesture(hand_landmarks, image_width, image_height):
    """Enhanced hand gesture detection"""
    if not hand_landmarks:
        return None
    
    landmarks = hand_landmarks.landmark
    wrist = landmarks[mp_hands.HandLandmark.WRIST]
    thumb_tip = landmarks[mp_hands.HandLandmark.THUMB_TIP]
    thumb_mcp = landmarks[mp_hands.HandLandmark.THUMB_MCP]
    index_tip = landmarks[mp_hands.HandLandmark.INDEX_FINGER_TIP]
    index_mcp = landmarks[mp_hands.HandLandmark.INDEX_FINGER_MCP]
    
    wrist_x, wrist_y = int(wrist.x * image_width), int(wrist.y * image_height)
    thumb_y = int(thumb_tip.y * image_height)
    index_x = int(index_tip.x * image_width)
    index_y = int(index_tip.y * image_height)
    
    if (thumb_y < wrist_y - 40 and thumb_tip.y < thumb_mcp.y and index_tip.y > index_mcp.y):
        return "add_to_cart"
    
    if (index_x > wrist_x + 60 and abs(index_y - wrist_y) < 40 and index_tip.x > index_mcp.x):
        return "next_shirt"
    
    if (index_x < wrist_x - 60 and abs(index_y - wrist_y) < 40 and index_tip.x < index_mcp.x):
        return "previous_shirt"
    
    return None


def add_current_product_to_cart():
    """Add current product to cart"""
    if app_state['current_product']:
        product_info = format_product_for_inventory(app_state['current_product'])
        
        if product_info and not any(item['id'] == product_info['id'] for item in app_state['cart_items']):
            app_state['cart_items'].append({
                'id': product_info['id'],
                'productId': product_info['productId'],
                'name': product_info['name'],
                'price': product_info['price'],
                'slug': product_info['slug'],
                'brand': product_info['brand'],
                'image': product_info['images'][0] if product_info['images'] else '',
                'added_time': datetime.now().isoformat()
            })
            return True
    return False


def save_captured_photo(frame):
    """Save captured photo with timestamp"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"virtual_tryout_{timestamp}.jpg"
    filepath = os.path.join(captured_photos_dir, filename)
    
    height, width = frame.shape[:2]
    
    overlay = frame.copy()
    cv2.rectangle(overlay, (10, height - 80), (400, height - 10), (0, 0, 0), -1)
    cv2.addWeighted(frame, 0.7, overlay, 0.3, 0, frame)
    
    cv2.putText(frame, f"Clothy Virtual Store", (20, height - 60), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    cv2.putText(frame, f"Captured: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 
               (20, height - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    if app_state['current_product']:
        title = app_state['current_product']['title']
        product_name = title.get('en', 'Product') if isinstance(title, dict) else str(title)
        cv2.putText(frame, f"Product: {product_name}", 
                   (20, height - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    cv2.imwrite(filepath, frame)
    return filename


# ============ VIDEO FRAME GENERATION ============

def gen_frames():
    global imageNumber, counterRight, counterLeft, app_state, latest_captured_frame
    cap = cv2.VideoCapture(0)
    
    while True:
        success, image = cap.read()
        if not success:
            break
        
        image = cv2.flip(image, 1)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        pose_results = pose.process(image_rgb)
        hands_results = hands.process(image_rgb)
        
        current_time = time.time()
        
        if hands_results.multi_hand_landmarks:
            for hand_landmarks in hands_results.multi_hand_landmarks:
                gesture = detect_hand_gesture(hand_landmarks, image.shape[1], image.shape[0])
                
                if gesture and current_time - app_state['last_gesture_time'] > 1.5:
                    app_state['gesture_detected'] = gesture
                    app_state['last_gesture_time'] = current_time
                    
                    if gesture == "next_shirt" and len(product_images) > 0:
                        imageNumber = (imageNumber + 1) % len(product_images)
                    elif gesture == "previous_shirt" and len(product_images) > 0:
                        imageNumber = (imageNumber - 1) % len(product_images)
                    elif gesture == "add_to_cart":
                        add_current_product_to_cart()
        
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
            
            if len(product_images) > 0 and imageNumber < len(product_images):
                imgShirt = product_images[imageNumber].copy()
                imgShirt = cv2.resize(imgShirt, (shirt_width, shirt_height))
                image = overlay_image_alpha(image, imgShirt, shirt_top_left[0], shirt_top_left[1])
                
                app_state['fit_detection'] = min(85 + (shirt_width % 15), 98)
                app_state['tracking_quality'] = min(80 + (len(smooth_buffer) * 4), 95)
            
            if app_state['show_pose_landmarks']:
                mp_drawing.draw_landmarks(image, pose_results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        
        if app_state['capture_requested']:
            latest_captured_frame = image.copy()
            filename = save_captured_photo(latest_captured_frame)
            app_state['capture_requested'] = False
            app_state['last_captured_photo'] = filename
        
        add_ui_overlays(image, current_time)
        
        ret, buffer = cv2.imencode('.jpg', image)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    
    cap.release()


def add_ui_overlays(image, current_time):
    """Add UI overlays"""
    if (app_state['gesture_detected'] and current_time - app_state['last_gesture_time'] < 1.5):
        gesture_text = app_state['gesture_detected'].replace('_', ' ').title()
        cv2.putText(image, f"Gesture: {gesture_text}", (50, 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    
    if len(product_images) > 0:
        img_info = f"Image {imageNumber + 1}/{len(product_images)}"
        cv2.putText(image, img_info, (50, image.shape[0] - 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    if app_state['current_product']:
        product_id = app_state['current_product'].get('productId', 'N/A')
        cv2.putText(image, f"Product ID: {product_id}", (50, image.shape[0] - 90), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
    
    if app_state['cart_items']:
        cart_text = f"Cart: {len(app_state['cart_items'])} items"
        cv2.putText(image, cart_text, (image.shape[1] - 200, 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)


# ============ ROUTES ============

@app.route('/')
def index():
    """Main page - shows all products"""
    products = get_all_products()
    inventory = [format_product_for_inventory(p) for p in products if p]
    
    return render_template('index.html', 
                         products=inventory,
                         product_json=None,
                         current_product=None,
                         cart_count=len(app_state['cart_items']))


@app.route('/product/<identifier>')
def view_product(identifier):
    """View specific product by any ID type"""
    global current_product_id, imageNumber, product_images
    
    print(f"\n{'='*70}")
    print(f"🌐 Request received for product: {identifier}")
    print(f"{'='*70}")
    
    product = get_product_by_any_id(identifier)
    
    if not product:
        print(f"❌ Product not found!")
        return jsonify({
            'error': 'Product not found', 
            'searched_for': identifier
        }), 404
    
    current_product_id = identifier
    app_state['current_product'] = product
    product_images = load_product_images(product)
    imageNumber = 0
    
    product_info = format_product_for_inventory(product)
    
    if not product_info:
        return jsonify({'error': 'Error formatting product data'}), 500
    
    try:
        product_json_str = json.dumps(product_info, cls=JSONEncoder)
        print(f"\n✅ Product data prepared successfully")
    except Exception as e:
        print(f"❌ JSON serialization error: {e}")
        return jsonify({'error': 'JSON serialization error'}), 500
    
    return render_template('index.html', 
                         product=product_info,
                         product_json=product_json_str,
                         image_count=len(product_images),
                         cart_count=len(app_state['cart_items']))


# 🆕 NEW: Image Search Route
@app.route('/search')
def search_page():
    """Image search page"""
    return render_template('search.html', cart_count=len(app_state['cart_items']))


# 🆕 NEW: Text-based search API
@app.route('/api/search', methods=['POST'])
def search_products():
    """Search products by text query"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'No search query provided'}), 400
        
        products = search_products_by_tags(query)
        inventory = [format_product_for_inventory(p) for p in products if p]
        
        return jsonify({
            'success': True,
            'count': len(inventory),
            'products': inventory
        })
        
    except Exception as e:
        print(f"❌ Search error: {e}")
        return jsonify({'error': str(e)}), 500


# 🆕 NEW: Image upload and search
@app.route('/api/search/image', methods=['POST'])
def search_by_image():
    """Search products by uploaded image"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        # Save uploaded image
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"search_{timestamp}_{file.filename}"
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        print(f"📸 Image uploaded: {filepath}")
        
        # Analyze image to extract tags
        detected_tags = analyze_image_tags(filepath)
        
        # Search products with detected tags
        all_products = []
        for tag in detected_tags:
            products = search_products_by_tags(tag)
            all_products.extend(products)
        
        # Remove duplicates
        unique_products = {p['_id']: p for p in all_products}.values()
        inventory = [format_product_for_inventory(p) for p in unique_products if p]
        
        return jsonify({
            'success': True,
            'detected_tags': detected_tags,
            'count': len(inventory),
            'products': inventory
        })
        
    except Exception as e:
        print(f"❌ Image search error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/api/products')
def get_products_api():
    """Get all products"""
    products = get_all_products()
    inventory = [format_product_for_inventory(p) for p in products if p]
    return jsonify(inventory)


@app.route('/api/product/<identifier>')
def get_product_api(identifier):
    """Get product by any ID type"""
    product = get_product_by_any_id(identifier)
    if product:
        product_info = format_product_for_inventory(product)
        return jsonify(product_info) if product_info else jsonify({'error': 'Error formatting product'}), 500
    return jsonify({'error': 'Product not found', 'searched_for': identifier}), 404


@app.route('/api/load_product', methods=['POST'])
def load_product():
    """Load product for virtual try-on by any ID"""
    global current_product_id, imageNumber, product_images
    
    data = request.get_json()
    identifier = data.get('product_id') or data.get('id') or data.get('identifier')
    
    if not identifier:
        return jsonify({'error': 'No identifier provided'}), 400
    
    product = get_product_by_any_id(identifier)
    
    if not product:
        return jsonify({'error': 'Product not found', 'searched_for': identifier}), 404
    
    current_product_id = identifier
    app_state['current_product'] = product
    product_images = load_product_images(product)
    imageNumber = 0
    
    product_info = format_product_for_inventory(product)
    
    return jsonify({
        'success': True, 
        'product': product_info,
        'image_count': len(product_images)
    }) if product_info else jsonify({'error': 'Error formatting product'}), 500


@app.route('/api/select_image', methods=['POST'])
def select_image():
    """Select a specific image index for display"""
    global imageNumber
    
    data = request.get_json()
    image_index = data.get('image_index', 0)
    
    if 0 <= image_index < len(product_images):
        imageNumber = image_index
        return jsonify({'success': True, 'current_image': imageNumber})
    
    return jsonify({'error': 'Invalid image index'}), 400


@app.route('/api/next_image', methods=['POST'])
def next_image():
    global imageNumber
    if len(product_images) > 0:
        imageNumber = (imageNumber + 1) % len(product_images)
        return jsonify({'success': True, 'current_image': imageNumber})
    return jsonify({'error': 'No images available'})


@app.route('/api/previous_image', methods=['POST'])
def previous_image():
    global imageNumber
    if len(product_images) > 0:
        imageNumber = (imageNumber - 1) % len(product_images)
        return jsonify({'success': True, 'current_image': imageNumber})
    return jsonify({'error': 'No images available'})


@app.route('/api/cart', methods=['GET'])
def get_cart():
    return jsonify({
        'items': app_state['cart_items'],
        'count': len(app_state['cart_items']),
        'total': sum(item['price'] for item in app_state['cart_items'])
    })


@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    """Add product to cart by any ID"""
    data = request.get_json()
    identifier = data.get('product_id') or data.get('id') or data.get('identifier')
    
    if not identifier:
        return jsonify({'error': 'No identifier provided'}), 400
    
    product = get_product_by_any_id(identifier)
    
    if product:
        product_info = format_product_for_inventory(product)
        
        if product_info and not any(item['id'] == product_info['id'] for item in app_state['cart_items']):
            app_state['cart_items'].append({
                'id': product_info['id'],
                'productId': product_info['productId'],
                'name': product_info['name'],
                'price': product_info['price'],
                'slug': product_info['slug'],
                'brand': product_info['brand'],
                'image': product_info['images'][0] if product_info['images'] else '',
                'added_time': datetime.now().isoformat()
            })
            return jsonify({'success': True, 'cart_count': len(app_state['cart_items'])})
        else:
            return jsonify({'error': 'Item already in cart'})
    
    return jsonify({'error': 'Product not found'})


@app.route('/api/cart/remove', methods=['POST'])
def remove_from_cart():
    data = request.get_json()
    item_id = data.get('id') or data.get('product_id')
    
    app_state['cart_items'] = [item for item in app_state['cart_items'] if item['id'] != item_id]
    return jsonify({'success': True, 'cart_count': len(app_state['cart_items'])})


@app.route('/api/cart/clear', methods=['POST'])
def clear_cart():
    app_state['cart_items'] = []
    return jsonify({'success': True, 'cart_count': 0})


@app.route('/api/status')
def get_status():
    current_product_name = None
    current_product_id = None
    
    if app_state['current_product']:
        title = app_state['current_product']['title']
        current_product_name = title.get('en', 'Unknown') if isinstance(title, dict) else str(title)
        current_product_id = app_state['current_product'].get('productId', str(app_state['current_product']['_id']))
    
    return jsonify({
        'camera_active': app_state['camera_active'],
        'current_image': imageNumber,
        'total_images': len(product_images),
        'current_product': current_product_name,
        'current_product_id': current_product_id,
        'fit_detection': app_state['fit_detection'],
        'tracking_quality': app_state['tracking_quality'],
        'cart_count': len(app_state['cart_items']),
        'last_gesture': app_state['gesture_detected'],
        'shirt_overlay_active': app_state['shirt_overlay_active']
    })


@app.route('/api/toggle_landmarks', methods=['POST'])
def toggle_landmarks():
    app_state['show_pose_landmarks'] = not app_state['show_pose_landmarks']
    return jsonify({'show_landmarks': app_state['show_pose_landmarks']})


@app.route('/api/capture_photo', methods=['POST'])
def capture_photo():
    try:
        app_state['capture_requested'] = True
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
    os.makedirs(captured_photos_dir, exist_ok=True)
    os.makedirs(upload_folder, exist_ok=True)
    
    try:
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        db_name = db.name
        print(f"📊 Connected to database: '{db_name}'")
        
        products_count = products_collection.count_documents({})
        print(f"📦 Found {products_count} products")
        
        print("\n" + "="*70)
        print("📋 Sample Products:")
        print("="*70)
        sample_products = list(products_collection.find({}).limit(3))
        for idx, p in enumerate(sample_products, 1):
            title = p['title'].get('en', 'Unknown') if isinstance(p.get('title'), dict) else p.get('title', 'Unknown')
            print(f"\n{idx}. {title}")
            print(f"   productId: {p.get('productId', 'N/A')}")
            print(f"   Tags: {p.get('tag', [])}")
        print("="*70)
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
    
    print(f"\n📸 Photos: {captured_photos_dir}")
    print(f"📂 Uploads: {upload_folder}")
    print(f"\n🚀 Server starting...")
    print(f"   Main: http://localhost:5000/")
    print(f"   Search: http://localhost:5000/search")
    app.run(debug=True, threaded=True)
