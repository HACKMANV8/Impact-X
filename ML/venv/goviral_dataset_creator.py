# goviral_dataset_creator.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt

class GoviralDatasetCreator:
    def __init__(self):
        # Define realistic niche distributions
        self.niches = {
            'premium': ['fashion', 'beauty', 'fitness', 'luxury', 'tech'],
            'medium': ['music', 'food', 'travel', 'business', 'lifestyle'],
            'standard': ['education', 'gaming', 'comedy', 'pets', 'memes']
        }
        
        # Base pricing multipliers
        self.niche_multipliers = {
            'fashion': 1.45, 'beauty': 1.50, 'fitness': 1.40, 'luxury': 1.60, 'tech': 1.35,
            'music': 1.30, 'food': 1.25, 'travel': 1.35, 'business': 1.30, 'lifestyle': 1.20,
            'education': 1.15, 'gaming': 1.10, 'comedy': 1.05, 'pets': 1.08, 'memes': 1.00
        }
        
        # Market distribution (some niches are more common)
        self.niche_distribution = {
            'fashion': 0.12, 'beauty': 0.10, 'fitness': 0.08, 'luxury': 0.03, 'tech': 0.07,
            'music': 0.09, 'food': 0.11, 'travel': 0.06, 'business': 0.05, 'lifestyle': 0.10,
            'education': 0.04, 'gaming': 0.06, 'comedy': 0.03, 'pets': 0.04, 'memes': 0.02
        }

    def generate_follower_counts(self, num_samples):
        """Generate realistic follower count distribution"""
        # Instagram follows power law - few large accounts, many small ones
        follower_counts = []
        
        for i in range(num_samples):
            # Use log-normal distribution for realistic follower counts
            if np.random.random() < 0.7:  # 70% are micro-influencers
                followers = int(np.random.lognormal(8.5, 1.0))  # 1K-50K range
            elif np.random.random() < 0.9:  # 20% are mid-tier
                followers = int(np.random.lognormal(10.5, 0.8))  # 50K-500K range
            else:  # 10% are macro-influencers
                followers = int(np.random.lognormal(12.0, 0.6))  # 500K-5M range
            
            followers = max(1000, min(followers, 5000000))  # Reasonable bounds
            follower_counts.append(followers)
            
        return follower_counts

    def generate_correlated_metrics(self, follower_count, niche):
        """Generate views, interactions, etc. that correlate with followers and niche"""
        
        # Base engagement rates by niche
        base_engagement_rates = {
            'fashion': 0.025, 'beauty': 0.028, 'fitness': 0.032, 'luxury': 0.018, 'tech': 0.022,
            'music': 0.035, 'food': 0.030, 'travel': 0.026, 'business': 0.020, 'lifestyle': 0.024,
            'education': 0.019, 'gaming': 0.045, 'comedy': 0.055, 'pets': 0.038, 'memes': 0.065
        }
        
        base_engagement = base_engagement_rates[niche]
        
        # Add some randomness
        engagement_variation = np.random.uniform(0.7, 1.3)
        engagement_rate = base_engagement * engagement_variation
        
        # Generate correlated metrics
        views_ratio = np.random.uniform(0.4, 1.3)  # Views can be more or less than followers
        reach_ratio = np.random.uniform(0.6, 1.8)   # Reach can exceed followers
        
        avg_views = int(follower_count * views_ratio)
        avg_interactions = int(follower_count * engagement_rate)
        accounts_reached = int(follower_count * reach_ratio)
        new_followers_rate = int(avg_interactions * np.random.uniform(0.005, 0.03))
        
        return {
            'avg_views': avg_views,
            'avg_interactions': avg_interactions,
            'accounts_reached': accounts_reached,
            'new_followers_rate': new_followers_rate,
            'engagement_rate': engagement_rate
        }

    def calculate_realistic_price(self, follower_count, metrics, niche):
        """Calculate realistic promotion price based on all factors"""
        
        # Base CPM (Cost Per Thousand followers)
        base_cpm = 12  # ₹12 per 1000 followers base rate
        
        # Apply niche multiplier
        niche_multiplier = self.niche_multipliers[niche]
        base_price = (follower_count / 1000) * base_cpm * niche_multiplier
        
        # Engagement quality bonus
        engagement_rate = metrics['engagement_rate']
        if engagement_rate > 0.06:
            engagement_bonus = 1.5
        elif engagement_rate > 0.04:
            engagement_bonus = 1.3
        elif engagement_rate > 0.02:
            engagement_bonus = 1.1
        else:
            engagement_bonus = 0.9
            
        base_price *= engagement_bonus
        
        # Views performance bonus (if views > followers)
        views_ratio = metrics['avg_views'] / follower_count
        if views_ratio > 1.1:
            base_price *= 1.15
        elif views_ratio > 0.9:
            base_price *= 1.05
            
        # Reach performance bonus
        reach_ratio = metrics['accounts_reached'] / follower_count
        if reach_ratio > 1.2:
            base_price *= 1.1
            
        # Add market randomness
        market_variation = np.random.uniform(0.85, 1.15)
        final_price = base_price * market_variation
        
        # Ensure reasonable minimum and maximum
        final_price = max(500, min(final_price, 500000))
        
        return round(final_price, 2)

    def create_dataset(self, num_samples=1000):
        """Create complete training dataset"""
        
        print("🎯 Creating GoViral Training Dataset...")
        
        data = []
        niches_list = list(self.niche_distribution.keys())
        probabilities = list(self.niche_distribution.values())
        
        # Generate follower counts
        follower_counts = self.generate_follower_counts(num_samples)
        
        for i in range(num_samples):
            if i % 100 == 0:
                print(f"   Generating sample {i}/{num_samples}...")
            
            # Select niche based on market distribution
            niche = np.random.choice(niches_list, p=probabilities)
            follower_count = follower_counts[i]
            
            # Generate correlated metrics
            metrics = self.generate_correlated_metrics(follower_count, niche)
            
            # Calculate realistic price
            price = self.calculate_realistic_price(follower_count, metrics, niche)
            
            # Create data sample
            sample = {
                'follower_count': follower_count,
                'avg_views': metrics['avg_views'],
                'avg_interactions': metrics['avg_interactions'],
                'new_followers_rate': metrics['new_followers_rate'],
                'accounts_reached': metrics['accounts_reached'],
                'niche': niche,
                'price': price
            }
            
            data.append(sample)
        
        df = pd.DataFrame(data)
        print("✅ Dataset created successfully!")
        return df

    def analyze_dataset(self, df):
        """Analyze the created dataset"""
        
        print("\n📊 DATASET ANALYSIS")
        print("=" * 50)
        
        print(f"Total samples: {len(df):,}")
        print(f"Number of niches: {df['niche'].nunique()}")
        
        print("\n💰 Price Statistics:")
        print(f"Min price: ₹{df['price'].min():,.2f}")
        print(f"Max price: ₹{df['price'].max():,.2f}")
        print(f"Average price: ₹{df['price'].mean():,.2f}")
        print(f"Median price: ₹{df['price'].median():,.2f}")
        
        print("\n👥 Follower Statistics:")
        print(f"Min followers: {df['follower_count'].min():,}")
        print(f"Max followers: {df['follower_count'].max():,}")
        print(f"Average followers: {df['follower_count'].mean():,.0f}")
        
        print("\n🏷️ Niche Distribution:")
        niche_counts = df['niche'].value_counts()
        for niche, count in niche_counts.items():
            percentage = (count / len(df)) * 100
            avg_price = df[df['niche'] == niche]['price'].mean()
            print(f"  {niche:.<12} {count:>4} samples ({percentage:>5.1f}%) | Avg: ₹{avg_price:>8,.0f}")
        
        print("\n📈 Correlation with Price:")
        numeric_df = df.select_dtypes(include=[np.number])
        correlation = numeric_df.corr()['price'].sort_values(ascending=False)
        for feature, corr in correlation.items():
            if feature != 'price':
                print(f"  {feature:.<20} {corr:>6.3f}")

    def save_dataset(self, df, filename='goviral_training_dataset.csv'):
        """Save dataset to CSV"""
        df.to_csv(filename, index=False)
        print(f"\n💾 Dataset saved as '{filename}'")
        return filename

