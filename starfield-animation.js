<canvas id="bgCanvas"></canvas>

<script>
(function () {
  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  window.requestAnimationFrame = requestAnimationFrame;
})();

var background = document.getElementById("bgCanvas"),
  bgCtx = background.getContext("2d"),
  width, height;

// Resize canvas to full screen
function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  background.width = width;
  background.height = height;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Star object
function Star(options) {
  this.reset(options);
}
Star.prototype.reset = function (options) {
  this.size = Math.random() * 2;
  this.speed = Math.random() * 0.05;
  this.x = options?.x ?? Math.random() * width;
  this.y = options?.y ?? Math.random() * height;

  // Slight color variation
  const colors = ["#ffffff", "#fdf4e3", "#cce6ff"];
  this.color = colors[Math.floor(Math.random() * colors.length)];
};
Star.prototype.update = function () {
  this.x -= this.speed;
  if (this.x < 0) {
    this.reset({ x: width, y: Math.random() * height });
  } else {
    bgCtx.fillStyle = this.color;
    bgCtx.fillRect(this.x, this.y, this.size, this.size);
  }
};

// Shooting star
function ShootingStar() {
  this.reset();
}
ShootingStar.prototype.reset = function () {
  this.x = Math.random() * width;
  this.y = 0;
  this.len = Math.random() * 80 + 10;
  this.speed = Math.random() * 10 + 6;
  this.size = Math.random() * 1 + 0.1;
  this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
  this.active = false;
};
ShootingStar.prototype.update = function () {
  if (this.active) {
    this.x -= this.speed;
    this.y += this.speed;
    if (this.x < 0 || this.y >= height) {
      this.reset();
    } else {
      bgCtx.strokeStyle = "#ffffff";
      bgCtx.lineWidth = this.size;
      bgCtx.beginPath();
      bgCtx.moveTo(this.x, this.y);
      bgCtx.lineTo(this.x + this.len, this.y - this.len);
      bgCtx.stroke();
    }
  } else if (this.waitTime < new Date().getTime()) {
    this.active = true;
  }
};

// Entities (stars & shooting stars)
var entities = [];
for (var i = 0; i < 200; i++) { // number of stars
  entities.push(new Star({}));
}
entities.push(new ShootingStar());
entities.push(new ShootingStar());

// Animation loop
function animate() {
  // Black background
  bgCtx.fillStyle = "#000000";
  bgCtx.fillRect(0, 0, width, height);

  // Update stars and shooting stars
  for (var i = 0; i < entities.length; i++) {
    entities[i].update();
  }
  requestAnimationFrame(animate);
}
animate();
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: black;
}
#bgCanvas {
  display: block;
  width: 100vw;
  height: 100vh;
}
</style>
