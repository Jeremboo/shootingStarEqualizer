import webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import sound from 'js/core/Sound';
import Ray from 'js/components/Ray';
import Switcher from 'js/DOMComponents/Switcher'

import progressBar from 'js/DOMComponents/ProgressBar'
import props from 'js/props';

const rays = [];
const nbrOfRays = 25;

const header = document.getElementById('header');
const switcherTitle = new Switcher(document.getElementById('switcher-title'));
const switcherHeaderBtn = new Switcher(document.getElementById('switcher-button'));
const switcherStartBtn = new Switcher(document.getElementById('switcher-start'));


// ##
// INIT WEBGL
webgl.init();
webgl.camera.position.x = 1000;
document.body.appendChild(webgl.dom);
loop.add(webgl._binds.onUpdate);


// ##
// SHOW HEADER
showHeader();


// ##
// CREATE LIGHT
const light = new THREE.AmbientLight(0xffffff);
light.position.set(20, 20, 20);
webgl.add(light);


// ##
// CREATE RAYS
let ray, i;
for (i = 0 ; i < nbrOfRays ; i++) {
  ray = new Ray(i, light);
  rays.push(ray);
  webgl.add(ray.rayMesh);
  loop.add(ray._binds.onUpdate);
};


// ##
// GUI
const gui = new dat.GUI();
gui.add(props, 'Amplitude', 0.1, 1);
gui.add(props, 'Sensitivity', 0.001, 0.1);
gui.add(props, 'Rotation', 0.01, 2);
gui.close();


// ##
// ZOOM CAMERA
const moveCamera = function() {
  const dist = (Math.cos(webgl.cameraRotation) * webgl.cameraZ) - webgl.camera.position.x;
  if(dist < -2) {
    webgl.camera.position.x += dist * .015;
  } else {
    loop.remove(moveCamBinded);
  }
};
const moveCamBinded = moveCamera.bind(moveCamera);
loop.add(moveCamBinded);


// ##
// LOAD AND START SOUND
sound.load('mp3/Point Point - Morning BJ.mp3')
sound.on('start', () => {
  // -- show start button
  switcherHeaderBtn.element.style.cursor = 'pointer';
  switcherHeaderBtn.element.addEventListener('click', startMusic);
  switcherStartBtn.rotate('rotateY');
  // - start progressbar
  progressBar.init(sound.duration);
  progressBar.start();
});
sound.on('end', () => {
  document.getElementById('btn-name').innerHTML = 'Restart';
  switcherHeaderBtn.element.removeEventListener('click', startMusic);
  switcherHeaderBtn.element.addEventListener('click', restartMusic);
  showHeader();
});


// ##
// ON RESIZE
window.addEventListener('resize', () => {
  webgl._binds.onResize();
}, false);


// ##
// RENDERER
loop.start();

function startMusic() {
  // -- hide Header
  hideHeader();
  // - start update
  let i, j, r, pos, s, somme;
  webgl.mouseControl = true;
  for (i = rays.length - 1; i >= 0; i--) {
    r = rays[i];
    pos = i * 10;
    loop.add(() => {
      s = sound.getData();
      somme = 0;
      for (j = 0 ; j < 10 ; j++) {
        somme += s.freq[pos + j];
      };
      r._binds.updateFreq(somme / 10);
    });
  }
}

function restartMusic() {
  // -- hide Header
  hideHeader();
  // -- sound restart
  sound.restart();
}

function showHeader() {
  header.className = '';
  header.style.display = '';
  header.style.height = 'auto';
  timelaps(2000, () => {
    switcherTitle.rotate('rotateX');
    timelaps(100, () => {
      switcherHeaderBtn.rotate('rotate-X');
      timelaps(400, () => {
        document.getElementById('line').className = 'draw';
      });
    });
  });
}

function hideHeader() {
  switcherTitle.rebase('rotateX');
  switcherHeaderBtn.rebase('rotate-X');
  timelaps(100, () => {
    document.getElementById('line').className = '';
    timelaps(300,() => {
      header.style.display = 'none';
      header.style.height = 0;
    });
  });
}

function timelaps(timer, callback) {
  setTimeout(callback, timer);
}
