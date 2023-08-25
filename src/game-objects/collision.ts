import { Camera } from '../camera';
import { Circle, Point, Rectangle, Vector } from '../utils';

/**
 * Calculate AABB collision between two rectangles
 * @param a
 * @param b
 * @param camera
 * @returns
 */
export const aabbCollision = (a: Rectangle, b: Rectangle, camera?: Camera) => {
  const cameraOffsetX = camera ? -camera.x : 0;
  const cameraOffsetY = camera ? -camera.y : 0;
  const xCollides = a.x + cameraOffsetX < b.b.x && a.b.x > b.a.x;
  const yCollides = a.y + cameraOffsetY < b.c.y && a.c.y > b.y;
  return xCollides && yCollides;
};

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
