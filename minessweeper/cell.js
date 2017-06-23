class Cell {
  constructor(x, y, size) {
    this._x = x;
    this._y = y;
    this._size = size;
    this._is_mine = false;
    this._is_revealed = false;
    this._flag = false;
    this._nearby_mines = 0;
  }

  set nearby_mines(nearby_mines) {
    this._nearby_mines = nearby_mines;
  }

  get nearby_mines() {
    return this._nearby_mines;
  }

  draw() {
    if (this._is_revealed === true) {
      fill('#fff');
      rect(this._x * this._size, this._y * this._size, this._size, this._size);
      if (this._is_mine === true) {
        fill('#f76116');
        ellipse(this._x * this._size + this._size / 2, this._y * this._size + this._size / 2, this._size / 2);
      } else {
        if (this._nearby_mines !== 0) {
          fill("#000");
          textAlign(CENTER, CENTER);
          textSize(this._size * 0.9);
          text(this._nearby_mines, this._x * this._size + this._size / 2, this._y * this._size + this._size / 2);
        }
      }
    } else {
      fill('#bbb');
      rect(this._x * this._size, this._y * this._size, this._size, this._size);
      if (this._flag === true) {
        fill('#1686f7');
        ellipse(this._x * this._size + this._size / 2, this._y * this._size + this._size / 2, this._size / 2);
      }
    }
  }

  reveal() {
    this._is_revealed = true;
  }

  get is_revealed() {
    return this._is_revealed;
  }

  get is_mine() {
    return this._is_mine;
  }

  make_mine() {
    this._is_mine = true;
  }

  toggle_flag() {
    this._flag = !this._flag;
  }
}
