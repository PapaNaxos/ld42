var config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

var worldText;

function preload ()
{
}

function create ()
{
	var lw = 2500;
	var lh = 2000;
	var scene = this;
	this.textures.once('addtexture', function(){ 
		scene.add.image(lw/2+20,lh/2+20, 'land'); 
		worldText = scene.add.text(10, 10, "The World of Diluculo");
	});

	var land = createLandImage(lw, lh);
	this.textures.addBase64('land', 'data:image/png;base64,' + land.getBase64());

	cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta)
{
	var mc = this.cameras.main;
	if (cursors.left.isDown)
	{
		mc.setScroll(mc.scrollX - delta, mc.scrollY);
	}
	else if (cursors.right.isDown)
	{
		mc.setScroll(mc.scrollX + delta, mc.scrollY);
	}

	if (cursors.up.isDown)
	{
		mc.setScroll(mc.scrollX, mc.scrollY - delta);
	}
	else if (cursors.down.isDown)
	{
		mc.setScroll(mc.scrollX, mc.scrollY + delta);
	}
}

function createLandImage(w,h)
{
	//var s = new SimplexNoise('papa');
	var s = new SimplexNoise();

	var img = new PNGlib(w, h, 256);

	var getColor = function(val, last)
	{
		var r, g, b;

		if ( val <= 50 )
		{
			r = 0; g = 0; b = 205 + 50 * (val / 50);
		}
		else if ( val <= 60 )
		{
			r = 150; g = 150; b = 0;
		}
		else if ( val <= 200 )
		{

			r = 0;
			g = 255 - ((val-60)/140) * 100;
			b = 0;

			//g = 220;
		}
		else
		{
			//val += 100;
			r = val; g = val; b = val; 

			r = g = b = 255;
		}


		r = r > 255 ? 255 : (r < 0 ? 0: r);
		g = g > 255 ? 255 : (g < 0 ? 0: g);
		b = b > 255 ? 255 : (b < 0 ? 0: b);

		//cheeeeap shadowing, probalby blech
		if ( last > val )
		{
			var drop = 0.95;
			r *= drop; 
			g *= drop; 
			b *= drop;
		}
		return {r: r, g: g, b: b};
	};

	var weightAboveX = function(val, threshold, tween)
	{
		if ( val > threshold ) return 1.0;
		if ( threshold - val < tween) return (threshold - val) / tween;
		return 0;
	};

	var cont = w*0.65;
	var lastVal = 0;
	for (var y = 0; y < h; ++y)
	{
		for (var x = 0; x < w; ++x)
		{
			//var val = s.noise2D(x/cont, y/cont) * 0.8;
			//var val = s.noise2D(x/cont, y/cont) * 0.5 - 0.5;
			var val = s.noise2D(x/cont, y/cont) * 0.5 + 0.5;
			val = -0.0 - val * val;
			var scale = cont * 0.5;
			var str = 0.85;
			while(scale > 5)
			{
				val = val + s.noise2D(x/scale, y/scale) * str;
				str = str * 0.5;
				//str = str * 0.5 + (val > 0 ? val*0.2 : 0);
				scale = scale * 0.5;
			}
			// var mscale = cont * 0.1;
			// var mount = s.noise2D(x / mscale, y / mscale) * 0.32 + 0.3;
			// mscale *= 0.75;
			// mount = mount + s.noise2D(x / mscale, y / mscale) * 0.16;
			// mscale *= 0.75;
			// mount = mount + s.noise2D(x / mscale, y / mscale) * 0.08;
			// val = val + mount * weightAboveX(val, 0.3, 0.3);

			// val = val + s.noise2D(x/300, y/300) * 0.5;
			// val = val + s.noise2D(x/80, y/80) * 0.25;
			// val = val + s.noise2D(x/25, y/25) * 0.125;
			val = val * 0.5 + 0.5;
			//val = s.noise2D(x/100, y/100) * 0.5 + 0.5;
			val = val * 255;
			val = val > 255 ? 255 : (val < 0 ? 0: val);

			var edge = Math.min(x, Math.min(w-x, Math.min(y, Math.min(h-y))));
			if ( edge < w*0.2 )
				val = val * (edge / (w*0.2));
			//var cx = w/2, cy = h/2;
			//var ox = x-cx, oy = y-cy;
			//var d = 200;
			//var d2 = d*d;
			//var d3 = (d+20)*(d+20);
			//var pd = ox*ox + oy*oy;
			//if ( pd > d2 )
			//{
			//	pd = pd - d2;
			//	val = val * (d3 - d2 - pd) / (d3 - d2);
			//}
			//val = val > 255 ? 255 : (val < 0 ? 0: val);
			
			var pixel = getColor(val, lastVal);
			img.buffer[img.index(x,y)] = img.color(pixel.r, pixel.g, pixel.b, 255);
			lastVal = val;
		}
	}
	return img;
}
