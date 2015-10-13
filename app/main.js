import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import sound from 'js/core/Sound';
import Ray from 'js/components/Ray';

var rays = [];

// ##
// INIT
webgl.init();
document.body.appendChild( webgl.dom );
loop.add(webgl._binds.onUpdate);


// ##
// OBJECTS
for (var i = 0 ; i < 25 ; i++) {
	let ray = new Ray(i);
	rays.push(ray);
	webgl.add( ray.rayMesh );
};

// ##
// SOUND
sound.load( "mp3/glencheck_vivid.mp3" )
sound.on( "start", () => {
	for (var i = rays.length - 1; i >= 0; i--) {

		let r = rays[i];
		let pos = i*10;

		loop.add( () => {
			let s = sound.getData();
		  	r._binds.onUpdate(s.freq[pos]);
		});
	};
})

// ##
// RENDERER
loop.start();