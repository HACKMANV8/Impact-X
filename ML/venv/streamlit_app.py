# streamlit_app.py
import streamlit as st
import requests
import json
import time
from datetime import datetime
import random

# Page configuration
st.set_page_config(
    page_title="GoViral - Influencer Marketing Platform",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #FF6B6B;
        text-align: center;
        margin-bottom: 2rem;
        font-weight: bold;
    }
    .sub-header {
        font-size: 1.8rem;
        color: #4ECDC4;
        margin-bottom: 1rem;
        font-weight: 600;
    }
    .feature-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 15px;
        margin-bottom: 1rem;
        border: none;
    }
    .price-prediction {
        background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .verification-success {
        background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .verification-failed {
        background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .metric-card {
        background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 10px;
        text-align: center;
    }
    .stButton button {
        background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: 600;
    }
    .stButton button:hover {
        background: linear-gradient(135deg, #FF8E8E 0%, #6EFFE8 100%);
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# API Configuration
API_BASE_URL = "http://localhost:5000"

class GoViralAPI:
    def __init__(self, base_url):
        self.base_url = base_url
    
    def health_check(self):
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            return response.status_code == 200, response.json() if response.status_code == 200 else None
        except:
            return False, None
    
    def get_niches(self):
        try:
            response = requests.get(f"{self.base_url}/niches", timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data.get('niches', [])
            return []
        except:
            return []
    
    def predict_price(self, influencer_data):
        try:
            response = requests.post(
                f"{self.base_url}/predict",
                json=influencer_data,
                timeout=10
            )
            return response.json(), response.status_code
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
    
    def start_verification(self, username):
        try:
            response = requests.post(
                f"{self.base_url}/verify/start",
                json={"username": username},
                timeout=10
            )
            return response.json()
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def check_verification(self, username, verification_token):
        try:
            response = requests.post(
                f"{self.base_url}/verify/check",
                json={
                    "username": username,
                    "verification_token": verification_token
                },
                timeout=10
            )
            return response.json()
        except Exception as e:
            return {"verified": False, "message": f"Verification error: {str(e)}"}

def main():
    # Initialize API client
    api = GoViralAPI(API_BASE_URL)
    
    # Check API health
    api_healthy, health_data = api.health_check()
    
    # Header
    st.markdown('<h1 class="main-header">🚀 GoViral - Influencer Marketing Platform</h1>', unsafe_allow_html=True)
    
    # API Status Indicator
    if not api_healthy:
        st.error("⚠️ API Server is not reachable. Please make sure the Flask API is running on localhost:5000")
        st.info("To start the API server, run: `python goviral_api.py`")
        return
    
    # Sidebar navigation - Use session state to track current page
    if 'current_page' not in st.session_state:
        st.session_state.current_page = "Dashboard"
    
    st.sidebar.title("🎯 Navigation")
    
    # Navigation buttons
    if st.sidebar.button("🏠 Dashboard", use_container_width=True):
        st.session_state.current_page = "Dashboard"
    
    if st.sidebar.button("💰 Price Predictor", use_container_width=True):
        st.session_state.current_page = "Price Predictor"
    
    if st.sidebar.button("🔐 Account Verification", use_container_width=True):
        st.session_state.current_page = "Account Verification"
    
    st.sidebar.markdown("---")
    st.sidebar.success("✅ API Server Connected")
    st.sidebar.info("""
    **About GoViral:**
    - AI-powered price prediction
    - Instagram account verification
    - For influencers & brands
    """)
    
    # Display the current page
    if st.session_state.current_page == "Dashboard":
        show_dashboard(api)
    elif st.session_state.current_page == "Price Predictor":
        show_price_predictor(api)
    elif st.session_state.current_page == "Account Verification":
        show_verification(api)

def show_dashboard(api):
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 📈 Platform Overview")
        st.markdown("""
        <div class='feature-card'>
        <h4>🎯 Smart Price Prediction</h4>
        <p>AI-powered pricing for influencer promotions based on engagement metrics, niche, and audience reach.</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("""
        <div class='feature-card'>
        <h4>🔐 Secure Verification</h4>
        <p>Verify Instagram accounts to ensure authenticity and build trust between brands and influencers.</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("### 🚀 Quick Actions")
        
        if st.button("💰 Predict Promotion Price", use_container_width=True):
            st.session_state.current_page = "Price Predictor"
            st.rerun()
            
        if st.button("🔐 Verify Instagram Account", use_container_width=True):
            st.session_state.current_page = "Account Verification"
            st.rerun()
    
    st.markdown("---")
    
    # Statistics with better styling
    col3, col4, col5, col6 = st.columns(4)
    
    with col3:
        st.markdown("""
        <div class='metric-card'>
        <h3>1,234</h3>
        <p>Active Influencers</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class='metric-card'>
        <h3>₹8,456</h3>
        <p>Average Price</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col5:
        st.markdown("""
        <div class='metric-card'>
        <h3>94%</h3>
        <p>Success Rate</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col6:
        st.markdown("""
        <div class='metric-card'>
        <h3>256</h3>
        <p>Campaigns</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Recent Activity
    st.markdown("### 📊 Recent Activity")
    activity_col1, activity_col2 = st.columns(2)
    
    with activity_col1:
        st.info("**New Verification**\n\n@travel_with_me verified successfully!")
        st.info("**Price Prediction**\n\n@fashion_guru: ₹12,450 predicted")
    
    with activity_col2:
        st.success("**Campaign Completed**\n\nTech brand × @tech_reviewer")
        st.warning("**Verification Pending**\n\n@foodie_adventures needs verification")

def show_price_predictor(api):
    st.markdown('<h2 class="sub-header">💰 AI Price Predictor</h2>', unsafe_allow_html=True)
    
    # Get available niches from API
    niches = api.get_niches()
    
    if not niches:
        st.error("Unable to load niches from API. Please check if the API server is running correctly.")
        return
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        with st.form("price_prediction_form"):
            st.subheader("Influencer Metrics")
            
            col1a, col1b = st.columns(2)
            with col1a:
                follower_count = st.number_input("👥 Follower Count", 
                                               min_value=1000, 
                                               max_value=10000000, 
                                               value=1000,
                                               step=1000,
                                               help="Minimum 1000 followers required")
                
                avg_views = st.number_input("📺 Average Views per Post", 
                                          min_value=100, 
                                          max_value=10000000, 
                                          value=100,
                                          step=100,
                                          help="Minimum 100 views required")
                
                avg_interactions = st.number_input("💬 Average Interactions (Likes + Comments)", 
                                                 min_value=10, 
                                                 max_value=1000000, 
                                                 value=10,
                                                 step=10,
                                                 help="Minimum 10 interactions required")
            
            with col1b:
                new_followers_rate = st.number_input("📈 New Followers per Post", 
                                                   min_value=0, 
                                                   max_value=10000, 
                                                   value=0,
                                                   step=1,
                                                   help="Number of new followers gained per post")
                
                accounts_reached = st.number_input("🎯 Accounts Reached per Post", 
                                                 min_value=100, 
                                                 max_value=10000000, 
                                                 value=100,
                                                 step=100,
                                                 help="Minimum 100 accounts reached required")
                
                niche = st.selectbox("🏷️ Niche", niches)
            
            submitted = st.form_submit_button("🚀 Predict Price", use_container_width=True)
    
    with col2:
        st.markdown("### 💡 Tips")
        st.info("""
        **For accurate predictions:**
        - Use recent engagement metrics
        - Select the correct niche category
        - Provide authentic data
        - Update metrics regularly
        """)
        
        # Real-time engagement rate calculation
        if follower_count > 0:
            engagement_rate = (avg_interactions / follower_count) * 100
            st.metric("Current Engagement Rate", f"{engagement_rate:.2f}%")
            
            if engagement_rate > 5:
                st.success("Excellent engagement rate! 🎉")
            elif engagement_rate > 2:
                st.warning("Good engagement rate 👍")
            else:
                st.error("Low engagement - focus on content quality")
    
    if submitted:
        # Validate inputs
        validation_errors = []
        
        if follower_count < 1000:
            validation_errors.append("Follower count must be at least 1000")
        if avg_views < 100:
            validation_errors.append("Average views must be at least 100")
        if avg_interactions < 10:
            validation_errors.append("Average interactions must be at least 10")
        if accounts_reached < 100:
            validation_errors.append("Accounts reached must be at least 100")
        
        if validation_errors:
            for error in validation_errors:
                st.error(error)
            return
        
        # Prepare data for API
        influencer_data = {
            'follower_count': follower_count,
            'avg_views': avg_views,
            'avg_interactions': avg_interactions,
            'new_followers_rate': new_followers_rate,
            'accounts_reached': accounts_reached,
            'niche': niche
        }
        
        with st.spinner("🤖 AI is calculating the optimal price..."):
            # Call API for prediction
            prediction_result, status_code = api.predict_price(influencer_data)
            
            if status_code == 200 and prediction_result.get('status') == 'success':
                display_prediction_results(prediction_result, influencer_data)
            else:
                error_msg = prediction_result.get('message', 'Unknown error occurred')
                st.error(f"❌ Prediction failed: {error_msg}")

def display_prediction_results(prediction_result, user_input):
    st.markdown("---")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("### 📋 Influencer Profile")
        
        col1a, col1b = st.columns(2)
        with col1a:
            st.metric("👥 Followers", f"{user_input['follower_count']:,}")
            st.metric("📺 Average Views", f"{user_input['avg_views']:,}")
            st.metric("📊 Engagement Rate", f"{prediction_result.get('engagement_rate', 0):.2f}%")
        
        with col1b:
            st.metric("🏷️ Niche", user_input['niche'].title())
            st.metric("🎯 Accounts Reached", f"{user_input['accounts_reached']:,}")
            st.metric("📈 New Followers/Post", f"{user_input['new_followers_rate']}")
    
    with col2:
        st.markdown("### 💰 Pricing")
        predicted_price = prediction_result.get('predicted_price', 0)
        price_range = prediction_result.get('price_range', {})
        
        st.markdown(f"""
        <div class='price-prediction'>
        <h2>₹{predicted_price:,.2f}</h2>
        <p>Suggested Price</p>
        <small>Range: ₹{price_range.get('min', 0):,.2f} - ₹{price_range.get('max', 0):,.2f}</small>
        </div>
        """, unsafe_allow_html=True)
        
        confidence = prediction_result.get('confidence', 'good').title()
        st.metric("✅ Confidence", confidence)
    
    # Tier classification
    tier = prediction_result.get('tier', 'nano_influencer')
    tier_display = tier.replace('_', ' ').title()
    tier_emoji = {
        'macro_influencer': '🎖️',
        'mid_tier_influencer': '⭐', 
        'micro_influencer': '🔸',
        'nano_influencer': '💎'
    }.get(tier, '💎')
    
    st.info(f"**{tier_emoji} Influencer Tier:** {tier_display}")
    
    # Additional insights
    st.markdown("### 💡 Campaign Insights")
    insight_col1, insight_col2, insight_col3 = st.columns(3)
    
    with insight_col1:
        if predicted_price > 20000:
            st.success("**Premium Partner**\n\nSuitable for brand campaigns")
        else:
            st.info("**Growth Partner**\n\nGreat for awareness campaigns")
    
    with insight_col2:
        engagement_rate = prediction_result.get('engagement_rate', 0)
        if engagement_rate > 8:
            st.success("**High Engagement**\n\nStrong audience connection")
        else:
            st.warning("**Moderate Engagement**\n\nFocus on content interaction")
    
    with insight_col3:
        if user_input['new_followers_rate'] > 100:
            st.success("**Rapid Growth**\n\nGrowing audience base")
        else:
            st.info("**Stable Audience**\n\nEstablished community")

def show_verification(api):
    st.markdown('<h2 class="sub-header">🔐 Instagram Account Verification</h2>', unsafe_allow_html=True)
    
    tab1, tab2 = st.tabs(["🆕 Start Verification", "📋 Verification Status"])
    
    with tab1:
        st.subheader("New Verification Request")
        
        col1, col2 = st.columns(2)
        
        with col1:
            username = st.text_input("Instagram Username", placeholder="username (without @)")
            if username:
                cleaned_username = username.strip().lstrip('@')
                if cleaned_username != username:
                    st.write(f"Cleaned username: `{cleaned_username}`")
        
        with col2:
            if 'verification_token' not in st.session_state:
                st.session_state.verification_token = None
                st.session_state.current_username = None
            
            if st.button("🔄 Generate Verification Token"):
                if username:
                    with st.spinner("Generating verification token..."):
                        verification_result = api.start_verification(username)
                        if verification_result.get('status') == 'success':
                            st.session_state.verification_token = verification_result['verification_token']
                            st.session_state.current_username = username
                            st.success("✅ Token generated successfully!")
                        else:
                            st.error(f"❌ Failed to generate token: {verification_result.get('message', 'Unknown error')}")
                else:
                    st.warning("Please enter a username first")
            
            if st.session_state.verification_token:
                st.text_input("Verification Token", 
                             value=st.session_state.verification_token, 
                             disabled=True)
        
        if username and st.session_state.verification_token:
            st.markdown("### 📋 Verification Instructions")
            st.info(f"""
            **Step-by-Step Guide:**
            
            1. **Copy this verification code:** 
               ```
               {st.session_state.verification_token}
               ```
            
            2. **Add to your Instagram bio:**
               - 📱 Go to your Instagram Profile
               - ✏️ Tap 'Edit Profile' 
               - 📝 Add the code: `{st.session_state.verification_token}` to your bio
               - 💾 Save changes
            
            3. **Click 'Verify Account' below**
            
            ⚠️ **Important:** Keep the code in your bio until verification is complete!
            """)
            
            if st.button("✅ Verify Account", type="primary", use_container_width=True):
                if username and st.session_state.verification_token:
                    with st.spinner("🔍 Checking Instagram bio for verification token..."):
                        result = api.check_verification(username, st.session_state.verification_token)
                        
                        if result.get("verified"):
                            st.markdown(f"""
                            <div class='verification-success'>
                            <h2>✅ Verification Successful!</h2>
                            <p>Account @{result['username']} has been verified.</p>
                            <p>Token matched: {result.get('found_token', 'N/A')}</p>
                            </div>
                            """, unsafe_allow_html=True)
                            
                            st.balloons()
                            
                            # Show next steps
                            st.success("**Next Steps:** You can now use this verified account for price predictions and campaigns!")
                        else:
                            st.markdown(f"""
                            <div class='verification-failed'>
                            <h2>❌ Verification Failed</h2>
                            <p>{result.get('message', 'Token not found in bio')}</p>
                            </div>
                            """, unsafe_allow_html=True)
                            
                            st.error("""
                            **Troubleshooting tips:**
                            - Make sure you saved the changes to your Instagram bio
                            - Wait a few minutes after saving for changes to propagate
                            - Ensure the token is exactly as shown above
                            - Check that your account is public (required for verification)
                            """)
    
    with tab2:
        st.subheader("Verification Status")
        st.info("""
        **Verification Status Overview**
        - Verified accounts appear here
        - Track verification history
        - Manage verified profiles
        """)
        
        # Placeholder for verification history
        st.warning("No verification history yet. Complete a verification to see status here.")

if __name__ == "__main__":
    main()