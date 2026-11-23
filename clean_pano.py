import cv2
import numpy as np

f0 = cv2.imread('assets/visite_scene1.jpg')
f2 = cv2.imread('assets/visite_scene2.jpg')
f3 = cv2.imread('assets/visite_scene3.jpg')

# Frame dimensions: 720 x 960
# In f2, the navbar is at y=0..85. Let's inpaint or replace y=0..85 using the bottom of f0!
# Bottom of f0 is the lake & grass at y=600..720.
# In the vertical panorama:
# f0 is placed at y=0.
# f2 starts at y=720 (or ~710 for continuous flow).
# Let's inspect the top 90px of f2: it's dark purple cliff & top of waterfall.
# In f2, the navbar words are "Notosan", "Community", "About", "Support", "Contact", "Register" at y=30..80.

def remove_navbar(img):
    out = img.copy()
    gray = cv2.cvtColor(out, cv2.COLOR_BGR2GRAY)
    mask = np.zeros(gray.shape, dtype=np.uint8)
    # Navbar area
    mask[25:85, :] = (gray[25:85, :] > 140).astype(np.uint8) * 255
    # dilate slightly
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    mask = cv2.dilate(mask, kernel, iterations=1)
    # Inpaint navbar text
    out = cv2.inpaint(out, mask, 5, cv2.INPAINT_TELEA)
    return out

f2_clean = remove_navbar(f2)
f3_clean = remove_navbar(f3)

# Let's stitch them cleanly:
# Scene 1: 0..720
# Overlap transition between f0 and f2:
# Let's use a 40px linear alpha blend between f0[680:720] and f2_clean[0:40]
H = 720 + 700 + 700 # ~2120px
W = 960
pano = np.zeros((H, W, 3), dtype=np.uint8)

# Place f0
pano[0:680, :] = f0[0:680, :]

# Blend f0 and f2
blend1_len = 40
for i in range(blend1_len):
    alpha = (i + 1) / (blend1_len + 1)
    pano[680 + i, :] = ((1 - alpha) * f0[680 + i, :].astype(np.float32) + alpha * f2_clean[i, :].astype(np.float32)).astype(np.uint8)

# Place f2_clean
pano[720:1360, :] = f2_clean[blend1_len:blend1_len + 640, :]

# Blend f2 and f3
blend2_len = 40
f2_bottom_start = blend1_len + 640
for i in range(blend2_len):
    alpha = (i + 1) / (blend2_len + 1)
    y_target = 1360 + i
    y_f2 = f2_bottom_start + i
    y_f3 = i
    pano[y_target, :] = ((1 - alpha) * f2_clean[y_f2, :].astype(np.float32) + alpha * f3_clean[y_f3, :].astype(np.float32)).astype(np.uint8)

# Place f3_clean
pano[1400:1400 + (720 - blend2_len), :] = f3_clean[blend2_len:, :]

actual_H = 1400 + (720 - blend2_len)
pano = pano[:actual_H, :]
print(f"Pano shape: {pano.shape}")

cv2.imwrite('assets/notosan_clean_pano.jpg', pano)
print("Saved clean panorama to assets/notosan_clean_pano.jpg")
