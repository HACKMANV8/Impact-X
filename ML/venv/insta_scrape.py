from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
import re

class InstagramSeleniumScraper:
    def __init__(self, headless=True):
        self.headless = headless
        self.driver = None
        self.setup_driver()
    
    def setup_driver(self):
        """Setup Chrome driver with appropriate options"""
        chrome_options = Options()
        
        if self.headless:
            chrome_options.add_argument("--headless")
        
        # Anti-detection options
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # Execute CDP commands to prevent detection
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    def get_follower_count_public(self, instagram_url):
        """
        Get follower count from public Instagram profile without login
        """
        try:
            print(f"🌐 Opening: {instagram_url}")
            self.driver.get(instagram_url)
            
            # Wait for page to load
            time.sleep(5)
            
            # Multiple selectors for follower count (Instagram changes these frequently)
            follower_selectors = [
                "//section//a[contains(@href, 'followers')]//span",
                "//a[contains(@href, '/followers/')]//span",
                "//header//a[contains(@href, 'followers')]//span",
                "//span[contains(text(), 'followers')]/preceding-sibling::span",
                "//li[contains(*, 'followers')]//span"
            ]
            
            followers = None
            
            for selector in follower_selectors:
                try:
                    element = WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, selector))
                    )
                    follower_text = element.text.strip()
                    print(f"📊 Found follower text with selector '{selector}': {follower_text}")
                    
                    # Parse the number (handle formats like "1,234,567" or "1.2M")
                    followers = self.parse_follower_count(follower_text)
                    if followers:
                        break
                        
                except Exception as e:
                    continue
            
            if followers:
                print(f"✅ Follower count: {followers:,}")
                return followers
            else:
                print("❌ Could not find follower count")
                return None
                
        except Exception as e:
            print(f"❌ Error: {e}")
            return None
    
    def parse_follower_count(self, text):
        """
        Parse follower count text into integer
        Handles formats like: 1,234,567 or 1.2M or 1.2K
        """
        # Remove any non-numeric characters except dots and commas
        clean_text = re.sub(r'[^\d.,]', '', text)
        
        try:
            if 'M' in text or 'm' in text:  # Millions
                number = float(clean_text.replace(',', ''))
                return int(number * 1_000_000)
            elif 'K' in text or 'k' in text:  # Thousands
                number = float(clean_text.replace(',', ''))
                return int(number * 1_000)
            else:  # Regular number
                return int(clean_text.replace(',', ''))
        except:
            return None
    
    def get_multiple_followers(self, urls):
        """Get follower counts for multiple URLs"""
        results = {}
        
        for url in urls:
            print(f"\n🔍 Processing: {url}")
            followers = self.get_follower_count_public(url)
            results[url] = followers
            
            # Random delay between requests
            time.sleep(3)
        
        return results
    
    def close(self):
        """Close the browser"""
        if self.driver:
            self.driver.quit()

# Usage Example
def main():
    scraper = InstagramSeleniumScraper(headless=False)  # Set to False to see browser
    
    # List of Instagram profile URLs
    instagram_urls = [
        "https://www.instagram.com/samarth_deshpande11?igsh=MXdiZjJzcmozYnNycg=="
        # Add more URLs here
    ]
    
    try:
        results = scraper.get_multiple_followers(instagram_urls)
        
        print("\n" + "="*50)
        print("📊 FINAL RESULTS")
        print("="*50)
        for url, followers in results.items():
            username = url.split('/')[-2] if url.split('/')[-2] else url.split('/')[-1]
            if followers:
                print(f"👤 {username}: {followers:,} followers")
            else:
                print(f"👤 {username}: Failed to get followers")
                
    finally:
        scraper.close()

if __name__ == "__main__":
    main()