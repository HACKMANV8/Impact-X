# goviral_model_trainer_fixed.py
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle
import json

def create_proper_dataset():
    """Create a proper dataset with realistic price distribution"""
    print("🔄 Creating proper dataset with realistic prices...")
    np.random.seed(42)
    
    # Define niches with proper pricing
    niches = ['fashion', 'beauty', 'fitness', 'tech', 'music', 'food', 'travel', 
              'business', 'lifestyle', 'education', 'gaming', 'comedy', 'pets']
    
    niche_multipliers = {
        'fashion': 1.45, 'beauty': 1.50, 'fitness': 1.40, 'tech': 1.35,
        'music': 1.30, 'food': 1.25, 'travel': 1.35, 'business': 1.30,
        'lifestyle': 1.20, 'education': 1.15, 'gaming': 1.10, 'comedy': 1.05, 'pets': 1.08
    }
    
    data = []
    for i in range(1500):
        # Generate realistic follower counts (power law distribution)
        if np.random.random() < 0.6:  # 60% micro-influencers
            followers = int(np.random.lognormal(9.0, 0.8))
        elif np.random.random() < 0.9:  # 30% mid-tier
            followers = int(np.random.lognormal(11.0, 0.7))
        else:  # 10% macro-influencers
            followers = int(np.random.lognormal(13.0, 0.6))
        
        followers = max(1000, min(followers, 2000000))
        
        # Select niche
        niche = np.random.choice(niches)
        
        # Generate correlated metrics with realistic engagement
        engagement_rate = np.random.uniform(0.015, 0.08)
        views_ratio = np.random.uniform(0.5, 1.3)
        reach_ratio = np.random.uniform(0.7, 1.6)
        
        avg_views = int(followers * views_ratio)
        avg_interactions = int(followers * engagement_rate)
        accounts_reached = int(followers * reach_ratio)
        new_followers_rate = int(avg_interactions * np.random.uniform(0.008, 0.025))
        
        # REALISTIC PRICE CALCULATION (not stuck at 500)
        base_price = (followers / 1000) * 15  # ₹15 per 1000 followers base
        
        # Apply niche multiplier
        base_price *= niche_multipliers[niche]
        
        # Engagement bonus
        if engagement_rate > 0.06:
            base_price *= 1.4
        elif engagement_rate > 0.04:
            base_price *= 1.2
        elif engagement_rate > 0.02:
            base_price *= 1.1
            
        # Views bonus
        if views_ratio > 1.1:
            base_price *= 1.15
            
        # Add some market variation
        base_price *= np.random.uniform(0.8, 1.2)
        
        # Ensure reasonable price range
        price = max(800, min(base_price, 100000))
        
        data.append({
            'follower_count': followers,
            'avg_views': avg_views,
            'avg_interactions': avg_interactions,
            'new_followers_rate': new_followers_rate,
            'accounts_reached': accounts_reached,
            'niche': niche,
            'price': price
        })
    
    df = pd.DataFrame(data)
    
    # Encode niche for ML
    label_encoder = LabelEncoder()
    df['niche_encoded'] = label_encoder.fit_transform(df['niche'])
    
    # Save the dataset
    ml_features = ['follower_count', 'avg_views', 'avg_interactions', 
                  'new_followers_rate', 'accounts_reached', 'niche_encoded', 'price']
    ml_df = df[ml_features]
    ml_df.to_csv('goviral_proper_dataset.csv', index=False)
    
    print("✅ Proper dataset created with realistic price distribution!")
    print(f"Price statistics: Min ₹{df['price'].min():.0f}, Max ₹{df['price'].max():.0f}, Mean ₹{df['price'].mean():.0f}")
    
    return ml_df, label_encoder

class GoviralPricePredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoder = None
        self.feature_names = ['follower_count', 'avg_views', 'avg_interactions', 
                             'new_followers_rate', 'accounts_reached', 'niche_encoded']
        self.target_name = 'price'
    
    def explore_data(self, df):
        """Explore the dataset"""
        print("\n🔍 DATASET ANALYSIS")
        print("=" * 50)
        
        print(f"Dataset shape: {df.shape}")
        print(f"\nPrice Statistics:")
        print(f"Min: ₹{df['price'].min():,.0f}")
        print(f"Max: ₹{df['price'].max():,.0f}")
        print(f"Mean: ₹{df['price'].mean():,.0f}")
        print(f"Median: ₹{df['price'].median():,.0f}")
        
        print(f"\nFollower Statistics:")
        print(f"Min: {df['follower_count'].min():,}")
        print(f"Max: {df['follower_count'].max():,}")
        print(f"Mean: {df['follower_count'].mean():,.0f}")
        
        # Check correlation
        print(f"\n📈 Correlation with Price:")
        correlation = df.corr()[self.target_name].sort_values(ascending=False)
        for feature, corr in correlation.items():
            if feature != self.target_name:
                print(f"  {feature:.<25} {corr:>7.3f}")
        
        # Plot price distribution
        plt.figure(figsize=(12, 4))
        
        plt.subplot(1, 2, 1)
        plt.hist(df['price'], bins=50, alpha=0.7, color='skyblue')
        plt.xlabel('Price (₹)')
        plt.ylabel('Frequency')
        plt.title('Price Distribution')
        plt.grid(alpha=0.3)
        
        plt.subplot(1, 2, 2)
        plt.hist(np.log1p(df['price']), bins=50, alpha=0.7, color='lightgreen')
        plt.xlabel('Log(Price)')
        plt.ylabel('Frequency')
        plt.title('Log Price Distribution')
        plt.grid(alpha=0.3)
        
        plt.tight_layout()
        plt.show()
    
    def train_model(self, df):
        """Train the price prediction model"""
        print("\n🤖 TRAINING MODEL")
        print("=" * 50)
        
        # Prepare features and target
        X = df[self.feature_names]
        y = df[self.target_name]
        
        print(f"Features: {', '.join(self.feature_names)}")
        print(f"Target: {self.target_name}")
        print(f"Dataset size: {X.shape[0]} samples")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        print(f"Training set: {X_train.shape[0]} samples")
        print(f"Testing set: {X_test.shape[0]} samples")
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest model
        self.model = RandomForestRegressor(
            n_estimators=150,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        print("\nTraining Random Forest model...")
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate model
        y_pred_train = self.model.predict(X_train_scaled)
        y_pred_test = self.model.predict(X_test_scaled)
        
        # Calculate metrics
        train_r2 = r2_score(y_train, y_pred_train)
        test_r2 = r2_score(y_test, y_pred_test)
        mae = mean_absolute_error(y_test, y_pred_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
        
        # Percentage errors
        percentage_error = (mae / y_test.mean()) * 100
        mape = np.mean(np.abs((y_test - y_pred_test) / y_test)) * 100
        
        print(f"\n📊 MODEL PERFORMANCE:")
        print(f"Training R²:    {train_r2:.4f}")
        print(f"Testing R²:     {test_r2:.4f}")
        print(f"MAE:           ₹{mae:,.2f}")
        print(f"RMSE:          ₹{rmse:,.2f}")
        print(f"MAPE:           {mape:.1f}%")
        print(f"Avg Error:      {percentage_error:.1f}% of average price")
        
        return X_test_scaled, y_test, y_pred_test
    
    def evaluate_model(self, X_test, y_test, y_pred):
        """Evaluate model with visualizations"""
        print("\n📈 MODEL EVALUATION")
        print("=" * 50)
        
        # Plot predictions vs actual
        plt.figure(figsize=(15, 5))
        
        # Plot 1: Actual vs Predicted
        plt.subplot(1, 3, 1)
        plt.scatter(y_test, y_pred, alpha=0.6, color='blue')
        max_val = max(y_test.max(), y_pred.max())
        plt.plot([0, max_val], [0, max_val], 'r--', lw=2)
        plt.xlabel('Actual Price (₹)')
        plt.ylabel('Predicted Price (₹)')
        plt.title('Actual vs Predicted Prices')
        plt.grid(alpha=0.3)
        
        # Plot 2: Residuals
        plt.subplot(1, 3, 2)
        residuals = y_test - y_pred
        plt.scatter(y_pred, residuals, alpha=0.6, color='green')
        plt.axhline(y=0, color='r', linestyle='--')
        plt.xlabel('Predicted Price (₹)')
        plt.ylabel('Residuals (₹)')
        plt.title('Residual Plot')
        plt.grid(alpha=0.3)
        
        # Plot 3: Feature Importance
        plt.subplot(1, 3, 3)
        if hasattr(self.model, 'feature_importances_'):
            importance = self.model.feature_importances_
            feature_importance = pd.DataFrame({
                'feature': self.feature_names,
                'importance': importance
            }).sort_values('importance', ascending=True)
            
            plt.barh(feature_importance['feature'], feature_importance['importance'])
            plt.xlabel('Feature Importance')
            plt.title('Feature Importance')
        
        plt.tight_layout()
        plt.show()
        
        # Print feature importance
        if hasattr(self.model, 'feature_importances_'):
            print("\n🎯 FEATURE IMPORTANCE:")
            for _, row in feature_importance.iterrows():
                print(f"  {row['feature']:.<25} {row['importance']:.4f}")
    
    def save_model(self, filename='goviral_trained_model.pkl'):
        """Save the trained model"""
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'target_name': self.target_name,
            'label_encoder': self.label_encoder
        }
        
        with open(filename, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"\n💾 Model saved as '{filename}'")
    
    def predict_price(self, promoter_data):
        """Predict price for new promoter"""
        if self.model is None:
            print("❌ Model not trained!")
            return None
        
        try:
            # Convert to DataFrame and ensure correct feature order
            input_df = pd.DataFrame([promoter_data])[self.feature_names]
            
            # Scale features
            X_scaled = self.scaler.transform(input_df)
            
            # Predict
            predicted_price = self.model.predict(X_scaled)[0]
            
            # Confidence range based on model performance
            confidence_range = predicted_price * 0.12  # ±12%
            
            return {
                'predicted_price': round(max(500, predicted_price), 2),
                'price_range': {
                    'min': round(max(300, predicted_price - confidence_range), 2),
                    'max': round(predicted_price + confidence_range, 2)
                },
                'confidence': 'high' if promoter_data['follower_count'] > 10000 else 'medium'
            }
        
        except Exception as e:
            print(f"❌ Prediction error: {e}")
            return None

def test_predictions(predictor, label_encoder):
    """Test the trained model with examples"""
    print("\n🎯 TEST PREDICTIONS")
    print("=" * 50)
    
    test_cases = [
        {
            'name': 'Fashion Nano-Influencer',
            'follower_count': 15000,
            'avg_views': 18000,
            'avg_interactions': 750,
            'new_followers_rate': 25,
            'accounts_reached': 22000,
            'niche': 'fashion'
        },
        {
            'name': 'Tech Micro-Influencer', 
            'follower_count': 45000,
            'avg_views': 50000,
            'avg_interactions': 2200,
            'new_followers_rate': 80,
            'accounts_reached': 55000,
            'niche': 'tech'
        },
        {
            'name': 'Fitness Mid-Tier',
            'follower_count': 120000,
            'avg_views': 150000,
            'avg_interactions': 8500,
            'new_followers_rate': 280,
            'accounts_reached': 180000,
            'niche': 'fitness'
        },
        {
            'name': 'Comedy Large Account',
            'follower_count': 350000,
            'avg_views': 450000,
            'avg_interactions': 22000,
            'new_followers_rate': 750,
            'accounts_reached': 500000,
            'niche': 'comedy'
        }
    ]
    
    for case in test_cases:
        print(f"\n🧪 {case['name']}:")
        print(f"   👥 Followers: {case['follower_count']:,}")
        print(f"   📊 Engagement: {case['avg_interactions']:,} interactions")
        print(f"   🏷️ Niche: {case['niche']}")
        
        # Prepare input
        input_data = case.copy()
        niche_encoded = label_encoder.transform([input_data['niche']])[0]
        
        ml_input = {
            'follower_count': input_data['follower_count'],
            'avg_views': input_data['avg_views'],
            'avg_interactions': input_data['avg_interactions'],
            'new_followers_rate': input_data['new_followers_rate'],
            'accounts_reached': input_data['accounts_reached'],
            'niche_encoded': niche_encoded
        }
        
        # Predict
        prediction = predictor.predict_price(ml_input)
        
        if prediction:
            print(f"   💰 Predicted Price: ₹{prediction['predicted_price']:,.2f}")
            print(f"   📈 Price Range: ₹{prediction['price_range']['min']:,.2f} - ₹{prediction['price_range']['max']:,.2f}")
            print(f"   ✅ Confidence: {prediction['confidence']}")

def main():
    """Main training function"""
    print("🚀 GoViral - Fixed Price Prediction Model Trainer")
    print("=" * 60)
    
    # Create proper dataset
    df, label_encoder = create_proper_dataset()
    
    # Initialize and train model
    predictor = GoviralPricePredictor()
    predictor.label_encoder = label_encoder
    
    # Explore data
    predictor.explore_data(df)
    
    # Train model
    X_test, y_test, y_pred = predictor.train_model(df)
    
    # Evaluate model
    predictor.evaluate_model(X_test, y_test, y_pred)
    
    # Save model
    predictor.save_model()
    
    # Test predictions
    test_predictions(predictor, label_encoder)
    
    print("\n" + "=" * 60)
    print("✅ MODEL TRAINING COMPLETED SUCCESSFULLY!")
    print("📁 Files created:")
    print("   - goviral_proper_dataset.csv (Fixed dataset)")
    print("   - goviral_trained_model.pkl (Trained model)")
    print("\n🎯 Your model is now ready to use!")
    
    return predictor, label_encoder

if __name__ == "__main__":
    predictor, label_encoder = main()