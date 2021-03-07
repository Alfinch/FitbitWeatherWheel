import * as util from './utils';

export class Vector {

	constructor(x, y) {
    
    if (!util.isNumber(x))
      throw new Error(`Invalid "x" value: ${x}`);
    
    if (!util.isNumber(y))
      throw new Error(`Invalid "y" value: ${y}`);
    
		this.x = x;
		this.y = y;
	}
	
	negate() {
		return new Vector(-this.x, -this.y);
	}

	translate(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	}
	
	rotate(angle) {
		return new Vector(
			(this.x * Math.cos(angle)) - (this.y * Math.sin(angle)),
			(this.x * Math.sin(angle)) + (this.y * Math.cos(angle))
		);
	}
	
	rotateAbout(origin, angle) {
		return this
			.translate(origin.negate())
			.rotate(angle)
			.translate(origin);
	}
	
	clone() {
		return new Vector(this.x, this.y);
	}
}

export class Path {
	
	constructor(...vectors) {
		this.vectors = vectors;
	}
	
	translate(vector) {
		return this.map(v => v.translate(vector));
	}
	
	rotate(angle) {
		return this.map(v => v.rotate(angle));
	}
	
	rotateAbout(origin, angle) {
		return this.map(v => v.rotateAbout(origin, angle));
	}
	
	clone() {
		return this.map(v => v.clone());
	}
	
	map(func) {
		return new Path(...this.vectors.map(func));
	}
}

export class Line extends Path {
	
	constructor(start, end) {
		super(start, end);
	}
	
	static fromPath(path) {
		return new Line(path.vectors[0], path.vectors[1]);
	}
	
	get start() { return this.vectors[0]; }
	
	get end() { return this.vectors[1]; }
	
	translate(vector) {
		let path = super.translate(vector);
		return Line.fromPath(path);
	}
	
	rotate(angle) {
		let path = super.rotate(angle);
		return Line.fromPath(path);
	}
	
	rotateAbout(origin, angle) {
		let path = super.rotateAbout(origin, angle);
		return Line.fromPath(path);
	}
	
	clone() {
		let path = super.clone();
		return Line.fromPath(path);
	}
	
	map(func) {
		let path = super.map(func);
		return Line.fromPath(path);
	}
}

export class Polar {
  
  constructor(r, phi) {
    
    if (!util.isNumber(r))
      throw new Error(`Invalid "r" value: ${r}`);
    
    if (!util.isNumber(phi))
      throw new Error(`Invalid "phi" value: ${phi}`);
    
    this.r = r;
    this.phi = phi;
  }
  
  static fromCartesian(vector) {
    let r = Math.sqrt(vector.x * vector.x, vector.y * vector.y);
    let phi = Math.atan2(vector.y, vector.x);
    
    return new Polar(r, phi);
  }
  
  toCartesian() {
    
    let x = this.r * Math.cos(this.phi);
    let y = this.r * Math.sin(this.phi);
    
    return new Vector(x, y);
  }
}