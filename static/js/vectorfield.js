var canvas = document.getElementById("vectorfield");
fitToContainer(canvas);

function fitToContainer(canvas){
  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
var ctx = canvas.getContext("2d");
var max_x = 4.5;
var max_y = 2.2;
var tstep = 0.001;
var past_particles = 5;
var num_particles = 2000;
ctx.fillStyle = "#42AFBF";

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    dist(v2) {
        return Math.sqrt((this.x-v2.x) * (this.x-v2.x) + (this.y-v2.y) * (this.y-v2.y));
    }
}

class Particle {
    constructor(s, v) {
        this.s = s;
        this.v = v;
        this.past = [new Vector(s.x, s.y)];
    }
    move() {
        this.s.x += this.v.x * tstep;
        this.s.y += this.v.y * tstep;
        if (Math.abs(this.past[this.past.length-1].dist(this.s) > 0.01)) {
            this.past.push(new Vector(this.s.x, this.s.y));
        }
        if (this.past.length > past_particles) {
            this.past.shift();
        }
    }
    update_velocity() {
        this.v = new Vector(
            (this.s.length())-this.s.x,
            -this.s.x
        );
    }
}

function to_vf(x, y) {
    return new Vector((x-0.5)*max_x*2, (y-0.5)*max_y*2);
}
function to_canvas(v) {
    return [(v.x+max_x)/2/max_x*canvas.width, (v.y+max_y)/2/max_y*canvas.width];
}

var start = to_vf(Math.random(), Math.random());

var particles = [];

for (var i = 0; i < 10; i++) {
    start = to_vf(Math.random(), Math.random());
    particles.push(new Particle(start, new Vector(0, 0)));
}


function draw() {
    ctx.beginPath();
    particles.forEach((p) => {
        p.past.forEach((Point) => {
            s = to_canvas(Point);
            ctx.fillRect(s[0], s[1], 2, 2);
        });
    });
    ctx.closePath();
}


function update() {
    particles.forEach((p) => {
        p.update_velocity();
        p.move();
    });
    particles = particles.filter((p) => (Math.abs(p.s.x)<max_x+0.1 || Math.abs(p.s.y)<max_y+0.1));
    for (var i = 0; i < Math.min(num_particles-particles.length, 10); i++) {
        start = to_vf(Math.random(), Math.random());
        particles.push(new Particle(start, new Vector(0, 0)));
    }
}

setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(); 
    update();
}, 10);