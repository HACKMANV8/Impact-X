# goviral_api.py
from flask import Flask, request, jsonify
import pandas as pd
import pickle
import os
from flask_cors import CORS
import random
import requests
import re
import json
import time
from datetime import datetime
from typing import Optional, Dict, Any

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class InstagramVerificationSystem:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0',
        })
    
    def generate_verification_token(self) -> str:
        """Generate a random verification token"""
        token_number = random.randint(100000, 999999)
        return f"GV-{token_number}"
    
    def extract_verification_token(self, username: str) -> Optional[str]:
        """
        Extract verification token from Instagram using multiple methods
        """
        clean_username = self.clean_username(username)
        print(f"🔍 Checking: {clean_username}")
        
        # Method 1: Try direct profile page
        token = self.try_direct_scrape(clean_username)
        if token:
            return token
        
        # Method 2: Try with different user agents
        token = self.try_with_different_agents(clean_username)
        if token:
            return token
        
        # Method 3: Try JSON endpoint (if available)
        token = self.try_json_endpoint(clean_username)
        if token:
            return token
        
        print("❌ All methods failed - profile may be private or blocked")
        return None

    def try_direct_scrape(self, username: str) -> Optional[str]:
        """Try scraping the main profile page"""
        try:
            url = f"https://www.instagram.com/{username}/"
            print(f"   Trying direct scrape: {url}")
            
            response = self.session.get(url, timeout=10)
            
            if response.status_code != 200:
                print(f"   ❌ HTTP {response.status_code}")
                return None
            
            # Try multiple parsing methods
            token = self.parse_shared_data(response.text)
            if token:
                return token
                
            token = self.parse_json_ld(response.text)
            if token:
                return token
                
            token = self.parse_meta_tags(response.text)
            if token:
                return token
                
            token = self.parse_raw_text(response.text)
            if token:
                return token
                
            return None
            
        except Exception as e:
            print(f"   ❌ Direct scrape error: {e}")
            return None

    def try_with_different_agents(self, username: str) -> Optional[str]:
        """Try with different user agents"""
        user_agents = [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ]
        
        for agent in user_agents:
            try:
                self.session.headers['User-Agent'] = agent
                url = f"https://www.instagram.com/{username}/"
                print(f"   Trying with agent: {agent[:50]}...")
                
                response = self.session.get(url, timeout=10)
                
                if response.status_code == 200:
                    token = self.parse_shared_data(response.text)
                    if token:
                        return token
                        
            except Exception as e:
                print(f"   ❌ Agent error: {e}")
                continue
                
        return None

    def try_json_endpoint(self, username: str) -> Optional[str]:
        """Try to access JSON endpoints"""
        try:
            # Try the API-like endpoint
            url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}"
            headers = {
                'X-IG-App-ID': '936619743392459',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
            }
            
            print(f"   Trying JSON endpoint...")
            response = self.session.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                bio = data.get('data', {}).get('user', {}).get('biography', '')
                token = self.find_token_in_text(bio)
                if token:
                    print("   ✅ Found via JSON endpoint!")
                    return token
                    
        except Exception as e:
            print(f"   ❌ JSON endpoint error: {e}")
            
        return None

    def parse_shared_data(self, html: str) -> Optional[str]:
        """Parse window._sharedData"""
        try:
            pattern = r'window\._sharedData\s*=\s*({.+?})\s*;\s*</script>'
            match = re.search(pattern, html, re.DOTALL)
            
            if match:
                data = json.loads(match.group(1))
                # Navigate through the data structure to find bio
                user_data = data.get('entry_data', {}).get('ProfilePage', [{}])[0].get('graphql', {}).get('user', {})
                bio = user_data.get('biography', '')
                
                token = self.find_token_in_text(bio)
                if token:
                    print("   ✅ Found in _sharedData!")
                    return token
                    
        except Exception as e:
            print(f"   ❌ Shared data parse error: {e}")
            
        return None

    def parse_json_ld(self, html: str) -> Optional[str]:
        """Parse JSON-LD data"""
        try:
            pattern = r'<script type="application/ld\+json">\s*({.+?})\s*</script>'
            matches = re.findall(pattern, html, re.DOTALL)
            
            for match in matches:
                try:
                    data = json.loads(match)
                    description = data.get('description', '') or data.get('articleBody', '')
                    token = self.find_token_in_text(description)
                    if token:
                        print("   ✅ Found in JSON-LD!")
                        return token
                except:
                    continue
                    
        except Exception as e:
            print(f"   ❌ JSON-LD parse error: {e}")
            
        return None

    def parse_meta_tags(self, html: str) -> Optional[str]:
        """Parse meta tags for description"""
        try:
            # Meta description
            meta_pattern = r'<meta[^>]*name="description"[^>]*content="([^"]*)"'
            matches = re.findall(meta_pattern, html)
            for desc in matches:
                token = self.find_token_in_text(desc)
                if token:
                    print("   ✅ Found in meta description!")
                    return token
            
            # Open Graph description
            og_pattern = r'<meta[^>]*property="og:description"[^>]*content="([^"]*)"'
            matches = re.findall(og_pattern, html)
            for desc in matches:
                token = self.find_token_in_text(desc)
                if token:
                    print("   ✅ Found in OG description!")
                    return token
                    
        except Exception as e:
            print(f"   ❌ Meta tags parse error: {e}")
            
        return None

    def parse_raw_text(self, html: str) -> Optional[str]:
        """Parse raw text content"""
        try:
            # Remove scripts and styles
            clean_html = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
            clean_html = re.sub(r'<style.*?</style>', '', clean_html, flags=re.DOTALL)
            
            # Get text content
            text = re.sub(r'<[^>]+>', ' ', clean_html)
            text = ' '.join(text.split())
            
            token = self.find_token_in_text(text)
            if token:
                print("   ✅ Found in raw text!")
                return token
                
        except Exception as e:
            print(f"   ❌ Raw text parse error: {e}")
            
        return None

    def clean_username(self, username: str) -> str:
        """Clean username from various formats"""
        username = username.strip().lstrip('@')
        
        if 'instagram.com/' in username:
            match = re.search(r'instagram\.com/([^/?]+)', username)
            if match:
                username = match.group(1)
                
        username = username.split('/')[0].split('?')[0]
        return username

    def find_token_in_text(self, text: str) -> Optional[str]:
        """Find verification token in text"""
        if not text:
            return None
            
        patterns = [
            r'GV-\d{6}',
            r'VERIFY-\d{6}',
            r'CODE-\d{6}',
            r'AUTH-\d{6}',
            r'TOKEN-\d{6}',
            r'[A-Z]{2,4}-\d{4,8}'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                return matches[0].upper()
                
        return None

    def verify_user(self, username: str, expected_token: str) -> Dict[str, Any]:
        """Complete verification process"""
        print(f"🚀 Starting verification for: {username}")
        print(f"🔑 Expected token: {expected_token}")
        
        start_time = time.time()
        found_token = self.extract_verification_token(username)
        verification_time = round(time.time() - start_time, 2)
        
        if found_token and found_token.upper() == expected_token.upper():
            result = {
                "verified": True,
                "username": username,
                "expected_token": expected_token,
                "found_token": found_token,
                "verification_time": verification_time,
                "message": "✅ SUCCESS: Account verified!",
                "timestamp": datetime.now().isoformat()
            }
        else:
            result = {
                "verified": False,
                "username": username,
                "expected_token": expected_token,
                "found_token": found_token,
                "verification_time": verification_time,
                "message": f"❌ FAILED: Token not found. Expected: {expected_token}, Found: {found_token}",
                "timestamp": datetime.now().isoformat()
            }
        
        return result

class GoViralPricePredictor:
    def __init__(self, model_path='goviral_trained_model.pkl'):
        """Initialize the price predictor with trained model"""
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.label_encoder = None
        
        try:
            with open(model_path, 'rb') as f:
                model_data = pickle.load(f)
            
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            self.label_encoder = model_data['label_encoder']
            
            print("✅ Model loaded successfully!")
            
        except FileNotFoundError:
            raise Exception(f"Model file '{model_path}' not found.")
        except Exception as e:
            raise Exception(f"Error loading model: {e}")
    
    def get_niche_list(self):
        """Get list of available niches"""
        if self.label_encoder:
            return list(self.label_encoder.classes_)
        return []
    
    def predict_price(self, follower_count, avg_views, avg_interactions, 
                     new_followers_rate, accounts_reached, niche):
        """Predict price based on promoter metrics"""
        try:
            # Validate niche
            if niche not in self.label_encoder.classes_:
                available_niches = list(self.label_encoder.classes_)
                raise ValueError(f"Invalid niche. Available: {available_niches}")
            
            # Encode niche
            niche_encoded = self.label_encoder.transform([niche])[0]
            
            # Create input data
            input_data = {
                'follower_count': follower_count,
                'avg_views': avg_views,
                'avg_interactions': avg_interactions,
                'new_followers_rate': new_followers_rate,
                'accounts_reached': accounts_reached,
                'niche_encoded': niche_encoded
            }
            
            # Convert to DataFrame with correct feature order
            input_df = pd.DataFrame([input_data])[self.feature_names]
            
            # Scale features
            input_scaled = self.scaler.transform(input_df)
            
            # Predict price
            predicted_price = self.model.predict(input_scaled)[0]
            
            # Calculate confidence range (±12%)
            confidence_range = predicted_price * 0.12
            min_price = max(300, predicted_price - confidence_range)
            max_price = predicted_price + confidence_range
            
            # Determine confidence level
            if follower_count > 50000:
                confidence = "high"
            elif follower_count > 10000:
                confidence = "medium"
            else:
                confidence = "good"
            
            # Calculate engagement rate
            engagement_rate = (avg_interactions / follower_count) * 100
            
            # Determine tier
            if follower_count >= 100000:
                tier = "macro_influencer"
            elif follower_count >= 50000:
                tier = "mid_tier_influencer"
            elif follower_count >= 10000:
                tier = "micro_influencer"
            else:
                tier = "nano_influencer"
            
            return {
                'predicted_price': round(predicted_price, 2),
                'price_range': {
                    'min': round(min_price, 2),
                    'max': round(max_price, 2)
                },
                'confidence': confidence,
                'engagement_rate': round(engagement_rate, 2),
                'tier': tier,
                'status': 'success'
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

# Initialize the predictor and verifier
try:
    predictor = GoViralPricePredictor()
    verifier = InstagramVerificationSystem()
    print("✅ Both predictor and verifier initialized successfully!")
except Exception as e:
    print(f"❌ Failed to initialize: {e}")
    predictor = None
    verifier = None

# Routes
@app.route('/')
def home():
    return jsonify({
        'message': 'GoViral Price Prediction API with Instagram Verification',
        'status': 'active',
        'endpoints': {
            '/predict': 'POST - Predict promotion price',
            '/verify/start': 'POST - Start Instagram verification',
            '/verify/check': 'POST - Check verification status',
            '/niches': 'GET - Get available niches',
            '/health': 'GET - API health check'
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy' if predictor and verifier else 'unhealthy',
        'predictor_loaded': predictor is not None,
        'verifier_loaded': verifier is not None
    })

@app.route('/niches', methods=['GET'])
def get_niches():
    if not predictor:
        return jsonify({'status': 'error', 'message': 'Model not loaded'}), 500
    
    niches = predictor.get_niche_list()
    return jsonify({
        'status': 'success',
        'niches': niches,
        'count': len(niches)
    })

# # Instagram Verification Routes
@app.route('/verify/start', methods=['POST'])
def start_verification():
    if not verifier:
        return jsonify({'status': 'error', 'message': 'Verification system not loaded'}), 500
    
    try:
        data = request.get_json()
        
        if not data or 'username' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Username is required'
            }), 400
        
        username = data['username'].strip()
        if not username:
            return jsonify({
                'status': 'error',
                'message': 'Username cannot be empty'
            }), 400
        
        # Generate verification token
        token = verifier.generate_verification_token()
        
        return jsonify({
            'status': 'success',
            'username': username,
            'verification_token': token,
            'instructions': f"Add this code to your Instagram bio: {token}",
            'steps': [
                "1. Go to your Instagram profile",
                "2. Tap 'Edit Profile'",
                f"3. Add '{token}' to your bio",
                "4. Save changes",
                "5. Click 'Verify Account' to complete"
            ],
            'message': 'Verification token generated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Failed to start verification: {str(e)}'
        }), 500

@app.route('/verify/check', methods=['POST'])
def check_verification():
    if not verifier:
        return jsonify({'status': 'error', 'message': 'Verification system not loaded'}), 500
    
    try:
        data = request.get_json()
        
        required_fields = ['username', 'verification_token']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'status': 'error',
                    'message': f'Missing required field: {field}'
                }), 400
        
        username = data['username'].strip()
        token = data['verification_token'].strip()
        
        if not username or not token:
            return jsonify({
                'status': 'error',
                'message': 'Username and token cannot be empty'
            }), 400
        
        # Perform verification
        result = verifier.verify_user(username, token)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Verification check failed: {str(e)}'
        }), 500

