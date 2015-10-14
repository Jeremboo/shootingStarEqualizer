class Ray extends THREE.Object3D {
	constructor(i){
		super();

		// ##
		// CONST
		this.radiusSegment = 10;
		this.heightSegment = 40;

		this.attribute = (i < 4) ? 12 : i*3;


		// ##
		// RANDOM VALUES
		this.size = _.random(10, this.attribute)/10;
		this.moveBy = _.random(50,100);
		this.cylinderHeight = _.random(10, 150);
		this.colors = [0xF7EF81,0xD4C685,0xCFE795,0xA7D3A6,0xADD2C2,0xBB4430,0x7EBDC2,0xCF1259];

		this.dist = _.random(0,800)/10;
		this.pos = {
			y : _.random(-this.dist,this.dist),
			z : _.random(-this.dist,this.dist)
		}

		this.t = 0;


		// - velocities
		this.vel = _.random(10, 15)*0.10;
		this.velRotation = _.random(1,200)*0.0001;
		this.velSound = 0;
		this.velMax = 3;

		// ##
		// OTHER VAR
		this.actualDist = 0;
		this.toActualDist = this.dist;
		this.soundDist = -1;
		this._oldSoundDist = 0;

		// - array for train
		this.oldPos = [];
		for (var i = 0; i < this.heightSegment; i++) {
			this.oldPos.push(new THREE.Vector3());
		};


		// ##
		// CREATE THREE OBJECTS
		this.material = new THREE.MeshBasicMaterial( { color: this.colors[_.random(0,this.colors.length-1)]} );

		this.rayMesh = new THREE.Object3D();
		this.rayMesh.position.x = -100;
		this.rayMesh.position.y = this.pos.y;
		this.rayMesh.position.z = this.pos.z;

		this.sphereGeometry = new THREE.SphereGeometry( this.size*2, 32, 32 );
		this.sphereMesh = new THREE.Mesh( this.sphereGeometry, this.material );

		this.cylinderGeometry = new THREE.CylinderGeometry( this.size/10, this.size, this.cylinderHeight, this.radiusSegment, this.heightSegment, true );
		this.cylinderGeometry.verticesNeedUpdate = true;
		this.cylinderMesh = new THREE.Mesh( this.cylinderGeometry, this.material );
		this.cylinderMesh.rotation.z = 1.57;
		this.cylinderMesh.position.x = -this.cylinderHeight/2;

		this.rayMesh.add(this.cylinderMesh);
		this.rayMesh.add(this.sphereMesh);

		// ##
		// SAVE INITIAL CYLINDER POSITION
		this._cylinderVertices = [];
		for (var i = 0; i < this.cylinderGeometry.vertices.length; i++) {
			this._cylinderVertices.push(this.clone(this.cylinderGeometry.vertices[i]));
		};

		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	_onUpdate(freq) {

		// ##
		// SAVE OLD POSITION
		this.oldPos.splice(0,1);
		this.oldPos.push(this.clone(this.rayMesh.position));

		// ##
		// FIRST TRANSLATION
		if(this.moveBy > 0 && this.vel < this.velMax ){
	     	this.vel += 0.01;
	     	this.moveBy -= this.vel;
	     } else if(this.vel > 0 ) {
	     	this.vel *= 0.95;
	     }

		this.rayMesh.position.x += this.vel*0.9;

	  	// ##
	  	// Rotation
	  	//this.mesh.rotation.x += 0.01;
	  	//this.mesh.rotation.y += 0.01;

	  	// ##
	  	// DIST BY SOUND
	  	let soundDist = this.dist + (freq);
	  	let soundForce = this.actualDist - soundDist;
		let forceDirection = (soundDist < 0) ? -1 : 1;

		this.toActualDist = soundDist/4;

		this.actualDist += ( this.toActualDist - this.actualDist ) * .05



	  	// ##
	  	// AXE ROTATIONS
	  	var t = Date.now()*this.velRotation;
	  	this.t += this.velRotation;
		this.rayMesh.position.y = Math.cos( this.t ) * this.actualDist;
		this.rayMesh.position.z = Math.sin( this.t ) * this.actualDist;
		//this.rayMesh.position.y = this.actualDist;
		//this.rayMesh.position.z =  this.actualDist;

		this.rayMesh.position.x += Math.sin( t ) * 0.05;



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
				this.cylinderGeometry.vertices[p].x = this._cylinderVertices[p].x + dx/2;
				this.cylinderGeometry.vertices[p].y = this._cylinderVertices[p].y + dy/2;
				this.cylinderGeometry.vertices[p].z = this._cylinderVertices[p].z + dz/2;
			};
		};	
	}

	clone(object){
		return JSON.parse(JSON.stringify(object));
	}
}

module.exports = Ray;