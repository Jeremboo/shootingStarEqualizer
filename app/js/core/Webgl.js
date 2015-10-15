'use strict';

class Webgl {

	constructor( ){

		this.scene = new THREE.Scene();

	    this.camera = new THREE.PerspectiveCamera(50, 0, 1, 1000);

	    this.renderer = new THREE.WebGLRenderer({
	    	antialias : true
	    });
	    this.renderer.setPixelRatio( window.devicePixelRatio );
	    this.renderer.setClearColor(0x262626);

	    this.dom = this.renderer.domElement;

	    this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind( this );
		this._binds.onResize = this._onResize.bind( this );
	}

	init() {
		window.addEventListener( "resize", this._binds.onResize, false );
    	window.addEventListener( "orientationchange", this._binds.onResize, false );
	    this._onResize();
	}

	add(mesh) {
		this.scene.add(mesh);
	}

	_onUpdate() {
	    this.renderer.render( this.scene, this.camera );
	}

	_onResize() {
	  	let width = window.innerWidth;
		let height = window.innerHeight;

    	this.camera.aspect = width / height;
    	this.camera.updateProjectionMatrix();

    	this.renderer.setSize(width, height);
	}
}

module.exports = new Webgl();