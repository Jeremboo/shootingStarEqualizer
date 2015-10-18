# Shooting Star Equalizer

WebGL project in [Three.js](http://threejs.org) realized during a workshop at Gobelins, l'école de l'image. The aim was to create an equalizer in 3D.

<img alt="Screenshot" src="https://github.com/Jeremboo/shootingStarEqualizer/blob/master/images/screenshot.jpg?raw=true">

## How seeing this

If you want to vizualize my project, please :

* Install (if you don't have them) :
    * [Node.js](http://nodejs.org): `brew install node` on OS X
    * [Bower](http://bower.io): `npm install -g bower`
    * NPM and Bower dependencies: `npm install & bower install`.
* Start with `npm start` to show my projet at [http://localhost:3333/](http://localhost:3333/)

## Steps 



- Create a class for my rays with a random rotation :

<img alt="20151012_step1" src="https://github.com/Jeremboo/shootingStarEqualizer/blob/master/gifs/20151012_step1.gif?raw=true" width="300">

- Add a cylinder for the drag and began to manipulate vertices :

<img alt="20151013_step2" src="https://github.com/Jeremboo/shootingStarEqualizer/blob/master/gifs/20151013_step2.gif?raw=true" width="300">

- Add old sphere positions saved in an array for each vertices of a cylinder : 

<img alt="20151014_step3" src="https://github.com/Jeremboo/shootingStarEqualizer/blob/master/gifs/20151014_step3.gif?raw=true" width="300">

- Linking the rays (or other ;-) ) with musical frequencies  :

<img alt="20151014_step4" src="https://github.com/Jeremboo/shootingStarEqualizer/blob/master/gifs/20151014_step4.gif?raw=true" width="300">

- Optimize drag effect, colors, velocity, easing and other parameters : 

<img alt="20151015_step5" src="https://github.com/Jeremboo/shootingStarEqualizer/blob/master/gifs/20151015_step5.gif?raw=true" width="300">

- Add toon shaderring and light :

<img alt="20151015_step6" src="https://github.com/Jeremboo/shootingStarEqualizer/blob/master/gifs/20151015_step6.gif?raw=true" width="300">

<img alt="20151016_step7" src="https://github.com/Jeremboo/shootingStarEqualizer/blob/master/gifs/20151016_step7?raw=true" width="300">

- Add WAGNER post processing (Vignette & FXAA pass) :

<img alt="20151018_step8" src="https://github.com/Jeremboo/shootingStarEqualizer/blob/master/gifs/20151018_step8.gif?raw=true" width="300">

- Create introduction :

<img alt="20151018_step9" src="https://github.com/Jeremboo/shootingStarEqualizer/blob/master/gifs/20151018_step9.gif?raw=true" width="300">
