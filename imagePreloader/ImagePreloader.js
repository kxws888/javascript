(function (window, document, undefined) {
	/**
    * ImagePreloader is a tool for multi-images preloading
    *
    * @example
    * new ImagePreloader(['http://image1.jpg', 'http://image2.jpg'], 2, null, function (oImage, this.aImages, this.nProcessed, this.nLoaded) {
    *   //use jQuery
    *   $('<img>').attr('src', oImage.src);
    * });
    *
    * @constructor
    * @param {String[]} images A collection of images url for preloading
    * @param {Number} timeout Set a local timeout(in milliseconds)
    * @param {Function} complete(this.aImages, this.nLoaded) A function called once all the images request finishes
    * @param {Function} one(oImage, this.aImages, this.nProcessed, this.nLoaded) A function called once the every image request finishes
    * @param {Boolean} cache If set to false, it will force requested images not to be cached by the browser.
    */
    this.ImagePreloader = function (images, timeout, complete, one, cache) {
        this.timeout = timeout || 2;
        this.complete = complete;
        this.one = one;
        this.flush = !cache;

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

        oImage.src = image + (this.flush ? '?flush=' + (+new Date()) : '');

        setTimeout(function () {
            if (oImage.bLoaded || oImage.bError || oImage.bAbort) {return}
            oImage.onabort();
        }, this.timeout);
    };
    /**
    * A inner function to be called when every image request finishes
    * @private
    */
    ImagePreloader.prototype.onComplete = function (oImage) {
        this.nProcessed++;
        if (this.nProcessed === this.aImages.length && typeof this.complete === 'function') {
            this.complete(this.aImages, this.nLoaded);
        }
        if (typeof this.one === 'function') {
            this.one(oImage, this.aImages, this.nProcessed, this.nLoaded);
        }
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
        if (!this.bAbort) {
            this.bAbort = true;
            this.oImagePreloader.onComplete(this);
        }
    };
})(this, this.document);
