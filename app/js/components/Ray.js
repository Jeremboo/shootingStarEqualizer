import props from 'js/props';
import shaderToon from 'js/shaderToon';

let phongDiffuse = shaderToon["phongDiffuse"];

class Ray extends THREE.Object3D {
	constructor(i, light){
		super();



		// ##
		// INIT
		// - const
		this.radiusSegment = 10;
		this.heightSegment = 100;
		this.color = props.colors[_.random(0,props.colors.length-1)];
		// - var
		this.mId = i;
		this.timer = 0;
		this.actualAmpl = 0;
		this.toAmpl = 0;
		// - random values
		this.size = _.random(10, 50+(this.mId*3))/10;
		this.cylinderHeight = _.random(10, 150);
		this.amplitude = _.random(1,20);
		this.vitRotation = _.random(100,200)*0.001;
		// - THREE objects
		// -- material
		this.phongMaterial = this.createShaderMaterial(light);
		this.phongMaterial.uniforms.uMaterialColor.value.copy(new THREE.Color(this.color));
		this.phongMaterial.side = THREE.DoubleSide;
		this.material = new THREE.MeshBasicMaterial( { color: this.color } );		
		// -- rayMesh
		this.rayMesh = new THREE.Object3D();
		this.rayMesh.position.x = 0;
		// -- sphere
		this.sphereGeometry = new THREE.SphereGeometry( this.size, 32, 32 );
		this.sphereMesh = new THREE.Mesh( this.sphereGeometry, this.phongMaterial );
		// -- cylinder
		this.cylinderGeometry = new THREE.CylinderGeometry( this.size/10, this.size, this.cylinderHeight, this.radiusSegment, this.heightSegment, true );
		this.cylinderGeometry.verticesNeedUpdate = true;
		this.cylinderMesh = new THREE.Mesh( this.cylinderGeometry, this.phongMaterial );
		this.cylinderMesh.rotation.z = 1.57; // 90°
		this.cylinderMesh.position.x = -this.cylinderHeight/2;
		// - arrays
		// -- for trains
		this.oldPos = [];
		for (var i = 0; i < this.heightSegment; i++) {
			this.oldPos.push(new THREE.Vector3());
		};
		// -- for initial cylinder positions 
		this._cylinderVertices = [];
		for (var i = 0; i < this.cylinderGeometry.vertices.length; i++) {
			this._cylinderVertices.push(this.clone(this.cylinderGeometry.vertices[i]));
		};

		// ##
		// ADD
		this.rayMesh.add(this.cylinderMesh);
		this.rayMesh.add(this.sphereMesh);

		
		// ##
		// SAVE BINDING
		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	_onUpdate(freq) {
		// ##
		// SAVE OLD POSITION
		this.oldPos.splice(0,1);
		this.oldPos.push(this.clone(this.rayMesh.position));

	  	// ##
	  	// CHANGE AMPLITUDE ACCORDING TO THE SOUND
		this.toAmpl = this.amplitude + freq*props.freqAmpl;
		this.actualAmpl += ( this.toAmpl - this.actualAmpl ) * props.velRay;

	  	// ##
	  	// UPDATE POSITIONS (AXE ROTATIONS)
	  	this.timer += this.vitRotation*props.vitRotation;
		this.rayMesh.position.y = Math.cos( this.timer ) * this.actualAmpl;
		this.rayMesh.position.z = Math.sin( this.timer ) * this.actualAmpl;
		this.rayMesh.position.x += Math.sin( this.timer ) * props.velTranslateX;

		// ##
		// MOVE TRAIL
		this.cylinderGeometry.verticesNeedUpdate = true;

		let oldPosLength = this.oldPos.length;
		let circleVertices = this.radiusSegment + 1;

		for ( let i = 0 ; i < oldPosLength ; i++) {
			for ( let j = 0 ; j < circleVertices ; j++) {
				let p = j + ( circleVertices * i);

				let dx = this.rayMesh.position.y - this.oldPos[i].y;
				let dy = this.rayMesh.position.x - this.oldPos[i].x;
				let dz = this.rayMesh.position.z - this.oldPos[i].z;

				this.cylinderGeometry.vertices[p].x = this._cylinderVertices[p].x - dx;
				this.cylinderGeometry.vertices[p].y = this._cylinderVertices[p].y - dy;
				this.cylinderGeometry.vertices[p].z = this._cylinderVertices[p].z - dz;
			};
		};	
	}

	createShaderMaterial(light) {

		let u = THREE.UniformsUtils.clone(phongDiffuse.uniforms);


		let vs = phongDiffuse.vertexShader;
		let fs = phongDiffuse.fragmentShader;

		let material = new THREE.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs });

		material.uniforms.uDirLightPos.value = light.position;
		material.uniforms.uDirLightColor.value = light.color;

		return material;

	}


	clone(object){
		return JSON.parse(JSON.stringify(object));
	}
}

module.exports = Ray;