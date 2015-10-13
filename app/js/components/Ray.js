class Ray extends THREE.Object3D {
	constructor(i){
		super();

		this.radiusSegment = 32;
		this.heightSegment = 12;

		this.num = i;

		this.size = _.random(10, 40)/10;
		this.colors = [0xF7EF81,0xD4C685,0xCFE795,0xA7D3A6,0xADD2C2,0xBB4430,0x7EBDC2,0xCF1259];

		this.dist = _.random(0,80)/10;
		this.actualDist = this.dist;
		this.soundDist = -1;

		this.pos = {
			y : _.random(-this.dist,this.dist),
			z : _.random(-this.dist,this.dist)
		}

		this.oldPosZ = [];

		this.moveBy = _.random(45,80);

		this.vel = _.random(10, 15)*0.10;
		this.velRotation = _.random(1,50)*0.0001;
		this.velSound = 0;
		this.velMax = 3;

		this.rayMesh = new THREE.Object3D();
		this.rayMesh.position.x = -100;
		this.rayMesh.position.y = this.pos.y;
		this.rayMesh.position.z = this.pos.z;


		this.material = new THREE.MeshBasicMaterial( { color: this.colors[_.random(0,this.colors.length-1)] } );

		this.sphereGeometry = new THREE.SphereGeometry( this.size, this.radiusSegment, this.radiusSegment );
		this.sphereMesh = new THREE.Mesh( this.sphereGeometry, this.material );
		/*this.mesh.position.x = -100;
		this.mesh.position.y = this.pos.y;
		this.mesh.position.z = this.pos.z;*/

		this.cylinderGeometry = new THREE.CylinderGeometry( this.size, this.size, 50, this.radiusSegment, this.heightSegment, true );
		this.cylinderGeometry.verticesNeedUpdate = true;

		this.cylinderMesh = new THREE.Mesh( this.cylinderGeometry, this.material );
		this.cylinderMesh.rotation.z = 1.57;
		this.cylinderMesh.position.x = -25;
		
		this.rayMesh.add(this.cylinderMesh);
		this.rayMesh.add(this.sphereMesh);

		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);

		console.log(this.cylinderGeometry)

	}

	_onUpdate(freq) {

		// ##
		// TRAIN
		this.oldPosZ.push(this.rayMesh.position.x);
		//console.log(this.oldPosZ);

		if(this.oldPosZ.length > 12){
		    this.oldPosZ.splice(0,1);
		}
		//console.log(this.oldPosZ);
		for( var i = 0 ; i < this.heightSegment ; i++ ){
				//console.log((i*10))
			for( var j = 0 ; j < this.radiusSegment ; j++ ){
				//console.log(this.cylinderGeometry)
				this.cylinderGeometry.vertices[j+(i*10)].x += Math.random(1,9)/10 ;
			}
		}


		// ##
		// Translation
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
	  	// Sound
	  	this.soundDist = Math.abs(this.dist) + freq/8;
	  	if(Math.abs(this.actualDist - this.soundDist) > 6){
	  		this.actualDist = this.soundDist;
	  	}

	  	// ##
	  	// Axe rotation
	  	var t = Date.now()*this.velRotation;
		this.rayMesh.position.y = Math.sin( t ) * this.actualDist;
		this.rayMesh.position.z = Math.cos( t ) * this.actualDist;

		this.rayMesh.position.x += Math.sin( t ) * 0.05;
	}
}

module.exports = Ray;