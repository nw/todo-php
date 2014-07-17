/*
Script: Fx.Block.js
	Class to split an element into smaller blocks and morph each of those blocks accordingly.

License:
	MIT-style license.
*/

Fx.Block = new Class({

	Extends: Fx.CSS,

	options: {
		rows: 6,
		cols: 6,
		effect: null,
		duration: 1300,
		delay: 700,
		transition: Fx.Transitions.Sine.easeOut
	},
	
	clips: [],

	initialize: function(element, options){
		this.element = this.subject = $(element);
		this.parent(options);
		ord = this.element.getCoordinates();
		sy = ((ord.height*1.05) / this.options.rows);
		rsy = Math.round(sy);
		sx = ((ord.width*1.05) / this.options.cols);
		rsx = Math.round(sx);
		ml = this.element.getStyles('margin-left')['margin-left'].toInt();
		mt = this.element.getStyles('margin-top')['margin-top'].toInt();
		xcache = [];
		for (y = 0; y < this.options.rows; y++) {
			oy = Math.round(rsy * y);
			for (x = 0; x < this.options.cols; x++) {
				ox = 0;
				if (y == 0) {
					ox = Math.round(rsx * x);
					xcache[x] = ox;
				} else
					ox = xcache[x];
				c = this.element.clone();
				c.set('styles', {
					'position': 'absolute',
					'left': ord.left - ml,
					'top': ord.top - mt,
					'width': ord.width - 2, // 2? is this just my environment? without this the clipped elements create a larger full element
					'height': ord.height - 2,
					'clip': 'rect('+oy+'px '+(ox+rsx)+'px '+(oy+rsy)+'px '+ox+'px)'
				});
				c.set('morph', {
					duration: this.options.duration, 
					transition: this.options.transition,
					onComplete: function() {
						this.element.destroy();
					}
				});
				c.store('morph_prop', this.options.effect(c, x, y, this.options.cols, this.options.rows, this.options.delay));
				this.clips.include(c);
			}
		}
		$(document.body).adopt(this.clips);
		this.element.setStyle('visibility', 'hidden');
	},

	start: function(){
		this.clips.each(function (c) {
			m = c.retrieve('morph_prop');
			d = m.delay == null ? 0 : m.delay;
			c.morph.delay(d, c, m);
		});
	}

});


// ================================= Effects ======================================
// function(block element, x position, y position, total cols, total rows, max delay)

// uniformly drop the bits, starting from the bottom right
Fx.Block.DropUniform = function(e, x, y, c, r, d) {
	return {
		'margin-top': 200,
		'opacity': 0,
		'delay': ( ((r-y)*c)*(d/(c*r)) + (c-x)*(d/(c*r)) )
	};
};

// drop the bits randomly
Fx.Block.DropRandom = function(e, x, y, c, r, d) {
	return {
		'margin-top': 200,
		'opacity': 0,
		'delay': Math.round(Math.random()*d)
	};
};

// fade linearly from left to right, top to bottom
Fx.Block.FadeUniform = function(e, x, y, c, r, d) {
	return {
		'opacity': 0,
		'delay': ( (y*c)*(d/(c*r)) + x*(d/(c*r)) )
	};
};

// total random fade
Fx.Block.FadeRandom = function(e, x, y, c, r, d) {
	return {
		'opacity': 0,
		'delay': Math.round(Math.random()*d)
	};
};

// explode the box
Fx.Block.Explode = function(e, x, y, c, r, d) {
	q = (Math.random() * 70) + 30;
	dx = (x-(c/2)+1) * q;
	dy = (y-(r/2)+1) * q;
	//t = Math.tan(dy/dx) + (Math.random()*20);
	return {
		'margin-top': dy,
		'margin-left': dx,
		'opacity': 0,
		'delay': 0
	};
};

// quake under the box - found it effective when used with: transition: Fx.Transitions.Bounce.easeOut
Fx.Block.Quake = function(e, x, y, c, r, d) {
	return {
		'margin-top': Math.random()*6-2,
		'margin-left': Math.random()*6-2,
		'opacity': 0,
		'delay': Math.round(Math.random()*(d/2))
	};
};

// fade from top to bottom
Fx.Block.FadeSouth = function(e, x, y, c, r, d) {
	return {
		'opacity': 0,
		'delay': (y*(d/r))
	};
};

// fade from west to east
Fx.Block.FadeEast = function(e, x, y, c, r, d) {
	return {
		'opacity': 0,
		'delay': (x*(d/c))
	};
};

// block fade from northwest to south east
Fx.Block.FadeSouthEast = function(e, x, y, c, r, d) {
	return {
		'opacity': 0,
		'delay': ((x*y)*(d/(c*r)))
	};
};

// block fade, with a touch of randomness, from northwest to south east
Fx.Block.FadeSouthEastRandom = function(e, x, y, c, r, d) {
	r = ( ((x*y)+(Math.random()*(r*2)-r)) *(d/(c*r*2))) + (d/(c*r*2));
	return {
		'opacity': 0,
		'delay': r < 0 ? 0 : r 
	};
};

// block fade from northwest to south east
Fx.Block.ShearHoriz = function(e, x, y, c, r, d) {
	return {
		'margin-left': (y % 2 == 0 ? 1 : -1) * 170,
		'opacity': 0,
		'delay': 0
	};
};