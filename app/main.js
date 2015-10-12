import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import Ray from 'js/components/Ray';

var rays = [];

// ##
// INIT
webgl.init();
document.body.appendChild( webgl.dom );
loop.add(webgl._binds.onUpdate);


// ##
// OBJECTS
for (var i = 0 ; i < 10 ; i++) {
	let ray = new Ray();
	rays.push(ray);
	webgl.add( ray.mesh );
	loop.add( ray._binds.onUpdate);
};


// ##
// RENDERER
loop.start();