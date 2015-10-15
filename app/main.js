import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import sound from 'js/core/Sound';
import Ray from 'js/components/Ray';
import props from 'js/props';

let rays = [];
let nbrOfRays = 25;

// ##
// INIT WEBGL
webgl.init();
webgl.camera.position.x = 1000;
document.body.appendChild( webgl.dom );
loop.add(webgl._binds.onUpdate);

// ##
// CREATE LIGHT
let light = new THREE.AmbientLight( 0xffffff );
light.position.set(20, 20, 20);
webgl.add(light);

// ##
// POSITIONNING THE CAMERA


// ##
// CREATE RAYS
for (let i = 0 ; i < nbrOfRays ; i++) {
	let ray = new Ray(i, light);
	rays.push( ray );
	webgl.add( ray.rayMesh );
	loop.add(ray._binds.onUpdate);
};


// ##
// ZOOM CAMERA
let moveCamera = function() {
	let dist = (Math.cos( webgl.cameraRotation ) * webgl.cameraZ) - webgl.camera.position.x;
	if(dist < -2){
		webgl.camera.position.x += dist * .015;
	} else {
		loop.remove(moveCamBinded);
	}
};
let moveCamBinded = moveCamera.bind(moveCamera);
loop.add( moveCamBinded );


// ##
// LOAD AND START SOUND
sound.load( "mp3/music6.mp3" )
sound.on( "start", () => {
	let start = document.getElementById('start');
	start.className = "";
	start.addEventListener("click", startMusic);
});

function startMusic() {

	let fPage = document.getElementById('first-page');
	fPage.className = "hidden";
	setTimeout(() => {
		fPage.style.display = "none";
		fPage.style.height = 0;
	}, 300);

	webgl.mouseControl = true;

	// ##
	// GUI
	let gui = new dat.GUI();
	gui.add(props, 'freqAmpl', 0.1, 1);
	gui.add(props, 'velRay', 0.001, 0.1);
	gui.add(props, 'vitRotation', 0.01, 2);

	// - start update
	for (let i = rays.length - 1; i >= 0; i--) {
		let r = rays[i];
		let pos = i*10;
		loop.add( () => {
			let s = sound.getData();
			let somme = 0;
			for (var j = 0; j < 10; j++) {
				somme += s.freq[pos+j];
			};
			r._binds.updateFreq(somme/10);
		});
	};
}



// ##
// RENDERER
loop.start();