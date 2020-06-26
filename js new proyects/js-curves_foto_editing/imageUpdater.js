class ImageUpdater {
    /**
     * Constructor of the image updater
     * by default loads and adjuster the first img
     * in the given array
     * 
     * @param imgs List of posible images update 
     */
    constructor(imgs) {
        this.imgList = imgs;
        this.startImg(0);
        this.nPixelsUpdt = 5000;
    }

    /**
     * Loads the image, resizes it and crops it to the right dimensions
     * 
     * @param n index of the name of the image in the list
     */
    startImg(n) {
        let name = this.imgList[n];
        this.imgName = name;
        // Load image
        this.img = loadImage(this.imgName, (i) => this.imgLoaded());
    }

    /**
     * When the image is loaded
     * resize it and crop it
     */
    imgLoaded() {
        // Make some image adjustments
        this.img.resize(width/3, 0); // Resize
        if(this.img.height > this.img.width) { // Crop
            this.img = this.img.get(0, (this.img.height - this.img.width)/2,
             this.img.width, this.img.width);
        }

        // Create the image that is going to be modified
        this.newImg = new p5.Image(this.img.width, this.img.height);
        this.newImg.copy(this.img, 0, 0, this.img.width, this.img.height, 
                                   0, 0, this.img.width, this.img.height);

        this.resetIndex();

        this.img.loadPixels();
        this.newImg.loadPixels();
    }

    /**
     * Resets the updating index
     */
    resetIndex() {
        this.index = 0;
    }

    /**
     * Updates some of the pixels of the image acording to the give function
     * The ammount of pixels updated is changed depending on the current frame rate
     * 
     * @param f function to apply to the pixels
     */
    updateImg(f) {
        let l = this.newImg.pixels.length/4;
        let i = this.index;
        let n = min(this.nPixelsUpdt, l - i);
        if(n==0) return;

        for(let j = i*4; j < (i+n)*4; j+=4) {
            let r = this.img.pixels[j]/255;   
            let g = this.img.pixels[j+1]/255;   
            let b = this.img.pixels[j+2]/255;

            this.newImg.pixels[j]   = f(r)*255;
            this.newImg.pixels[j+1] = f(g)*255;   
            this.newImg.pixels[j+2] = f(b)*255;

        }
        this.newImg.updatePixels();

        this.index += n;
        if(frameRate() > 45) this.nPixelsUpdt+=25;
        else this.nPixelsUpdt-=25;
    }

    /**
     * Draws the new img
     */
    drawImg() {
        let overImg = mouseX > 7/12*width && mouseX < 11/12*width && mouseIsPressed;
        image(overImg ? this.img : this.newImg, 0, -width/6 - this.newImg.height/2);
    }

    /**
     * Aplies the function to the image in full resolution
     */
    save() {
        alert("Saving image, if original image is large this might take up to a few minutes. Please wait until download message pops up");
        loadImage(this.imgName, (i) => this.imgApplyAndSave(i, getInterpolation));
    }

    /**
     * Once the full resolution image is loaded
     * apply the function and save the result
     */
    imgApplyAndSave(img, f) {
        // Apply
        img.loadPixels();
        for(let i = 0; i < img.pixels.length/4; i++) {
            let r = img.pixels[i]/255;   
            let g = img.pixels[i+1]/255;   
            let b = img.pixels[i+2]/255;

            img.pixels[i]   = f(r)*255;
            img.pixels[i+1] = f(g)*255;   
            img.pixels[i+2] = f(b)*255;
        }
        img.updatePixels();

        //Save
        img.save();
    }
}