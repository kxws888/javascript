/**
    * ImagePreloader is a tool for multi-images preloading
    *
    * @example
    * new ImagePreloader(['http://image1.jpg', 'http://image2.jpg'], function (oImage, this.aImages, this.nProcessed, this.nLoaded) {
    *   //use jQuery
    *   $('<img>').attr('src', oImage.src);
    * });
    *
    * @author nhnst Liuming
    * @version 20110623.4
    * @constructor
    * @param {String[]} images A collection of images url for preloading
    * @param {Function} callback(oImage, this.aImages, this.nProcessed, this.nLoaded) A function to call once the every image request finishes
    */
    function ImagePreloader(images, callback) {
        this.callback = callback;

        this.nLoaded = 0;
        this.nProcessed = 0;
        this.aImages = [];

        this.nImages = images.length;

        for (var i = 0, len = images.length ; i < len ; i += 1) {
            this.preload(images[i], i);
        }
    }
    /**
    * Initialization
    * @private
    */
    ImagePreloader.prototype.preload = function (image, index) {
        var oImage = new Image;
        oImage.nIndex = index;
        oImage.bLoaded = false;
        oImage.oImagePreloader = this;
        oImage.src = image + '?flush=' + (+new Date());

        this.aImages.push(oImage);

        // handle ie cache
        if (oImage.width > 0) {
            this.onload.call(oImage);
        }
        else {
            oImage.onload = this.onload;
            oImage.onerror = this.onerror;
            oImage.onabort = this.onabort;
        }
    };
    /**
    * A inner function to be called when every image request finishes
    * @private
    */
    ImagePreloader.prototype.onComplete = function (oImage) {
        this.nProcessed++;
        this.callback(oImage, this.aImages, this.nProcessed, this.nLoaded);
    };
    /**
    * A inner function to be called when image loads successful
    * @private
    */
    ImagePreloader.prototype.onload = function () {
        this.bLoaded = true;
        this.oImagePreloader.nLoaded++;
        this.oImagePreloader.onComplete(this);
    };
    /**
    * A inner function to be called when an error occurs loading the image
    * @private
    */
    ImagePreloader.prototype.onerror = function () {
        this.bError = true;
        this.oImagePreloader.onComplete(this);
    };
    /**
    * A inner function to be called when image loading is aborted
    * @private
    */
    ImagePreloader.prototype.onabort = function () {
        this.bAbort = true;
        this.oImagePreloader.onComplete(this);
    };
