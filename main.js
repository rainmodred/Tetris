var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.scale(20, 20);

class Game {
	constructor() {
		this.width = canvas.width / 20;
		this.height = canvas.height / 20;
		this.matrix = [];
		this.Fmatrix = [];
		this.y = 0;
		this.x = 0;
		this.score = 0;

		for (let y = 0; y < this.height; y++) {
			this.matrix.push([]);
			for (let x = 0; x < this.width; x++) {
				this.matrix[y].push(0);
			}
		}	
	}

	createFigure(str) {
		
		switch (str) {
			case 'T':
				this.Fmatrix = [
								[0,1,0],
								[1,1,1],
								[0,0,0]	
										];
				break;
			case 'L':
				this.Fmatrix = [
								[0,2,0],
								[0,2,0],
								[0,2,2]	
										];
				break;
			case 'J':
				this.Fmatrix = [
								[0,3,0],
								[0,3,0],
								[3,3,0]	
										];
				break;
			case 'I':
				this.Fmatrix = [
								[0,0,0,0],
								[4,4,4,4],
								[0,0,0,0],
								[0,0,0,0]	
										];
				break;
			case 'S':
				this.Fmatrix = [
								[0,5,5],
								[5,5,0],
								[0,0,0]	
										];
				break;
			case 'Z':
				this.Fmatrix = [
								[6,6,0],
								[0,6,6],
								[0,0,0]	
										];
				break;
			case 'O':
				this.Fmatrix = [
								 [7,7],
								 [7,7]
									];
				break;
		}
	}

	rotate() {		
		for (let y = 0; y < this.Fmatrix.length; ++y) {
		    for (let x = 0; x < y; ++x) {
		        [
		            this.Fmatrix[x][y],
		            this.Fmatrix[y][x],
		        ] = [
		            this.Fmatrix[y][x],
		            this.Fmatrix[x][y],
		        ];
		    }
		}
		this.Fmatrix.reverse();

		let offset = 1;
		while(this.collide()) {
			this.x +=offset;
			
			if (offset > 0) {
				offset++;
				offset = -offset;
			} else 
				{
					offset = -offset;
					offset++;
				}
			
		}		
	}


	move(offset) {
		this.x +=offset;
		if (this.collide()) {
			this.x -=offset;
		}
	}

	drop() {
		this.y++;		
		if (this.collide()) {
			this.y--;
			this.merge();
			this.clearLine();
			this.start();
			this.updateScore();
			
			
		}
		dropCounter = 0;
	}

	collide() {
		for (let y = 0; y < this.Fmatrix.length; y++) {
			for (let x = 0; x < this.Fmatrix[y].length; x++) {
				if (this.Fmatrix[y][x] !==0 && (this.matrix[y + this.y] && this.matrix[y + this.y][x + this.x]) !==0) {
					return true;
				}	
			}
		}
		
		return false;
	}


	merge()	{
		this.Fmatrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !== 0) {					
					this.matrix[y + this.y][x + this.x] = value;
				}
			},this);
		},this);
	}

	drawMatrix(matrix, offset) {
		var self = offset;
		matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !==0) {
					switch (value) {
						case 1:
							ctx.fillStyle = '#CCCC66';
							break;
						case 2:
							ctx.fillStyle = '#DAAA00';
							break;
						case 3:
							ctx.fillStyle = '#66CCCC';
							break;
						case 4:
							ctx.fillStyle = '#6666CC';
							break;
						case 5:
							ctx.fillStyle = '#66CC66';
							break;
						case 6:
							ctx.fillStyle = '#CC6666';
							break;
						case 7:
							ctx.fillStyle = 'silver';
							break;
					}

					ctx.fillRect(x + offset.x , y + offset.y , 1, 1);
				}
			});
		});
	}


	draw() {		
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		this.drawMatrix(this.matrix ,{x:0, y:0});
		this.drawMatrix(this.Fmatrix, this);

		
	}

	clearLine() {
		let zeroCount = 0;
		this.matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !== 0) {
					zeroCount++;
				}
			});

			if (zeroCount == 10) {
				
				this.matrix.splice(y,1);
				this.matrix.unshift([0,0,0,0,0,0,0,0,0,0]);
				this.score +=10;
				
			}
			zeroCount = 0;
		});
	}

	updateScore() {
		document.getElementById('score').innerText = this.score;
	}
	start() {
		this.y = 0;
		this.x = this.width / 2 - 1;
		var figures = 'TLJSZOI';

		//update();
		this.createFigure(figures[Math.floor(Math.random() * (7))]);

		if (this.collide()) {
			this.matrix.forEach(row => row.fill(0));
			this.score = 0;

		}
	}

}	

/*
	game.createFigure();
	game.merge();
	update();
*/

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        game.drop();
    }

    lastTime = time;

    game.draw();
    requestAnimationFrame(update);
}



document.addEventListener('keydown', event => {
	if (event.keyCode == 37) {
		game.move(-1);
	}
	if (event.keyCode == 39) {
		game.move(1);
	}
	if (event.keyCode == 40) {
		game.drop();
	}
	if (event.keyCode == 38) {
		game.rotate();
	}

})

var game = new Game();
game.start();

update();


