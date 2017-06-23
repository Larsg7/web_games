let cell_size = 40;
let cell_n_w = 20;
let cell_n_h = 20;

let canvas_h = cell_size * cell_n_h;
let canvas_w = cell_size * cell_n_w;

let cells = get_two_dim_array(cell_n_w, cell_n_h);

let num_mines = 1;

let START = 0;
let PLAYING = 1;
let WIN = 2;
let LOOSE = 3;
let STATE = START;

function setup() {
  createCanvas(canvas_w + 1, canvas_h + 1);
  rect(0, 0, canvas_w, canvas_h);
  setup_field();
  STATE = PLAYING;
}

function draw() {
  for_every_cell((c) => c.draw())

  switch (STATE) {
    case START:
      setup();
      break;
    case LOOSE:
      for_every_cell((c) => c.reveal());
      break;
    case WIN:
      console.log("You won!")
  }
}

function check_if_won() {
  let won = true;
  for_every_cell((c) => {
    if (!c.is_mine && !c.is_revealed) {
     won = false;
   }
  })
  return won;
}

function for_every_cell(func) {
  cells.forEach((cell) => cell.forEach((c) => func(c)));
}

function mouseClicked() {
  if (STATE === PLAYING && between(mouseX, 0, canvas_w) && between(mouseY, 0, canvas_h)) {
    let cell = cells[Math.floor(mouseX / cell_size)][Math.floor(mouseY / cell_size)];
    if (mouseButton === LEFT && !keyIsDown(CONTROL) && !cell._flag) {
      cell.reveal();
      if (cell.is_mine === true) STATE = LOOSE;
      if (cell.nearby_mines === 0) {
        reveal_zero_fields(cell._x, cell._y);
      }
      if (check_if_won() === true) STATE = WIN;
    } else if (mouseButton === LEFT && keyIsDown(CONTROL)) {
      cell.toggle_flag();
    }
  }
}

function setup_field() {
  for (let x = 0; x < cell_n_w; x++) {
    for (let y = 0; y < cell_n_w; y++) {
      cells[x][y] = new Cell(x, y, cell_size);
    }
  }

  options = [];
  for_every_cell((c) => options.push(c))
  shuffle_array(options);
  for (let i = 0; i < num_mines; i++) {
    let c = options.pop().make_mine();
  }

  for (let x = 0; x < cell_n_w; x++) {
    for (let y = 0; y < cell_n_w; y++) {
      cells[x][y].nearby_mines = count_nearby_mines(x, y);
    }
  }
}

function reveal_zero_fields(x, y) {
  for_every_neighbor(x, y, (c) => {
    if (!c.is_revealed) {
      c.reveal();
      if (c.nearby_mines === 0) reveal_zero_fields(c._x, c._y);
    }
  });
}

function count_nearby_mines(x, y) {
  let count = 0;
  for_every_neighbor(x, y, (c) => count += c.is_mine ? 1 : 0 );
  return count;
}

function for_every_neighbor(x, y, func, diagonal=true) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let n_x = x + i;
      let n_y = y + j;
      if (between(n_x, 0, cell_n_w) && between(n_y, 0, cell_n_h)) {
        func(cells[n_x][n_y])
      }
    }
  }
}

function get_two_dim_array(x, y) {
  let arr = new Array(x);
  for (let i = 0; i < y; i++) {
    arr[i] = new Array(y);
  }
  return arr;
}