@app.route('/predict', methods=['POST'])
def predict_price():
    if not predictor:
        return jsonify({'status': 'error', 'message': 'Model not loaded'}), 500
    
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'follower_count', 'avg_views', 'avg_interactions',
            'new_followers_rate', 'accounts_reached', 'niche'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'status': 'error',
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Validate data types
        try:
            follower_count = int(data['follower_count'])
            avg_views = int(data['avg_views'])
            avg_interactions = int(data['avg_interactions'])
            new_followers_rate = int(data['new_followers_rate'])
            accounts_reached = int(data['accounts_reached'])
            niche = str(data['niche']).strip().lower()
        except ValueError as e:
            return jsonify({
                'status': 'error',
                'message': 'Invalid data types. All numeric fields should be integers.'
            }), 400
        
        # Validate minimum values
        if follower_count < 1000:
            return jsonify({
                'status': 'error',
                'message': 'Follower count should be at least 1000'
            }), 400
        
        if avg_views < 100:
            return jsonify({
                'status': 'error', 
                'message': 'Average views should be at least 100'
            }), 400
        
        if avg_interactions < 10:
            return jsonify({
                'status': 'error',
                'message': 'Average interactions should be at least 10'
            }), 400
        
        if new_followers_rate < 0:
            return jsonify({
                'status': 'error',
                'message': 'New followers rate cannot be negative'
            }), 400
        
        if accounts_reached < 100:
            return jsonify({
                'status': 'error',
                'message': 'Accounts reached should be at least 100'
            }), 400
        
        # Make prediction
        prediction = predictor.predict_price(
            follower_count=follower_count,
            avg_views=avg_views,
            avg_interactions=avg_interactions,
            new_followers_rate=new_followers_rate,
            accounts_reached=accounts_reached,
            niche=niche
        )
        
        if prediction['status'] == 'error':
            return jsonify(prediction), 400
        
        # Add input data to response
        prediction['input_data'] = {
            'follower_count': follower_count,
            'avg_views': avg_views,
            'avg_interactions': avg_interactions,
            'new_followers_rate': new_followers_rate,
            'accounts_reached': accounts_reached,
            'niche': niche
        }
        
        return jsonify(prediction)
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Internal server error: {str(e)}'
        }), 500