def verify_data_quality(df):
    """Verify that the dataset makes business sense"""
    
    print("\n🔍 DATA QUALITY CHECK")
    print("=" * 40)
    
    # Check for reasonable engagement rates
    df['calculated_engagement'] = df['avg_interactions'] / df['follower_count']
    avg_engagement = df['calculated_engagement'].mean()
    print(f"Average engagement rate: {avg_engagement:.3%}")
    
    # Check views-to-followers ratio
    df['views_ratio'] = df['avg_views'] / df['follower_count']
    avg_views_ratio = df['views_ratio'].mean()
    print(f"Average views/followers ratio: {avg_views_ratio:.2f}")
    
    # Check price per 1000 followers
    df['cpm'] = (df['price'] / df['follower_count']) * 1000
    avg_cpm = df['cpm'].mean()
    print(f"Average CPM: ₹{avg_cpm:.2f}")
    
    # Verify niche pricing makes sense
    print("\n💰 Niche CPM Comparison:")
    niche_cpm = df.groupby('niche')['cpm'].mean().sort_values(ascending=False)
    for niche, cpm in niche_cpm.head().items():
        print(f"  {niche:.<12} ₹{cpm:>6.2f}")
    
    return df

def plot_niche_comparison(df):
    """Create visualization of niche pricing"""
    
    # Plot for 100K followers (approximate)
    df_100k_range = df[(df['follower_count'] >= 80000) & (df['follower_count'] <= 120000)]
    
    if len(df_100k_range) > 0:
        plt.figure(figsize=(14, 8))
        
        # Group by niche and get average price
        niche_avg = df_100k_range.groupby('niche')['price'].mean().sort_values(ascending=False)
        
        # Create color mapping based on niche categories
        creator = GoviralDatasetCreator()
        colors = []
        for niche in niche_avg.index:
            if niche in creator.niches['premium']:
                colors.append('#FF6B6B')
            elif niche in creator.niches['medium']:
                colors.append('#4ECDC4')
            else:
                colors.append('#45B7D1')
        
        bars = plt.bar(niche_avg.index, niche_avg.values, color=colors)
        
        plt.title('Instagram Promotion Prices by Niche (~100K Followers)', fontsize=16, fontweight='bold')
        plt.xlabel('Niche', fontsize=12)
        plt.ylabel('Price (₹)', fontsize=12)
        plt.xticks(rotation=45, ha='right')
        plt.grid(axis='y', alpha=0.3)
        
        # Add value labels on bars
        for bar, price in zip(bars, niche_avg.values):
            plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 500, 
                    f'₹{price:,.0f}', ha='center', va='bottom', fontsize=9)
        
        # Add legend
        from matplotlib.patches import Patch
        legend_elements = [
            Patch(facecolor='#FF6B6B', label='Premium Niches'),
            Patch(facecolor='#4ECDC4', label='Medium Value'),
            Patch(facecolor='#45B7D1', label='Standard Niches')
        ]
        plt.legend(handles=legend_elements, loc='upper right')
        
        plt.tight_layout()
        plt.show()

