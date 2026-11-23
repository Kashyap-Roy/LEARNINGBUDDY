with open('pin_page.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re, json

# search for video url (e.g. .mp4 or v.pinimg.com or 720p or similar)
vids = set(re.findall(r'https?://[^\s\"\'<>]+\.mp4[^\s\"\'<>]*', text))
print('Videos found:', vids)

# Let's search for relay or redux or json state
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
for s in scripts:
    if 'video_list' in s or 'v.pinimg.com' in s:
        print('Found script with video! Len:', len(s))
        urls = set(re.findall(r'https://[^\s\"\\]+\.mp4', s))
        print('mp4 URLs:', urls)
        # print some context
        for u in list(urls)[:3]:
            idx = s.find(u)
            print("Context:", s[max(0, idx-100):min(len(s), idx+200)])
