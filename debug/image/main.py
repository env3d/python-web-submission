import image
import random

def dog():
    img = image.Image('dog.jpg')
    new_img = image.EmptyImage(img.getHeight(), img.getWidth())
    win = image.ImageWin(img.getWidth(), img.getHeight())

    for x in range(img.getWidth()):
        for y in range(img.getHeight()):
            p = img.getPixel(x,y)
            new_img.setPixel(y,x,p)

    new_img.draw(win)

def rand():
    img = image.EmptyImage(random.randint(50,100),random.randint(50,100))
    win = image.ImageWin(img.getWidth(), img.getHeight())
    
    for x in range(img.getWidth()):
        for y in range(img.getHeight()):
            if random.random() > 0.5:
                p = image.Pixel(0,0,0)
            else:
                p = image.Pixel(255,255,255)                            
            img.setPixel(x,y,p)
            
    img.draw(win)
    
for i in range(5):
    rand()
