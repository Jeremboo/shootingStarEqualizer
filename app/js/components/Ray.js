class Ray {
	constructor(){
		this.size = _.random(1, 4);
		this.dist = _.random(-10,10);
		this.colors = [0xF7EF81,0xD4C685,0xCFE795,0xA7D3A6,0xADD2C2,0xBB4430,0x7EBDC2,0xCF1259];

		this.geometry = new THREE.SphereGeometry( this.size, 32, 31 );
		this.material = new THREE.MeshBasicMaterial( { color: this.colors[_.random(0,this.colors.length-1)] } );
		this.mesh = new THREE.Mesh( this.geometry, this.material );

		this.pos = {
			x : _.random(-this.dist,this.dist),
			y : _.random(-this.dist,this.dist),
			z : _.random(-this.dist,this.dist)
		}

		this.mesh.position.x = -100;
		this.mesh.position.y = this.pos.y;
		this.mesh.position.z = this.pos.z;

		this.moveBy = _.random(45,50);


		this.vel = _.random(10, 15)*0.10;
		this.velRotation = _.random(1,50)*0.0001;
		this.velMax = 3;

		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	_onUpdate() {

		if(this.moveBy > 0 && this.vel < this.velMax ){
	     	this.vel += 0.01;
	     	this.moveBy -= this.vel;
	     } else if(this.vel > 0 ) {
	     	this.vel *= 0.95;
	     }

		this.mesh.position.x += this.vel*0.9;


	  	// ##
	  	// Rotation
	  	this.mesh.rotation.x += 0.01;
	  	this.mesh.rotation.y += 0.01;

	  	// ##
	  	// Axe rotation
	  	var t = Date.now()*this.velRotation;
		this.mesh.position.y = Math.sin( t ) * Math.abs(this.pos.y);
		this.mesh.position.z = Math.cos( t ) * Math.abs(this.pos.z);

		this.mesh.position.x += Math.sin( t ) * 0.1;
		//this.mesh.position.x =
		
		//this.pos.y = Math.sin( t/10 ) * 10;
		//console.log(this.pos.y);
	}
}

module.exports = Ray;