def create_ml_ready_dataset(df):
    """Prepare the dataset for ML training"""
    
    print("\n🤖 PREPARING FOR ML TRAINING")
    print("=" * 40)
    
    # Create a copy of the dataset
    ml_df = df.copy()
    
    # Encode the niche categorical variable
    label_encoder = LabelEncoder()
    ml_df['niche_encoded'] = label_encoder.fit_transform(ml_df['niche'])
    
    # Display encoding mapping
    print("Niche Encoding Mapping:")
    for i, niche in enumerate(label_encoder.classes_):
        print(f"  {niche:.<12} → {i}")
    
    # Select features for ML model
    features = ['follower_count', 'avg_views', 'avg_interactions', 
                'new_followers_rate', 'accounts_reached', 'niche_encoded']
    target = 'price'
    
    ml_ready_df = ml_df[features + [target]]
    
    print(f"\nML Ready Dataset Shape: {ml_ready_df.shape}")
    print(f"Features: {', '.join(features)}")
    print(f"Target: {target}")
    
    # Save ML-ready dataset
    ml_ready_df.to_csv('goviral_ml_ready_dataset.csv', index=False)
    print("💾 ML-ready dataset saved as 'goviral_ml_ready_dataset.csv'")
    
    return ml_ready_df, label_encoder

