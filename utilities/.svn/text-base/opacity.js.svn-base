function opacity (level) {
	            if (node.filters) {
					arguments.callee = function (level) {
						if (typeof level === 'undefined') {
							var reg = /opacity=([0-9]+)/;
							var filters = reg.exec(node.style.filters);
							if (!filters) {
								return filters[1];
							}
							else {
								filters = reg.exec(node.currentStyle['filter']);
								if (!filters) {
									return filters[1];
								}
								else {
									return 100;
								}
							}
						}
						else {
							node.style.filters = 'alpha(opacity=' + level + ')';
						}
					}         
	            }
	            else {
					arguments.callee = function (level) {
						if (typeof level === 'undefined') {
							var opacity = 1;
							if (node.style.opacity) {
								opacity = node.style.opacity;
							}
							else {
								var s = document.defaultView.getComputedStyle(node,'');
								opacity = s && s.getPropertyValue('opacity');
							}
							return opacity*100;
						}
						else {
							node.style.opacity = level / 100;
						}
					}
	            }
				
				return arguments.callee(level);
	        }