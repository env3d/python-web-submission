import image

img = image.Image('dog.jpg')
new_img = image.EmptyImage(img.getHeight(), img.getWidth())
win = image.ImageWin(img.getWidth(), img.getHeight())

for x in range(img.getWidth()):
    for y in range(img.getHeight()):
        p = img.getPixel(x,y)
        new_img.setPixel(y,x,p)

new_img.draw(win)
