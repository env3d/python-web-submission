import image
import random
"""
The following function is simply an example of how to create a new image
using the image library from the text.  Here we create an image
of width and height and set every pixel to red using a nested loop
as outline in chatper 8.11

Here's a video of what this lab will look like when completed:

https://youtu.be/0TW4QGbXAjY 

"""
def createRedImage(width, height):
    im = image.EmptyImage(width, height)

    for x in range(width):
        for y in range(height):
            im.setPixel(x, y, image.Pixel(255, 0, 0))

    im.save("red.gif")


"""
Exercise 1

Create a image called white_line.gif where the entire image
is black with a single white line across the middle of the image

"""
def createWhiteLine(width, height):
    im = image.EmptyImage(width, height)

    for x in range(width):
        for y in range(height):
            # process each x and y location to set the correct pixel color
            pass

    im.save("white_line.gif")


"""
Exercise 2

Create an image called alternate_lines.gif where we have horizontal lines 
that alternate between black and white
"""
def createAlternateLines(width, height):
    im = image.EmptyImage(width, height)

    for x in range(width):
        for y in range(height):
            # process each x and y location to set the correct pixel color
            pass

    im.save("alternate_lines.gif")


"""
Exercise 3

Using the random.random() function, create an image called random.gif where
each pixel has a 50% chance of being white or black
"""
def createRandomNoise(width, height):
    im = image.EmptyImage(width, height)

    for x in range(width):
        for y in range(height):
            # process each x and y location to set the correct pixel color
            pass

    im.save("random.gif")


"""
Exercise 4

Steganography is the practice of concealing a file, message, image, or video within another 
file, message, image, or video. 

The file encoded_image.gif looks normal, but we actually hid a secret black and white
image inside the red channel.  Implement the following algorithm:

 - The secret image is the same width and size of encoded_image.gif
 - Create a new image to store the secret image
 - Use our nested loop to process each pixel:
     - If the red channel is odd, turn the resulting pixel on the new image to black
     - if the red channel is even, turn the resulting pixel on the new image to red
 - Save the new image to an image called secret.gif

"""
def decodeImage():
    secret = image.FileImage("encoded_image.png")

    for x in range(secret.width):
        for y in range(secret.height):
            # process each x and y location to set the correct pixel color
            pass

    # don't forget to save the decoded image!
