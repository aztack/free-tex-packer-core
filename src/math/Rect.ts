class Rect {
  constructor(public x: number = 0, public y: number = 0, public width: number = 0, public height: number = 0) { }

  clone(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  hitTest(other: Rect): boolean {
    return Rect.hitTest(this, other);
  }

  static hitTest(a: Rect, b: Rect): boolean {
    return (
      a.x >= b.x &&
      a.y >= b.y &&
      a.x + a.width <= b.x + b.width &&
      a.y + a.height <= b.y + b.height
    );
  }
}

export default Rect;
