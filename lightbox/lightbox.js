(function (window, document, undefined) {
	'use strict';
        /**
         * hg.Lightbox A basic lightbox for webpage, inherit it if you want some amazon effect
         * @constructs
         * @param {String|Object} box A cssQuery string, dom object or jQuery object which is for operation
         * @param {Boolean} [draggable=true] Whether to allow dragging
         * @param {Boolean} [exclusive=true] Whether to attach a big enough background to make all the content except the lightbox itself non-interactive
         * @param {Object} maskStyle Css for mask
         * @param {String|Array} pos
        */
        function Lightbox(args) {
            this.box = null;
            this.draggable = true;
            this.exclusive = true;
            this.maskStyle = null;

            this.clone(this, args);

			this.status = false;

            if (this.exclusive) {
                this.mask = document.createElement('div');
                this.mask.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; display: none;';
                this.mask.className = this.maskStyle;
                document.body.appendChild(this.mask);
            }

            if (this.draggable) {
            }
        };

		Lightbox.prototype.clone = function (destination, source) {
			for (var key in source) {
				destination[key] = source[key];
			}
		};

        Lightbox.prototype.position = function () {
			this.x = (window.innerWidth - this.box.offsetWidth) / 2;
			this.y = (window.innerHeight - this.box.offsetHeight) / 2;

			this.box.style.left = this.x;
			this.box.style.top = this.y;
		};
        /**
        * Show the lightbox
        * @public
        */
        Lightbox.prototype.show = function () {
            this.status = true;
            if (this.exclusive) {this.mask.style.display = 'block';}
            this.box.style.display = 'block';
        };
        /**
        * Hide the lightbox
        * @public
        */
        Lightbox.prototype.hide = function () {
            this.status = false;
            if (this.exclusive) {this.mask.style.display = 'none';}
            this.box.style.display = 'none';
        };

})(this, this.document);