def main():
    """Main function to create and analyze the dataset"""
    
    print("🚀 GoViral - Price Prediction Dataset Creator")
    print("=" * 50)
    
    # Initialize dataset creator
    creator = GoviralDatasetCreator()
    
    # Create dataset (you can change the number of samples)
    num_samples = 1500  # Change this to create more or less samples
    dataset = creator.create_dataset(num_samples=num_samples)
    
    # Analyze dataset
    creator.analyze_dataset(dataset)
    
    # Save dataset
    filename = creator.save_dataset(dataset)
    
    # Verify data quality
    dataset_with_quality = verify_data_quality(dataset)
    
    # Display sample of the data
    print("\n🔍 Sample of the dataset:")
    print(dataset.head(10))
    
    # Create ML-ready dataset
    ml_dataset, label_encoder = create_ml_ready_dataset(dataset)
    
    # Show some interesting comparisons
    print("\n🎯 Price Comparison Examples:")
    print("Same follower range, different niches:")
    
    # Find samples with similar follower counts but different niches
    mid_range = dataset[dataset['follower_count'].between(45000, 55000)]
    if len(mid_range) > 0:
        comparison = mid_range.groupby('niche').agg({
            'price': 'mean',
            'follower_count': 'count'
        }).sort_values('price', ascending=False).head(5)
        
        for niche, row in comparison.iterrows():
            print(f"  {niche:.<12} ₹{row['price']:>8,.0f} (from {int(row['follower_count'])} samples)")
    
    # Create visualization
    print("\n📊 Creating visualization...")
    plot_niche_comparison(dataset)
    
    print("\n✅ Dataset creation completed!")
    print(f"📁 Files created:")
    print(f"   - {filename} (Original dataset)")
    print(f"   - goviral_ml_ready_dataset.csv (ML-ready dataset)")
    
    return dataset, ml_dataset, label_encoder

# Run the dataset creation
if __name__ == "__main__":
    dataset, ml_dataset, label_encoder = main()
    
    # Example of how to use the dataset for prediction
    print("\n🎯 EXAMPLE: Predicting price for a new promoter")
    print("Sample input format for your ML model:")
    
    sample_promoter = {
        'follower_count': 75000,
        'avg_views': 82000,
        'avg_interactions': 3500,
        'new_followers_rate': 120,
        'accounts_reached': 88000,
        'niche': 'fashion'
    }
    
    print(f"  follower_count: {sample_promoter['follower_count']}")
    print(f"  avg_views: {sample_promoter['avg_views']}")
    print(f"  avg_interactions: {sample_promoter['avg_interactions']}")
    print(f"  new_followers_rate: {sample_promoter['new_followers_rate']}")
    print(f"  accounts_reached: {sample_promoter['accounts_reached']}")
    print(f"  niche: '{sample_promoter['niche']}'")
    
    # You would encode the niche and feed these features to your ML model
    niche_encoded = label_encoder.transform([sample_promoter['niche']])[0]
    print(f"  niche_encoded: {niche_encoded}")