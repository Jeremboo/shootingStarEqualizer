import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import sound from 'js/core/Sound';
import Ray from 'js/components/Ray';
import props from 'js/props';

let rays = [];
let nbrOfRays = 25;
let gui = new dat.GUI();

// ##
// INIT
// - webgl
webgl.init();
document.body.appendChild( webgl.dom );
loop.add(webgl._binds.onUpdate);
// - gui
gui.add(props, 'freqAmpl', 0.1, 1);
gui.add(props, 'velRay', 0.001, 0.1);
gui.add(props, 'vitRotation', 0.01, 2);

let cameraControlZ = gui.add(props, 'cameraZ', 0, 1000);
cameraControlZ.onChange((v) => {
	props.cameraZ= v;
	changeCameraRotation();
});

let cameraControlX = gui.add(props, 'cameraRotation',0.00,6.28);
cameraControlX.onChange((v) => {
	props.cameraRotation = v;
	changeCameraRotation();
});

// ##
// POSITIONNING THE CAMERA
webgl.camera.position.z = props.cameraZ;
webgl.camera.position.x = props.cameraZ;
changeCameraRotation(props.cameraRotation)
webgl.camera.position.x = 1000;


// ##
// CREATE RAYS
for (let i = 0 ; i < nbrOfRays ; i++) {
	let ray = new Ray(i);
	rays.push( ray );
	webgl.add( ray.rayMesh );
};

// ##
// LOAD AND START SOUND
sound.load( "mp3/01 Canned Heat.mp3" )
sound.on( "start", () => {

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
		  	r._binds.onUpdate(somme/10);
		});
	};

	// - move camera
	let moveCamera = function() {
		let dist = (Math.cos( props.cameraRotation ) * props.cameraZ) - webgl.camera.position.x;
		if(dist < -2){
			webgl.camera.position.x += dist * .015;
		} else {
			loop.remove(moveCamBinded);
		}
	};
	let moveCamBinded = moveCamera.bind(moveCamera);
	loop.add( moveCamBinded );
});

function changeCameraRotation(){
	webgl.camera.position.x = Math.cos( props.cameraRotation ) * props.cameraZ;
	webgl.camera.position.y = 30;
	webgl.camera.position.z = Math.sin( props.cameraRotation ) * props.cameraZ;
	webgl.camera.lookAt( webgl.scene.position );
}

// ##
// RENDERER
loop.start();