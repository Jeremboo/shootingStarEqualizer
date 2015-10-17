import props from 'js/props';

class Webgl {

	constructor( ){
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.mouseDown = false;
		this.mouseControl = false;
		this.cameraRotation = 0.4;
		this.cameraZ = 480;

		this.scene = new THREE.Scene();

	    this.camera = new THREE.PerspectiveCamera(50, 0, 1, 1000);
	    this.camera.position.z = this.cameraZ;
		this.camera.position.x = this.cameraZ;
		this.changeCameraRotation(this.cameraRotation)

	    this.renderer = new THREE.WebGLRenderer({
	    	antialias : true
	    });
	    this.renderer.setPixelRatio( window.devicePixelRatio );
	    this.renderer.setClearColor(0x0c171a);
	    this.dom = this.renderer.domElement;

	    this.usePostprocessing = true;
    	this.composer = new WAGNER.Composer(this.renderer);
    	this.composer.setSize(this.width, this.height);
   		this.initPostprocessing();

	    this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind( this );
		this._binds.onResize = this._onResize.bind( this );
		this._binds.onMouseMove = this._onMouseMove.bind( this );
		this._binds.onMouseDown = this._onMouseDown.bind( this );
		this._binds.onMouseUp = this._onMouseUp.bind( this );
		this._binds.onWheel = this._onWheel.bind( this );


	    // ##
		// MOUSE CONTROL
		this.dom.addEventListener("mousemove", this._binds.onMouseMove);
		this.dom.addEventListener("mousedown", this._binds.onMouseDown); 
		this.dom.addEventListener("mouseup", this._binds.onMouseUp);
		this.dom.addEventListener("mousewheel", this._binds.onWheel);		


	}

	init() {
    	window.addEventListener( "orientationchange", this._binds.onResize, false );
	    this._onResize();
	}

	initPostprocessing() {
	    if (!this.usePostprocessing) return;

	    this.vignette2Pass = new WAGNER.Vignette2Pass();
	    this.fxaaPass = new WAGNER.FXAAPass();
	  }

	add(mesh) {
		this.scene.add(mesh);
	}

	_onUpdate() {
	    if (this.usePostprocessing) {
	      this.composer.reset();
	      this.composer.renderer.clear();
	      this.composer.render(this.scene, this.camera);
	      this.composer.pass(this.fxaaPass);
	      this.composer.pass(this.vignette2Pass);
	      this.composer.toScreen();
	    } else {
	      this.renderer.autoClear = false;
	      this.renderer.clear();
	      this.renderer.render(this.scene, this.camera);
	    }
	}

	_onResize() {
	  	let width = window.innerWidth;
		let height = window.innerHeight;

    	this.camera.aspect = width / height;
    	this.camera.updateProjectionMatrix();

    	this.renderer.setSize(width, height);
	}

	_onMouseMove(e) {
		if(this.mouseDown && this.mouseControl){
			document.body.style.cursor = 'pointer';
			this.cameraRotation += e.movementX*0.007;
			this.changeCameraRotation();
		}
	}
	_onMouseDown() {
		this.mouseDown = true;
	}
	_onMouseUp() {
		this.mouseDown = false;
		document.body.style.cursor = 'auto';
	}
	_onWheel(e) {
		this.cameraZ += e.wheelDelta/5;
		this.changeCameraRotation();
	}

	
	changeCameraRotation(){
		this.camera.position.x = Math.cos( this.cameraRotation ) * this.cameraZ;
		this.camera.position.y = 50;
		this.camera.position.z = Math.sin( this.cameraRotation ) * this.cameraZ;
		this.camera.lookAt( this.scene.position );
	}
}

module.exports = new Webgl();