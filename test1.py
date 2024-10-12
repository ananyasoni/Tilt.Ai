import cv2
import numpy as np
import pytesseract as tesseract
import mss
import time

# pipeline = keras_ocr.pipeline.Pipeline()

# Defining macros for dealer button function:
height = 1964
width = 3024
p0 = [int(height * (328 / 475)), int(height * (348 / 475)), int(width * (375 / 729)), int(width * (395 / 729))]
p1 = [int(height * (324 / 475)), int(height * (344 / 475)), int(width * (262 / 729)), int(width * (282 / 729))]
p2 = [int(height * (307 / 475)), int(height * (327 / 475)), int(width * (209 / 729)), int(width * (229 / 729))]
p3 = [int(height * (250 / 475)), int(height * (270 / 475)), int(width * (150 / 729)), int(width * (170 / 729))]
p4 = [int(height * (175 / 475)), int(height * (195 / 475)), int(width * (165 / 729)), int(width * (185 / 729))]
p5 = [int(height * (131 / 475)), int(height * (151 / 475)), int(width * (330 / 729)), int(width * (350 / 729))]
p6 = [int(height * (130 / 475)), int(height * (150 / 475)), int(width * (375 / 729)), int(width * (395 / 729))]
p7 = [int(height * (183 / 475)), int(height * (203 / 475)), int(width * (530 / 729)), int(width * (550 / 729))]
p8 = [int(height * (260 / 475)), int(height * (280 / 475)), int(width * (560 / 729)), int(width * (580 / 729))]
p9 = [int(height * (307 / 475)), int(height * (327 / 475)), int(width * (495 / 729)), int(width * (515 / 729))]
def find_dealer(window):

    # Check to see dealer button
    # --------------------------
    # size = 20x20
    # window_size = 729 x 475
    # First, checking at p0 (hero):
    # left: 375; top: 328
    p0_button = window[p0[0] : p0[1], p0[2] : p0[3]]

    # Then, at first_left (p1):
    # left: 262; top: 324
    p1_button = window[p1[0] : p1[1], p1[2] : p1[3]]

    # Then, at second_left (p2):
    # left: 209; top: 307
    p2_button = window[p2[0] : p2[1], p2[2] : p2[3]]

    # Then, at third_left (p3):
    # left: 150; top: 250
    p3_button = window[p3[0] : p3[1], p3[2] : p3[3]]

    # Then, at fourth_left (p4):
    # left: 165; top: 175
    p4_button = window[p4[0] : p4[1], p4[2] : p4[3]]

    # Then, at fifth_left (p5):
    # left: 330; top: 131
    p5_button = window[p5[0] : p5[1], p5[2] : p5[3]]

    # Then, at sixth_left (p6):
    # left: 375; top: 130
    p6_button = window[p6[0] : p6[1], p6[2] : p6[3]]

    # Then, at seventh_left (p7):
    # left: 530; top: 183
    p7_button = window[p7[0] : p7[1], p7[2] : p7[3]]

    # Then, at eigth_left (p8):
    # left: 560; top: 260
    p8_button = window[p8[0] : p8[1], p8[2] : p8[3]]

    # Then, at ninth_left (p9):
    # left: 495; top: 307
    p9_button = window[p9[0] : p9[1], p9[2] : p9[3]]

    dealer_images_array = [p0_button, p1_button, p2_button, p3_button, p4_button,
                           p5_button, p6_button, p7_button, p8_button, p9_button]

    # dealer_images = [keras_ocr.tools.read(image) for image in dealer_images_array]
    #
    # prediction_groups = pipeline.recognize(dealer_images)
    #
    # for i in range(0, len(prediction_groups)):
    #     if prediction_groups[i] and prediction_groups[i][0][0] == 'd':
    #         return i
    for i in range(0, len(dealer_images_array)):
        position = dealer_images_array[i]
        pixel = position[position.shape[0] // 2, position.shape[1] // 2]
        if pixel[0] > 200 and pixel[1] > 200 and pixel[2] > 200:
            # Pixel is blue, so it is the dealer button. {Opencv uses BGR}
            return i
    return -1


def is_hero_turn(hero):
    hero_data = hero[0: hero.shape[0], hero.shape[1] // 2:]
    # Picking a square to see if hero has folded or not:
    top_offset = hero_data.shape[0] // 2
    bottom_offset = top_offset + 5
    left_offset = int(hero_data.shape[1] / 1.5)
    right_offset = left_offset + 5

    square = hero_data[top_offset: bottom_offset, left_offset: right_offset]
    # cv2.imshow('Square', square)
    # cv2.waitKey(0)

    # Checking to see if the square is white or gray:
    pixel = square[0, 0]
    # print(pixel)
    if pixel[0] >= 240 and pixel[1] >= 240 and pixel[2] >= 240:
        return True
    return False


def hero_stack(hero):
    # window size = 664 x 256
    # left: 350, top: 130
    # size: 215 x 55
    left_offset = int(hero.shape[1] * 350 / 664)
    right_offset = int(hero.shape[1] * 565 / 664)
    top_offset = int(hero.shape[0] * 130 / 256)
    bottom_offset = int(hero.shape[0] * 185 / 256)

    # stack_image = keras_ocr.tools.read(hero[top_offset : bottom_offset, left_offset : right_offset])
    #
    # stack_prediction = pipeline.recognize(stack_image)
    # return int(stack_prediction[0][0][0])

    stack_image = hero[top_offset : bottom_offset, left_offset : right_offset]
    size = tesseract.image_to_string(stack_image)
    return int(size)


is_turn = False
button = -2
stack = -1
gains = 0
hand_number = 0

# video = cv2.VideoCapture('./pokersesh1.mov')

with mss.mss() as sct:
    monitor = sct.monitors[0]
    time.sleep(5)
# while video.isOpened():
    while True:
        if is_turn:
            start_time = time.time()
            print("It is currently your turn")
            while True:
                screen = sct.grab(monitor)
                frame = np.array(screen)
                # ret, frame = video.read()
                frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)
                # if not ret:
                #     print("There was a problem with this frame .... EXITING")
                #     break
                dim = (width, height)

                # Apply resizing
                frame = cv2.resize(frame, dim, interpolation=cv2.INTER_AREA)
                hero_tab = frame[int(frame.shape[0] * (530 / 735)): int(frame.shape[0] * (620 / 735)),
                           int(frame.shape[1] * (585 / 1145)): int(frame.shape[1] * (815 / 1145))]
                # cv2.imshow('Hero Tab', hero_tab)
                # cv2.waitKey(10)
                # curr_button = find_dealer(frame)
                # curr_stack = hero_stack(hero_tab)
                is_turn = is_hero_turn(hero_tab)
                # if button == -2:
                #     button = curr_button
                # if stack == -1:
                #     stack = curr_stack
                # if curr_button != button:
                #     # Button has moved, our turn is over
                #     print(f"Hand number {hand_number} ended, and hero has stack: {curr_stack}")
                #     print("Button moved, turn over")
                #     button = curr_button
                #     stack = curr_stack
                #     hand_number += 1
                #     break
                # if stack != curr_stack:
                #     # Player has made a move, either raise or call, turn is over
                #     print("Either raised or called, turn over")
                #     stack = curr_stack
                #     button = curr_button
                #     break
                if not is_turn:
                    # Turn is over either ways, most likely means a fold.
                    curr_button = find_dealer(frame)
                    curr_stack = hero_stack(hero_tab)
                    if button == -2:
                        button = curr_button
                    if stack == -1:
                        stack = curr_stack
                    if curr_button != button:
                        # Button has moved, our turn is over
                        print(curr_button, button)
                        print(f"Hand number {hand_number + 1} ended, and hero has stack: {curr_stack}")
                        print("Button moved, turn over")
                    button = curr_button
                    stack = curr_stack
                    hand_number += 1
                    print("Probably folded or ran out of time, turn over")
                    break
                # break
            end_time = time.time()
            turn_duration = end_time - start_time
            print(f"This turn took {turn_duration} time, and your stack currently is {curr_stack}")
        else:
            screen = sct.grab(monitor)
            frame = np.array(screen)
            # ret, frame = video.read()
            frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)
            dim = (width, height)

            # Apply resizing
            frame = cv2.resize(frame, dim, interpolation=cv2.INTER_AREA)
            # if not ret:
            #     print("There was a problem with this frame .... EXITING")
            #     break
            hero_tab = frame[int(frame.shape[0] * (530 / 735)): int(frame.shape[0] * (620 / 735)),
                       int(frame.shape[1] * (585 / 1145)): int(frame.shape[1] * (815 / 1145))]
            # cv2.imshow("Hero tab", hero_tab)
            # # cv2.waitKey(0)
            curr_button = find_dealer(frame)
            button = curr_button
            # curr_stack = hero_stack(hero_tab)
            is_turn = is_hero_turn(hero_tab)