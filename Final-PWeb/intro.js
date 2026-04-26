let systems = [];
let myGeometry;
// window.currentTheme = "pink"; // default theme
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent(document.body);

  // ===== PARTICLE SYSTEMS (spread out) =====
  systems.push(new ParticleSystem(createVector(width * 0.2, height * 0.2)));
  systems.push(new ParticleSystem(createVector(width * 0.8, height * 0.15)));
  systems.push(new ParticleSystem(createVector(width * 0.3, height * 0.85)));
  systems.push(new ParticleSystem(createVector(width * 0.7, height * 0.9)));

  // ===== GEOMETRY =====
  beginGeometry();
  torus(1, 0.25);
  myGeometry = endGeometry();
  myGeometry.normalize();
}

function draw() {
  // ===== CINEMATIC FADE =====
  push();
  resetMatrix();
  translate(-width / 2, -height / 2);
  noStroke();
  fill(0, 25); // transparency = trail effect
  rect(0, 0, width, height);
  pop();

// let c;

// switch (window.currentTheme) {
//   case "green":
//     c = [10, 40, 30];
//     break;
//   case "blue":
//     c = [10, 20, 50];
//     break;
//   default:
//     c = [30, 10, 40]; // purple
// }

// push();
// resetMatrix();
// translate(-width / 2, -height / 2);
// noStroke();
// fill(c[0], c[1], c[2], 25); // fading overlay
// rect(0, 0, width, height);
// pop();

  // let scrollY = window.scrollY;

  // // ===== PARTICLES =====
  // push();
  // resetMatrix();
  // translate(-width / 2, -height / 2);

  // for (let sys of systems) {
  //   sys.update(scrollY);
  //   sys.addParticle();
  //   sys.run();
  // }

  // pop();

  // ===== LIGHTING (color palette match) =====
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;

    ambientLight(40, 35, 40); 
  directionalLight(150, 255, 255, 0.25, 0.25, 0);
  pointLight(120, 155, 300, locX, locY, 250);
  // ===== SCROLL-BASED BEHAVIOR =====
  let rotationSpeed = 0.01;

  if (scrollY < 500) {
    rotationSpeed = 0.01;
  } else if (scrollY < 1200) {
    rotationSpeed = 0.03;
  } else {
    rotationSpeed = 0.06;
  }

  // ===== TOP OBJECT =====
  push();
  translate(-width / 4, -height / 4, 0);
  rotateZ(frameCount * rotationSpeed);
  rotateX(frameCount * rotationSpeed);
  specularMaterial(200, 180, 255);
  sphere(90);
  pop();

  // ===== BOTTOM OBJECT =====
  push();
  translate(width / 4, height / 4, 0);
  ambientMaterial(180, 255, 220);
  sphere(110);
  pop();

  // ===== TORUS =====
  push();
  rotateY(frameCount * rotationSpeed * 2);
  noStroke();
  ambientMaterial(200, 150, 255);
  model(myGeometry);

  stroke(200, 150, 255, 120);

  for (let i = 0; i < myGeometry.vertices.length; i++) {
    let v = myGeometry.vertices[i];
    let n = myGeometry.vertexNormals[i];
    let p = p5.Vector.mult(n, 8);

    push();
    translate(v.x, v.y, v.z);
    line(0, 0, 0, p.x, p.y, p.z);
    pop();
  }

  pop();
}

// ===== PARTICLES =====

class Particle {
  constructor(position) {
    this.acceleration = createVector(0, 0.03);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.lifespan = 255;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 3;
  }

  display() {
    stroke(200, 180, 255, this.lifespan);
    fill(180, 255, 220, this.lifespan);
    ellipse(this.position.x, this.position.y, 10);
  }

  isDead() {
    return this.lifespan < 0;
  }

  run() {
    this.update();
    this.display();
  }
}

class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
    this.offset = random(1000);
  }

  update(scrollY) {
    // subtle floating motion
    this.origin.x += sin(frameCount * 0.01 + this.offset) * 0.3;
    this.origin.y += cos(frameCount * 0.01 + this.offset) * 0.3;

    // scroll affects vertical drift
    this.origin.y += map(scrollY, 0, 1500, -0.2, 0.2);
  }

  addParticle() {
    this.particles.push(new Particle(this.origin));
  }

  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}