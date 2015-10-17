import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import sound from 'js/core/Sound';
import Ray from 'js/components/Ray';
import ProgressBar from 'js/DOMComponents/ProgressBar'
import props from 'js/props';

let rays = [];
let nbrOfRays = 25;
let progressBar = new ProgressBar(document.getElementById('progress-bar'));
let fPage = document.getElementById('first-page');
let startBtn = document.getElementById('switcher-button');


// ##
// INIT WEBGL
webgl.init();
webgl.camera.position.x = 1000;
document.body.appendChild( webgl.dom );
loop.add(webgl._binds.onUpdate);

// ##
// SHOW HEADER
showHeader();

// ##
// CREATE LIGHT
let light = new THREE.AmbientLight( 0xffffff );
light.position.set(20, 20, 20);
webgl.add(light);


// ##
// CREATE RAYS
for (let i = 0 ; i < nbrOfRays ; i++) {
	let ray = new Ray(i, light);
	rays.push( ray );
	webgl.add( ray.rayMesh );
	loop.add(ray._binds.onUpdate);
};

// ##
// GUI
let gui = new dat.GUI();
gui.close();
gui.add(props, 'Amplitude', 0.1, 1);
gui.add(props, 'Sensitivity', 0.001, 0.1);
gui.add(props, 'Rotation', 0.01, 2);


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
sound.load( "mp3/Point Point - Morning BJ.mp3" )
sound.on( "start", () => {
	// -- show start button
	rorateSwitch(document.getElementById('switcher-start'), 'rotateY');
	startBtn.style.cursor = 'pointer';
	startBtn.addEventListener("click", startMusic);
	// - start progressbar
	progressBar.init(sound.duration);
	progressBar.start();
});
sound.on( "end", () => {
	document.getElementById('btn-name').innerHTML = "Restart";
	console.log(document.getElementById('btn-name'));
	startBtn.removeEventListener("click", startMusic);
	startBtn.addEventListener("click", restartMusic);
	showHeader();
});

// ##
// ON RESIZE
window.addEventListener( "resize", () => {
	webgl._binds.onResize();
}, false );
// ##
// RENDERER
loop.start();

function startMusic() {

	// -- hide Header
	hideHeader();

	// - start update
	webgl.mouseControl = true;
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

function restartMusic(){
	// -- hide Header
	hideHeader();
	// -- sound restart
	sound.restart();
}

function showHeader(){
	fPage.className = "";
	fPage.style.display = "";
	fPage.style.height = "auto";
	timelaps(2000, () => {
		rorateSwitch(document.getElementById('switcher-title'), 'rotateX');
		timelaps(100, () => {
			rorateSwitch(startBtn, 'rotate-X');
			timelaps(400, () => {
				document.getElementById('line').className = 'draw';
			});
		});
	});
}

function hideHeader(){
	removeSwitch(document.getElementById('switcher-title'), 'rotateX');
	removeSwitch(startBtn, 'rotate-X');
	timelaps(100, () => {
		document.getElementById('line').className = '';
		timelaps(300,() => {	
			fPage.style.display = "none";
			fPage.style.height = 0;
		});
	});
}


function timelaps(timer, callback){
	setTimeout(callback, timer);
}
function rorateSwitch(element, action){
	element.getElementsByClassName('switcher')[0].classList.add(action);
}
function removeSwitch(element, action){
	element.getElementsByClassName('switcher')[0].classList.remove(action);
}
