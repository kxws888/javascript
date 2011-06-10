/**
 * ImagePreloader
 * @version 20110610.5
 *
 */
function ImagePreloader(images, callback) {
    this.callback = callback;

    this.nLoaded = 0;
    this.nProcessed = 0;
    this.aImages = [];

    this.nImages = images.length;

    // for each image, call preload()
    for (var i = 0, len = images.length ; i < len ; i += 1) {
        this.preload(images[i], i);
    }
}

ImagePreloader.prototype.preload = function (image, index) {
    var oImage = new Image;
    oImage.nIndex = index;
    this.aImages.push(oImage);

    // assign pointer back to this.
    oImage.oImagePreloader = this;
    oImage.bLoaded = false;

    oImage.src = image;
    // handle ie cache
    if (oImage.width > 0) {
        this.onload.call(oImage);
    }
    else {
        oImage.onload = this.onload;
        oImage.onerror = this.onerror;
        oImage.onabort = this.onabort;
    }
}

ImagePreloader.prototype.onComplete = function (oImage) {
    this.nProcessed++;
    this.callback(oImage, this.aImages, this.nLoaded);
}

ImagePreloader.prototype.onload = function () {
    this.bLoaded = true;
    this.oImagePreloader.nLoaded++;
    this.oImagePreloader.onComplete(this);
}

ImagePreloader.prototype.onerror = function () {
    this.bError = true;
    this.oImagePreloader.onComplete(this);
}

ImagePreloader.prototype.onabort = function () {
    this.bAbort = true;
    this.oImagePreloader.onComplete(this);
}

