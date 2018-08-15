function downloadMap()
{
	download(worldImage, "diluculo_"+g_seed+".png", "image/png");
}

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
var worldImage;
var g_seed = Phaser.Math.RND.between(0,2100000000);

function preload ()
{
	document.getElementById('seed').innerHTML = g_seed + "";
	this.load.image('castle', 'castle.png');
	this.load.image('village', 'village.png');
	Phaser.Math.RND.sow([g_seed]);
}

function create ()
{
	var lw = 2500;
	var lh = 2000;
	var scene = this;
	var land;
	this.textures.once('addtexture', function(){ 
		scene.add.image(lw/2+20,lh/2+20, 'land'); 
		worldText = scene.add.text(10, 10, "The World of Diluculo: (seed: "+g_seed+")");
		populateVillages(scene, land);
	});

	var land = createLandImage(lw, lh);
	worldImage = 'data:image/png;base64,'+land[0].getBase64();

	this.textures.addBase64('land', worldImage);
	cursors = this.input.keyboard.createCursorKeys();

}

function populateVillages(scene, land)
{
	var lw = land[1][0].length;
	var lh = land[1].length;

	var names = [
		'Tomment',
		'Nadra', 
		'Tremont',
		'Andas',
		'Argentum',
		'Abia',
		'Akor',
		'Bendel',
		'Carrow',
		'Chick', 
		'Delvor',
		'Easte',
		'Farrel',
		'Gandel',
		'Himork',
		'Jallen',
		'Korsem',
		'Lepnosk',
		'Lorre',
		'Minan',
		'Nuben',
		'Ollis',
		'Pengol',
		'Quisen',
		'Raele',
		'Ripont',
		'Sepre',
		'Talbor',
		'Tanneba',
		'Ummen',
		'Vorta',
		'Wexa',
		'Xera',
		'Yismmil',
		'Zeptal',
		'Mallowham',
		'Beldale',
		'Meadowdell',
		'Dracfort',
		'Merribourne',
		'Merribourne',
		'Draclake',
		'Coldwater',
		'Ironview',
		'Wayville',
		'Wellfield',
		'Greysnow',
		'Barrowedge',
		'Wildebourne',
		'Glassfield',
		'Raygate',
		'Springacre',
		'Newbrook',
		'Wellfox',
		'Stonewater',
		'Belmere',
		'Dorcastle',
		'Violetwall',
		'Roseviolet',
		'Merriedge',
		'Merriwick',
		'Wolfbush',
		'Norville',
		'Linford',
		'Foxcoast',
		'Wintermarble',
		'Merrimarsh',
		'Valmoor',
		'Highkeep',
		'Spellley',
		'Redelf',
		'Fallfox',
		'Ironness',
		'Brookcoast',
		'Violethaven',
		'Strongshade',
		'Lincliff',
		'Edgehedge',
		'Witchwyn',
		'Westerrose',
		'Bycastle',
		'Violetcastle',
		'Bridgehaven',
		'Aldford',
		'Aldston',
		'Greyrock',
		'Newbridge',
		'Northcoast',
		'Wyvernpond',
		'Silvermarsh',
		'Redhall',
		'Witchbush',
		'Marshholt',
		'Lochdale',
		'Coldmallow',
		'Crystalpond',
		'Estermere',
		'Lakeshore',
		'Clearapple',
		'Starrygate',
		'Eritown',
		'Fallvale',
		'Prybarrow',
		'Strongwinter',
		'Aelpond',
		'Eribush',
		'Deepshore',
		'Brookmount',
		'Deepwolf',
		'Highwyn',
		'Wildegate',
		'Deepsummer',
		'Riverhollow',
		'Mallowburn',
		'Lorholt',
		'Lochburn',
		'Wildeway',
		'Falconbourne',
		'Greyloch',
		'Springapple',
		'Oldhedge',
		'Fogdell',
		'Mistdell',
		'Snowfair',
		'Mallowmarble'
	];

	var canPlace = function(x, y, places)
	{
		for (var i = 0; i < places.length; ++i)
		{
			var dx = px - places[i].x;
			var dy = py - places[i].y;
			if ( dx*dx + dy*dy < 10000 )
				return false;
		}
		return true;
	};

	var places = [];
	while(places.length < 40)
	{
		var px = Phaser.Math.RND.between(0, lw-1);
		var py = Phaser.Math.RND.between(0, lh-1);
		//var px = Phaser.Math.RND.between(lw*0.2, lw*0.8);
		//var py = Phaser.Math.RND.between(lh*0.2, lh*0.8);
		if ( land[1][py][px] < 65 || land[1][py][px] > 200 )
			continue;

		if ( !canPlace(px, py, places) )
			continue;

		var name = names[ Phaser.Math.RND.between(0, names.length-1) ];

		var z = Phaser.Math.RND.between(0,3);
		
		if ( z == 0 )
			name = name + ' Dale';
		else if ( z == 1 ) 
			name = name + ' Village';
		else if ( z == 2 )
			name = name + ' Burrough';
		else
			name = name + ' City';

		places.push({
			x: px,
			y: py,
			name: name,
			icon: 'village'
		});
	}

	while(places.length < 50)
	{
		var px = Phaser.Math.RND.between(0, lw-1);
		var py = Phaser.Math.RND.between(0, lh-1);
		//var px = Phaser.Math.RND.between(lw*0.2, lw*0.8);
		//var py = Phaser.Math.RND.between(lh*0.2, lh*0.8);
		if ( land[1][py][px] < 65 || land[1][py][px] > 200 )
			continue;

		if ( !canPlace(px, py, places) )
			continue;

		var name = names[ Phaser.Math.RND.between(0, names.length-1) ];

		var z = Phaser.Math.RND.between(0,2);
		
		if ( z == 0 )
			name = 'Castle ' + name;
		else if ( z == 1 ) 
			name = name + ' Citadel';
		else
			name = name + ' Fortress';

		places.push({
			x: px,
			y: py,
			name: name,
			icon: 'castle'
		});
	}

	console.log('places: ');
	console.log(places);
	for (var i = 0; i < places.length; ++i)
	{
		var p = places[i];
		scene.add.image( p.x, p.y, p.icon );
		scene.add.text( p.x-50, p.y-30, p.name, {backgroundColor: "black"});
	}
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
	var worldMap = Array(h);
	for (var i = 0; i < h; ++i)
		worldMap[i] = Array(w);

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
			
			worldMap[y][x] = val;
			var pixel = getColor(val, lastVal);
			img.buffer[img.index(x,y)] = img.color(pixel.r, pixel.g, pixel.b, 255);
			lastVal = val;
		}
	}
	return [img, worldMap];
}