# Combined verification and prediction endpoint
# Combined verification and prediction endpoint
@app.route('/verify-and-predict', methods=['POST'])
def verify_and_predict():
    """Combined endpoint for verification and price prediction"""
    if not predictor or not verifier:
        return jsonify({'status': 'error', 'message': 'Systems not loaded'}), 500
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No JSON data provided'
            }), 400
        
        # First, verify the account
        if 'username' not in data or 'verification_token' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Username and verification_token are required for verification'
            }), 400
        
        username = data['username'].strip()
        token = data['verification_token'].strip()
        
        if not username or not token:
            return jsonify({
                'status': 'error',
                'message': 'Username and verification_token cannot be empty'
            }), 400
        
        print(f"🔐 Starting verification for: {username}")
        
        # Perform verification
        verification_result = verifier.verify_user(username, token)
        
        if not verification_result['verified']:
            return jsonify({
                'status': 'error',
                'message': 'Account verification failed. Please make sure you added the token to your Instagram bio.',
                'verification_details': verification_result
            }), 400
        
        print(f"✅ Account verified: {username}")
        
        # If verified, proceed with prediction
        required_fields = [
            'follower_count', 'avg_views', 'avg_interactions',
            'new_followers_rate', 'accounts_reached', 'niche'
        ]
        
        missing_fields = []
        for field in required_fields:
            if field not in data:
                missing_fields.append(field)
        
        if missing_fields:
            return jsonify({
                'status': 'error',
                'message': f'Missing required fields for prediction: {", ".join(missing_fields)}'
            }), 400
        
        # Validate prediction data
        try:
            follower_count = int(data['follower_count'])
            avg_views = int(data['avg_views'])
            avg_interactions = int(data['avg_interactions'])
            new_followers_rate = int(data['new_followers_rate'])
            accounts_reached = int(data['accounts_reached'])
            niche = str(data['niche']).strip().lower()
        except ValueError as e:
            return jsonify({
                'status': 'error',
                'message': 'Invalid data types for prediction. All numeric fields should be integers.'
            }), 400
        
        # Validate minimum values
        validation_errors = []
        
        if follower_count < 1000:
            validation_errors.append('Follower count should be at least 1000')
        
        if avg_views < 100:
            validation_errors.append('Average views should be at least 100')
        
        if avg_interactions < 10:
            validation_errors.append('Average interactions should be at least 10')
        
        if new_followers_rate < 0:
            validation_errors.append('New followers rate cannot be negative')
        
        if accounts_reached < 100:
            validation_errors.append('Accounts reached should be at least 100')
        
        if validation_errors:
            return jsonify({
                'status': 'error',
                'message': 'Validation errors',
                'errors': validation_errors
            }), 400
        
        print(f"📊 Making prediction for verified account: {username}")
        
        # Make prediction
        prediction = predictor.predict_price(
            follower_count=follower_count,
            avg_views=avg_views,
            avg_interactions=avg_interactions,
            new_followers_rate=new_followers_rate,
            accounts_reached=accounts_reached,
            niche=niche
        )
        
        if prediction['status'] == 'error':
            return jsonify({
                'status': 'error',
                'message': 'Prediction failed',
                'prediction_error': prediction['message']
            }), 400
        
        # Combine results
        combined_result = {
            'status': 'success',
            'message': 'Account verified and price prediction completed successfully',
            'verified_account': username,
            'verification': {
                'verified': verification_result['verified'],
                'username': verification_result['username'],
                'token_matched': verification_result['found_token'] == token,
                'verification_time': verification_result['verification_time']
            },
            'prediction': {
                'predicted_price': prediction['predicted_price'],
                'price_range': prediction['price_range'],
                'confidence': prediction['confidence'],
                'engagement_rate': prediction['engagement_rate'],
                'tier': prediction['tier']
            },
            'input_data': {
                'follower_count': follower_count,
                'avg_views': avg_views,
                'avg_interactions': avg_interactions,
                'new_followers_rate': new_followers_rate,
                'accounts_reached': accounts_reached,
                'niche': niche
            },
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"✅ Combined verification and prediction completed for: {username}")
        
        return jsonify(combined_result)
        
    except Exception as e:
        print(f"❌ Error in verify_and_predict: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Combined verification and prediction failed: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("🚀 Starting GoViral Price Prediction API with Instagram Verification...")
    print("📍 API Endpoints:")
    print("   GET  /                   - API information")
    print("   GET  /health             - Health check")
    print("   GET  /niches             - Get available niches")
    print("   POST /predict            - Predict promotion price")
    print("   POST /verify/start       - Start Instagram verification")
    print("   POST /verify/check       - Check verification status")
    print("   POST /verify-and-predict - Verify account and predict price")
    print("\n📡 Server running on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)