import urllib.request
import re
import json

url = 'https://www.pinterest.com/pin/763500943099811588/'
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
    }
)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        
        with open('pin_page.html', 'w', encoding='utf-8') as f:
            f.write(html)
            
        print("Length of HTML:", len(html))
        title = re.search(r'<title>(.*?)</title>', html)
        if title:
            print("TITLE:", title.group(1))
            
        meta_tags = re.findall(r'<meta\s+[^>]*>', html)
        for m in meta_tags:
            if 'og:' in m or 'description' in m or 'twitter:' in m:
                print("META:", m)
except Exception as e:
    print("Error:", e)
