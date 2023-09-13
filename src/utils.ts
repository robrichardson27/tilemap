export type Point = { x: number; y: number };

/**
 * Constucts a rectangle from top left x y coords
 */
export class Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;

  get center(): Point {
    return {
      x: this.x + Math.floor(this.width / 2),
      y: this.y + Math.floor(this.height / 2),
    };
  }

  get vertices(): [Point, Point, Point, Point] {
    return [
      { x: this.x, y: this.y },
      { x: this.x + this.width, y: this.y },
      { x: this.x + this.width, y: this.y + this.height },
      { x: this.x, y: this.y + this.height },
    ];
  }

  /**
   * a -- b
   *
   * d -- c
   */
  get a(): Point {
    return this.vertices[0];
  }

  /**
   * a -- b
   *
   * d -- c
   */
  get b(): Point {
    return this.vertices[1];
  }

  /**
   * a -- b
   *
   * d -- c
   */
  get c(): Point {
    return this.vertices[2];
  }

  /**
   * a -- b
   *
   * d -- c
   */
  get d(): Point {
    return this.vertices[3];
  }

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

/**
 * Construct a circle from point and radius
 */
export class Circle {
  origin: Point;
  radius: number;
  circumference: number;
  diameter: number;

  get x(): number {
    return this.origin.x;
  }

  get y(): number {
    return this.origin.y;
  }

  constructor(origin: Point, radius: number) {
    this.origin = origin;
    this.radius = radius;
    this.circumference = 2 * Math.PI * radius;
    this.diameter = 2 * radius;
  }
}

/**
 * Basic vector and vector operations
 */
export class Vector {
  x: number;
  y: number;

  constructor(p1: Point, p2: Point) {
    this.x = p2.x - p1.x;
    this.y = p2.y - p1.y;
  }

  dot(v: Vector): number {
    return this.x * v.x + this.y * v.y;
  }
}

/**
 * Returns a random number less than max
 * @param max
 * @returns
 */
export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};

/**
 * Converts degrees to radians
 * @param degrees
 * @returns
 */
export const degToRad = (degrees: number): number => (Math.PI / 180) * degrees;

export type RgbArray = [number, number, number, number?];

export const rgbArrayToString = (rgb: RgbArray): string =>
  `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${rgb[3] ? rgb[3] : 1})`;

export const rgbArrayOpacity = (rgb: RgbArray, opacity: number): RgbArray => {
  const rgba: RgbArray = [...rgb];
  rgba[3] = opacity;
  return rgba;
};
