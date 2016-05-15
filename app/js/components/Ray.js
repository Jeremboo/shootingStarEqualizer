import props from 'js/props';
import shaderToon from 'js/shaderToon';

class Ray extends THREE.Object3D {
  constructor(i, light){
    super();

    // ##
    // INIT
    // - const
    this.radiusSegment = 10;
    this.heightSegment = 100;
    this.color = props.colors[Math.floor(this.randomize(0,props.colors.length - 1))];
    // - var
    this.mId = i;
    this.timer = 0;
    this.timerPosX = 0;
    this.actualAmpl = 0;
    this.toAmpl = 0;
    // - random values
    this.size = this.randomize(1, (10 + this.mId) / 3);
    this.cylinderHeight = this.randomize(10, 150);
    this.amplitude = this.randomize(1, 20);
    this.vitRotation = this.randomize(0.1, 0.2);
    this.freq = this.randomize(0, 10);
    // - THREE objects
    // -- material
    this.phongMaterial = this.createShaderMaterial(light);
    this.phongMaterial.uniforms.uMaterialColor.value.copy(new THREE.Color(this.color));
    this.phongMaterial.side = THREE.DoubleSide;
    this.material = new THREE.MeshBasicMaterial({color: this.color});
    // -- rayMesh
    this.rayMesh = new THREE.Object3D();
    this.rayMesh.position.x = 0;
    // -- sphere
    this.sphereGeometry = new THREE.SphereGeometry(this.size, 32, 32);
    this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.phongMaterial);
    // -- cylinder
    this.cylinderGeometry = new THREE.CylinderGeometry(this.size / 10, this.size,
                                                       this.cylinderHeight,
                                                       this.radiusSegment,
                                                       this.heightSegment, true);

    this.cylinderMesh = new THREE.Mesh(this.cylinderGeometry, this.phongMaterial);
    this.cylinderMesh.rotation.z = 1.57; // 90°
    this.cylinderMesh.position.x = -this.cylinderHeight / 2;
    // - arrays
    // -- for trains
    this.oldPos = [];
    for (let i = 0; i < this.heightSegment; i++) {
      this.oldPos.push(new THREE.Vector3());
    };
    // -- for initial cylinder positions
    this._cylinderVertices = [];
    this.cylinderGeometry.vertices.map((vertice) => {
      this._cylinderVertices.push(this.clone(vertice));
    })

    // ##
    // ADD
    this.rayMesh.add(this.cylinderMesh);
    this.rayMesh.add(this.sphereMesh);


    // ##
    // SAVE BINDING
    this._binds = {};
    this._binds.onUpdate = this._onUpdate.bind(this);
    this._binds.updateFreq = this._updateFreq.bind(this);
  }

  _onUpdate() {
    // ##
    // SAVE OLD POSITION
    this.oldPos.splice(0, 1);
    this.oldPos.push(this.clone(this.rayMesh.position));

    // ##
    // CHANGE AMPLITUDE ACCORDING TO THE SOUND
    this.toAmpl = this.amplitude + this.freq * props.Amplitude;
    this.actualAmpl += (this.toAmpl - this.actualAmpl) * props.Sensitivity;

    // ##
    // UPDATE POSITIONS (AXE ROTATIONS)
    this.timer += this.vitRotation * props.Rotation;
    this.timerPosX += this.vitRotation * 0.1;
    this.rayMesh.position.y = Math.cos(this.timer) * this.actualAmpl;
    this.rayMesh.position.z = Math.sin(this.timer) * this.actualAmpl;
    this.rayMesh.position.x += Math.sin(this.timerPosX) * 0.5;

    // ##
    // MOVE TRAIL
    this.cylinderGeometry.verticesNeedUpdate = true;

    let pos, i, j;
    let dist = new THREE.Vector3();
    let oldPosLength = this.oldPos.length;
    let circleVertices = this.radiusSegment + 1;
    for (i = 0 ; i < oldPosLength ; i++) {
      // - Calculate the distance between the old cylinder's ring
      // - and the new position.
      dist.subVectors(this.rayMesh.position, this.oldPos[i]);

      for (j = 0 ; j < circleVertices ; j++) {
        // - update each vertice position of cylinder's ring into the rayMesh.
        pos = j + (circleVertices * i);
        this.cylinderGeometry.vertices[pos].x = this._cylinderVertices[pos].x - dist.y;
        this.cylinderGeometry.vertices[pos].y = this._cylinderVertices[pos].y - dist.x;
        this.cylinderGeometry.vertices[pos].z = this._cylinderVertices[pos].z - dist.z;
      };
    };
  }

  _updateFreq(freq){
    this.freq = freq;
  }

  createShaderMaterial(light) {
    let phongDiffuse = shaderToon["phongDiffuse"];
    let u = THREE.UniformsUtils.clone(phongDiffuse.uniforms);
    let vs = phongDiffuse.vertexShader;
    let fs = phongDiffuse.fragmentShader;

    let material = new THREE.ShaderMaterial({uniforms: u, vertexShader: vs, fragmentShader: fs});
    material.uniforms.uDirLightPos.value = light.position;
    material.uniforms.uDirLightColor.value = light.color;

    return material;
  }


  clone(object){
    return JSON.parse(JSON.stringify(object));
  }

  randomize(min, max){
    return Math.random() * (max - min) + min;
  }
}

module.exports = Ray;
