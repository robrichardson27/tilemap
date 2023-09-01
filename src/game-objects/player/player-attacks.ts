import { Point, Rectangle } from '../../utils';

export const attackDown = (frame: number, center: Point): Rectangle => {
  switch (frame) {
    case 0:
      return new Rectangle(center.x - 8, center.y - 30, 48, 40);
    case 1:
      return new Rectangle(center.x + 10, center.y + 8, 48, 20);
    case 2:
      return new Rectangle(center.x - 4, center.y, 46, 52);
    case 3:
      return new Rectangle(center.x - 12, center.y, 24, 70);
    case 4:
      return new Rectangle(center.x - 36, center.y, 40, 60);
    default:
      return new Rectangle(0, 0, 0, 0);
  }
};

export const attackUp = (frame: number, center: Point): Rectangle => {
  switch (frame) {
    case 0:
      return new Rectangle(center.x - 40, center.y - 40, 48, 40);
    case 1:
      return new Rectangle(center.x - 10, center.y - 55, 20, 48);
    case 2:
      return new Rectangle(center.x - 4, center.y - 38, 42, 52);
    case 3:
      return new Rectangle(center.x - 12, center.y, 70, 24);
    case 4:
      return new Rectangle(center.x, center.y, 48, 48);
    default:
      return new Rectangle(0, 0, 0, 0);
  }
};

export const attackLeft = (frame: number, center: Point): Rectangle => {
  switch (frame) {
    case 0:
      return new Rectangle(center.x, center.y - 40, 42, 40);
    case 1:
      return new Rectangle(center.x - 5, center.y - 50, 20, 45);
    case 2:
      return new Rectangle(center.x - 42, center.y - 36, 42, 52);
    case 3:
      return new Rectangle(center.x - 60, center.y - 2, 70, 24);
    case 4:
      return new Rectangle(center.x - 48, center.y, 48, 48);
    default:
      return new Rectangle(0, 0, 0, 0);
  }
};

export const attackRight = (frame: number, center: Point): Rectangle => {
  switch (frame) {
    case 0:
      return new Rectangle(center.x - 40, center.y - 40, 48, 40);
    case 1:
      return new Rectangle(center.x - 10, center.y - 53, 20, 48);
    case 2:
      return new Rectangle(center.x - 4, center.y - 38, 42, 52);
    case 3:
      return new Rectangle(center.x - 12, center.y, 70, 24);
    case 4:
      return new Rectangle(center.x, center.y, 48, 48);
    default:
      return new Rectangle(0, 0, 0, 0);
  }
};
