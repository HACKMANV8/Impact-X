import requests
import re
import json
import random
import time
from typing import Optional, Dict, Any
from datetime import datetime

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
    
    def get_verification_instructions(self, token: str) -> str:
        """Generate user instructions for verification"""
        return f"""
📱 INSTAGRAM VERIFICATION INSTRUCTIONS:

1. Copy this verification code: 
   🔐 **{token}**

2. Add this code to your Instagram bio:

   • Go to Instagram Profile → Edit Profile → Bio
   • Add: {token}
   • Save changes

3. Click Verify below

⚠️  Keep the code in your bio until verification is complete!
"""

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
            
            # Save response for debugging
            with open(f"debug_{username}.html", "w", encoding="utf-8") as f:
                f.write(response.text)
            print(f"   ✅ Response saved to debug_{username}.html")
            
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
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edge/120.0.0.0'
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
        print(f"\n🚀 Starting verification for: {username}")
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
        
        print(f"\n📊 VERIFICATION RESULT:")
        print(f"   Status: {'VERIFIED' if result['verified'] else 'FAILED'}")
        print(f"   Found: {result['found_token']}")
        print(f"   Time: {result['verification_time']}s")
        print(f"   {result['message']}")
        
        return result

def main():
    """Main interactive function"""
    print("=" * 60)
    print("🔐 INSTAGRAM VERIFICATION SYSTEM")
    print("=" * 60)
    
    verifier = InstagramVerificationSystem()
    
    while True:
        print("\n" + "=" * 40)
        print("1. Start New Verification")
        print("2. Exit")
        
        choice = input("\nChoose option (1-2): ").strip()
        
        if choice == "1":
            username = input("Enter Instagram username: ").strip()
            if not username:
                print("❌ Username required")
                continue
                
            token = verifier.generate_verification_token()
            
            print("\n" + "=" * 50)
            print(verifier.get_verification_instructions(token))
            print("=" * 50)
            
            input("\nPress Enter when you've added the token to your Instagram bio...")
            
            result = verifier.verify_user(username, token)
            
            if result["verified"]:
                print("\n🎉 CONGRATULATIONS! Verification successful!")
            else:
                print("\n⚠️  Verification failed!")
                print("   Check the debug_username.html file to see what was fetched")
                
        elif choice == "2":
            print("👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid choice")

# Quick function for direct use
def quick_verify(username: str, token: str) -> bool:
    """Quick verification function"""
    verifier = InstagramVerificationSystem()
    result = verifier.verify_user(username, token)
    return result["verified"]

if __name__ == "__main__":
    main()