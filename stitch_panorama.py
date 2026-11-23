import cv2
import numpy as np

# Load the frames:
# Scene 1: frame 0
# Transition 1: frame 40
# Scene 2: frame 75
# Transition 2: frame 115
# Scene 3: frame 150

cap = cv2.VideoCapture('pin_video.mp4')
all_frames = []
while True:
    ret, f = cap.read()
    if not ret: break
    all_frames.append(f)

print(f"Loaded {len(all_frames)} frames.")

# Let's stitch vertically from frame 0 down to frame 150
# We can track vertical offset between consecutive frames:
curr_y = 0
canvas_width = 960
# Total height from earlier calculation was ~2140
# Let's accumulate into a floating-point canvas with weight blending
# or let's find the exact vertical offset of each key frame.

# Frame 0 is base
f0 = all_frames[0]
f_trans1 = all_frames[35]
f_scene2 = all_frames[75]
f_trans2 = all_frames[115]
f_scene3 = all_frames[150]

# Let's compute offset between f0 and f_trans1:
res1 = cv2.matchTemplate(f0, f_trans1[0:200, :], cv2.TM_CCOEFF_NORMED)
_, _, _, max_loc1 = cv2.minMaxLoc(res1)
dy_trans1 = max_loc1[1] # where top of trans1 appears in f0
print("f_trans1 top in f0:", dy_trans1)

# offset between f_trans1 and f_scene2:
res2 = cv2.matchTemplate(f_trans1, f_scene2[0:200, :], cv2.TM_CCOEFF_NORMED)
_, _, _, max_loc2 = cv2.minMaxLoc(res2)
dy_scene2 = dy_trans1 + max_loc2[1]
print("f_scene2 top in f0:", dy_scene2)

# offset between f_scene2 and f_trans2:
res3 = cv2.matchTemplate(f_scene2, f_trans2[0:200, :], cv2.TM_CCOEFF_NORMED)
_, _, _, max_loc3 = cv2.minMaxLoc(res3)
dy_trans2 = dy_scene2 + max_loc3[1]
print("f_trans2 top in f0:", dy_trans2)

# offset between f_trans2 and f_scene3:
res4 = cv2.matchTemplate(f_trans2, f_scene3[0:200, :], cv2.TM_CCOEFF_NORMED)
_, _, _, max_loc4 = cv2.minMaxLoc(res4)
dy_scene3 = dy_trans2 + max_loc4[1]
print("f_scene3 top in f0:", dy_scene3)

total_H = dy_scene3 + 720
print(f"Total Panorama Height: {total_H} x {canvas_width}")

# Now build the continuous canvas
panorama = np.zeros((total_H, canvas_width, 3), dtype=np.float32)
weight = np.zeros((total_H, canvas_width, 1), dtype=np.float32)

def add_frame(frame, top_y):
    h, w = frame.shape[:2]
    # create smooth vertical blend weights
    w_vec = np.ones((h, 1), dtype=np.float32)
    # feather top and bottom 40px
    feather = min(40, h // 4)
    w_vec[:feather] = np.linspace(0.01, 1.0, feather)[:, None]
    w_vec[-feather:] = np.linspace(1.0, 0.01, feather)[:, None]
    
    weights_2d = np.repeat(w_vec, w, axis=1)[:, :, None]
    
    panorama[top_y:top_y+h, :w] += frame.astype(np.float32) * weights_2d
    weight[top_y:top_y+h, :w] += weights_2d

# Add key frames and intermediary frames for seamless blending
# Frame 0
add_frame(f0, 0)
# Intermediaries
for frame_idx, top_est in [
    (15, int(dy_trans1 * 0.4)),
    (35, dy_trans1),
    (55, int((dy_trans1 + dy_scene2) / 2)),
    (75, dy_scene2),
    (95, int((dy_scene2 + dy_trans2) / 2)),
    (115, dy_trans2),
    (135, int((dy_trans2 + dy_scene3) / 2)),
    (150, dy_scene3)
]:
    # refine match against current panorama
    sub = panorama[top_est-20:top_est+740, :]
    if sub.shape[0] >= 720:
        res = cv2.matchTemplate(sub.astype(np.uint8), all_frames[frame_idx][200:500, :], cv2.TM_CCOEFF_NORMED)
        _, _, _, mloc = cv2.minMaxLoc(res)
        exact_y = top_est - 20 + mloc[1] - 200
    else:
        exact_y = top_est
    add_frame(all_frames[frame_idx], exact_y)

weight[weight == 0] = 1.0
final_panorama = (panorama / weight).astype(np.uint8)
cv2.imwrite('assets/notosan_panorama.jpg', final_panorama)
print("Saved assets/notosan_panorama.jpg successfully!")
