export type Point = { x: number; y: number };

/**
 * Constucts a rectangle from top left x y coords
 */
export class Rectangle {
  x: number;
  y: number;
  center: Point;
  width: number;
  height: number;
  vertices: [Point, Point, Point, Point];

  get a(): Point {
    return this.vertices[0];
  }

  get b(): Point {
    return this.vertices[1];
  }

  get c(): Point {
    return this.vertices[2];
  }

  get d(): Point {
    return this.vertices[3];
  }

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.center = { x: x + width / 2, y: y + height / 2 };
    this.vertices = [
      { x: x, y: y },
      { x: x + width, y: y },
      { x: x + width, y: y + height },
      { x: x, y: y + height },
    ];
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

/**
 * Calculate if a point is within a rectangle
 * @param point
 * @param rect
 */
export const pointInRectangle = (point: Point, rect: Rectangle): boolean => {
  const ab = new Vector(rect.a, rect.b);
  const ap = new Vector(rect.a, point);
  const bc = new Vector(rect.b, rect.c);
  const bp = new Vector(rect.b, point);
  return (
    0 <= ab.dot(ap) &&
    ab.dot(ap) <= ab.dot(ab) &&
    0 <= bc.dot(bp) &&
    bc.dot(bp) <= bc.dot(bc)
  );
};

/**
 * Calculate if a circle is touching or within a rectangle
 * @param circle
 * @param rect
 * @returns
 */
export const circleInRectangle = (circle: Circle, rect: Rectangle): boolean => {
  let testX: number = circle.x;
  let testY: number = circle.y;

  if (circle.x < rect.a.x) {
    testX = rect.a.x;
  } else if (circle.x > rect.b.x) {
    testX = rect.b.x;
  }
  if (circle.y < rect.a.y) {
    testY = rect.a.y;
  } else if (circle.y > rect.c.y) {
    testY = rect.c.y;
  }

  const distX = circle.x - testX;
  const distY = circle.y - testY;

  const dist = Math.sqrt(distX * distX + distY * distY);

  if (dist <= circle.radius) {
    return true;
  }
  return false;
};
