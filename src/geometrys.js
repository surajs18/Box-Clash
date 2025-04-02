import * as THREE from "three";

export class Box extends THREE.Mesh {
  constructor({
    color,
    width,
    height,
    depth,
    position = { x: 0, y: 0, z: 0 },
    velocity = { x: 0, y: 0, z: 0 },
    zAcceleration = false,
    texturePaths = {
      albedo: "",
      normal: "",
      ao: "",
      roughness: "",
      metallic: "",
      height: "",
      apply: false,
    },
    stretch = false,
  }) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color });
    super(geometry, material);
    if (texturePaths.apply) {
      this.applyTextures({ texturePaths, stretch });
    }

    this.height = height;
    this.width = width;
    this.depth = depth;
    this.position.set(position.x, position.y, position.z);

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.left = this.position.x - this.width / 2;
    this.right = this.position.x + this.width / 2;
    this.back = this.position.z - this.depth / 2;
    this.front = this.position.z + this.depth / 2;
    this.velocity = velocity;
    this.gravity = -0.01;
    this.friction = 0.95;
    // this.fallen = false;
    this.zAcceleration = zAcceleration;
  }

  update(referenceObject = null) {
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.left = this.position.x - this.width / 2;
    this.right = this.position.x + this.width / 2;
    this.back = this.position.z - this.depth / 2;
    this.front = this.position.z + this.depth / 2;

    if (this.zAcceleration) {
      this.velocity.z += 0.001;
    }

    // this.isFallen(referenceObject);
    boxCollusion(this, referenceObject);
    this.moveX();
    this.moveZ();
    this.applyGravity(referenceObject);
  }

  applyTextures({ texturePaths, stretch = false }) {
    const textureLoader = new THREE.TextureLoader();

    const textures = {};

    textures.albedo = textureLoader.load(
      texturePaths.albedo,
      this.onTextureLoaded
    );
    textures.ao = textureLoader.load(texturePaths.ao, this.onTextureLoaded);
    textures.height = textureLoader.load(
      texturePaths.height,
      this.onTextureLoaded
    );
    textures.metallic = textureLoader.load(
      texturePaths.metallic,
      this.onTextureLoaded
    );
    textures.roughness = textureLoader.load(
      texturePaths.roughness,
      this.onTextureLoaded
    );
    textures.normal = textureLoader.load(
      texturePaths.normal,
      this.onTextureLoaded
    );

    for (let key in textures) {
      const texture = textures[key];
      if (stretch) {
        texture.repeat.set(1, 10);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
      }
    }

    this.material.map = textures.albedo;
    this.material.roughnessMap = textures.roughness;
    this.material.metalnessMap = textures.metallic;
    this.material.aoMap = textures.ao;
    this.material.normalMap = textures.normal;
    this.material.displacementMap = textures.height;
    this.material.needsUpdate = true;
  }

  onTextureLoaded(texture) {
    console.log("Texture loaded:", texture);
  }

  moveX() {
    this.position.x += this.velocity.x;
  }

  moveZ() {
    this.position.z += this.velocity.z;
  }

  applyGravity(referenceObject) {
    this.velocity.y *= this.friction;
    this.velocity.y += this.gravity;

    // if (this.fallen) {
    //   console.log("end", this.fallen);
    //   this.position.y += 0.01;
    // }

    if (boxCollusion(this, referenceObject)) {
      // this.bottom + this.velocity.y <= referenceObject.top && !this.fallen
      this.velocity.y = -this.velocity.y;
    } else this.position.y += this.velocity.y;
  }
}
export function destroyGameObject(gameObject, scene) {
  if (gameObject.position.y < -50) {
    // gameObject.velocity.z = 0;
    gameObject.geometry.dispose();
    gameObject.material.dispose();
    scene.remove(gameObject);
    return true;
  }
  return false;
}

//   isFallen(referenceObject) {
//     const xOut =
//       this.right < referenceObject.left || this.left > referenceObject.right;
//     const zOut =
//       this.front < referenceObject.back || this.back > referenceObject.front;
//     const yOut = this.bottom > referenceObject.top;
//     if (xOut || zOut) this.fallen = true;
//     else if (!(xOut || zOut) && yOut) this.fallen = false;
//   }

export function boxCollusion(box1, box2) {
  const xCollusion = box1.right >= box2.left && box1.left <= box2.right;
  const yCollusion =
    box1.bottom + +box1.velocity.y <= box2.top && box1.top >= box2.bottom;
  const zCollusion = box1.front >= box2.back && box1.back <= box2.front;

  // const invasionControl =
  //   !(xCollusion || zCollusion) && box1.bottom > !box2.top;

  return xCollusion && yCollusion && zCollusion;
}
