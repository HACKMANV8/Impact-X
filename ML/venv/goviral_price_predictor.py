# goviral_price_predictor.py
import pandas as pd
import pickle
import os

class GoViralPricePredictor:
    def __init__(self, model_path='goviral_trained_model.pkl'):
        """Initialize the price predictor with trained model"""
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.label_encoder = None
        
        # Load the trained model
        try:
            with open(model_path, 'rb') as f:
                model_data = pickle.load(f)
            
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            self.label_encoder = model_data['label_encoder']
            
            print("✅ Model loaded successfully!")
            
        except FileNotFoundError:
            print(f"❌ Model file '{model_path}' not found.")
            print("Please make sure the model file exists in the same directory.")
            exit()
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            exit()
    
    def get_niche_list(self):
        """Get list of available niches"""
        if self.label_encoder:
            return list(self.label_encoder.classes_)
        return []
    
    def predict_price(self, follower_count, avg_views, avg_interactions, 
                     new_followers_rate, accounts_reached, niche):
        """Predict price based on promoter metrics"""
        try:
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
                confidence = "High"
            elif follower_count > 10000:
                confidence = "Medium"
            else:
                confidence = "Good"
            
            return {
                'predicted_price': round(predicted_price, 2),
                'price_range': {
                    'min': round(min_price, 2),
                    'max': round(max_price, 2)
                },
                'confidence': confidence
            }
            
        except Exception as e:
            print(f"❌ Prediction error: {e}")
            return None

def get_user_input():
    """Get input from user with validation"""
    print("\n" + "="*60)
    print("🎯 GoViral - Promotion Price Predictor")
    print("="*60)
    
    # Initialize predictor to get niche list
    predictor = GoViralPricePredictor()
    available_niches = predictor.get_niche_list()
    
    print(f"\n📊 Available Niches: {', '.join(available_niches)}")
    print("\nPlease enter the promoter details:")
    
    # Get follower count
    while True:
        try:
            followers = int(input("\n👥 Enter follower count: "))
            if followers < 1000:
                print("❌ Follower count should be at least 1000")
                continue
            break
        except ValueError:
            print("❌ Please enter a valid number")
    
    # Get average views
    while True:
        try:
            avg_views = int(input("📺 Enter average views per post: "))
            if avg_views < 100:
                print("❌ Average views should be at least 100")
                continue
            break
        except ValueError:
            print("❌ Please enter a valid number")
    
    # Get average interactions
    while True:
        try:
            avg_interactions = int(input("💬 Enter average interactions (likes + comments): "))
            if avg_interactions < 10:
                print("❌ Average interactions should be at least 10")
                continue
            break
        except ValueError:
            print("❌ Please enter a valid number")
    
    # Get new followers rate
    while True:
        try:
            new_followers = int(input("📈 Enter new followers per post: "))
            if new_followers < 0:
                print("❌ New followers cannot be negative")
                continue
            break
        except ValueError:
            print("❌ Please enter a valid number")
    
    # Get accounts reached
    while True:
        try:
            accounts_reached = int(input("🎯 Enter average accounts reached: "))
            if accounts_reached < 100:
                print("❌ Accounts reached should be at least 100")
                continue
            break
        except ValueError:
            print("❌ Please enter a valid number")
    
    # Get niche
    while True:
        niche = input("🏷️ Enter niche: ").strip().lower()
        if niche in available_niches:
            break
        else:
            print(f"❌ Invalid niche. Available options: {', '.join(available_niches)}")
    
    return {
        'follower_count': followers,
        'avg_views': avg_views,
        'avg_interactions': avg_interactions,
        'new_followers_rate': new_followers,
        'accounts_reached': accounts_reached,
        'niche': niche
    }

def display_prediction(prediction, user_input):
    """Display the prediction in a nice format"""
    print("\n" + "="*60)
    print("💰 PRICE PREDICTION RESULTS")
    print("="*60)
    
    print(f"\n📊 PROMOTER PROFILE:")
    print(f"   👥 Followers:          {user_input['follower_count']:,}")
    print(f"   📺 Average Views:      {user_input['avg_views']:,}")
    print(f"   💬 Average Interactions: {user_input['avg_interactions']:,}")
    print(f"   📈 New Followers/Post: {user_input['new_followers_rate']:,}")
    print(f"   🎯 Accounts Reached:   {user_input['accounts_reached']:,}")
    print(f"   🏷️ Niche:              {user_input['niche'].title()}")
    
    print(f"\n💎 PREDICTION:")
    print(f"   💰 Suggested Price:    ₹{prediction['predicted_price']:,.2f}")
    print(f"   📈 Price Range:        ₹{prediction['price_range']['min']:,.2f} - ₹{prediction['price_range']['max']:,.2f}")
    print(f"   ✅ Confidence:         {prediction['confidence']}")
    
    # Additional insights
    engagement_rate = (user_input['avg_interactions'] / user_input['follower_count']) * 100
    print(f"\n📈 ADDITIONAL INSIGHTS:")
    print(f"   📊 Engagement Rate:    {engagement_rate:.2f}%")
    
    # Tier classification
    followers = user_input['follower_count']
    if followers >= 100000:
        tier = "Macro-Influencer"
    elif followers >= 50000:
        tier = "Mid-Tier Influencer"
    elif followers >= 10000:
        tier = "Micro-Influencer"
    else:
        tier = "Nano-Influencer"
    
    print(f"   🏆 Tier:               {tier}")
    
    print("\n" + "="*60)

def main():
    """Main function to run the price predictor"""
    try:
        # Get user input
        user_input = get_user_input()
        
        # Initialize predictor and make prediction
        predictor = GoViralPricePredictor()
        prediction = predictor.predict_price(**user_input)
        
        if prediction:
            # Display results
            display_prediction(prediction, user_input)
            
            # Ask if user wants to predict another price
            while True:
                another = input("\n🔮 Predict another price? (y/n): ").lower().strip()
                if another in ['y', 'yes']:
                    print("\n" + "="*60)
                    main()  # Restart the process
                    break
                elif another in ['n', 'no']:
                    print("\n🎉 Thank you for using GoViral Price Predictor!")
                    break
                else:
                    print("❌ Please enter 'y' or 'n'")
        
    except KeyboardInterrupt:
        print("\n\n👋 Program interrupted. Goodbye!")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")

if __name__ == "__main__":
    main()