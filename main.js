import Transform from './transform.js'
import Player from './player.js'
import Domino from './domino.js'


//Important Variables

let WaitingTime = 30000;
let MaxScore = 100;
let SettingsOn = false;
let settingButton = document.querySelector('#sett');
let settingsWindow = document.querySelector('.setting');
let TwoVsTwo = document.querySelector('input[name=game]').checked
let results = document.querySelector('.results');
let cancelSet = document.querySelector('#cancelSetting');
const TO_RADIANS = Math.PI / 180;
let SaveSet = document.querySelector('#SaveSetting');
let continueButton= document.querySelector('#continue');
const numbers = ["0", "1", "2", "3", "4", "5", "6"];
const IMAGES = [];


let players = [];
const places = ["up", "left", "down", "right"];

const SCORES = {
	left : 0,
	right :0,
	up : 0,
	down : 0,
}
let dominoes = [];
let j =0;
let me1= false;

let AFTER_DOUBLE = {
	left: "",
	right: ""
};
let LIMITS = {
	left: 0,
	right: 0,
	top: 0,
	down: 0
};

const tile_w = 30;
const tile_h = 60;
let VERTICALS = { left: "", right: "" };
let PLAYABLE = {
	left: "6",
	right: "6"
};
let TilesPlayed = {
	"0": 0,
	"1": 0,
	"2": 0,
	"3": 0,
	"4": 0,
	"5": 0,
	"6": 0
};

let starterIndex = 1;
let cycle2= Cycle([0,1,2,3],starterIndex)
let idCanvas = document.querySelector('#canvas');
let canvas = document.querySelector('canvas');
canvas.width = idCanvas.clientWidth;
canvas.height = idCanvas.clientHeight;
const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext("2d");
const table_w = width  - 1;
const table_h = height  - 1;
let x = (table_w ) / 2 + 15;
let y = (table_h ) / 2;
let transform = new Transform(x, y, tile_w, tile_h);
let endGame = false;
let test = { left: true, right: true };
let switch_path = { left: false, right: false };

let leftbutton = document.querySelector(".left");
let rightbutton = document.querySelector(".right");
leftbutton.dir = "left";
rightbutton.dir = "right";

let restart = document.querySelector('#restart');
let done2 = true







//Event Listeners






continueButton.addEventListener('click', ()=>{
	results.style.display = 'none';
	SettingsOn = false;

})
cancelSet.addEventListener('click', ()=>{
	settingsWindow.style.display = 'none';
	SettingsOn = false;

})

leftbutton.addEventListener("click", handleConflitLeft);
rightbutton.addEventListener("click", handleConflitright);

settingButton.addEventListener('click',()=>{
	if (SettingsOn==true) {
		settingsWindow.style.display = 'none';
		SettingsOn = false;

	}
	else {
		settingsWindow.style.display = 'flex';
		SettingsOn = true;
	}
})
SaveSet.addEventListener('click', saveSettings);

restart.addEventListener('click',()=>
{
	location.reload(); //replace() change query
	return false;
});

continueButton.addEventListener('click', ()=>{
	results.style.display = 'none';
	players.forEach(p => {p.clean();p.cleanHand()});
	init()
	play()

});



Array.prototype.random_choice = function() {
	return this.splice([Math.floor(Math.random() * this.length)], 1);
};
// remove one element from array
Array.prototype.remove = function(element) {
	return this.splice(this.indexOf(element), 1);
};






for (let i = 0; i < numbers.length; i++) {
	IMAGES.push(`${numbers[i]}-${numbers[i]}`);
	for (let j = i + 1; j < numbers.length; j++) {
		IMAGES.push(`${numbers[i]}-${numbers[j]}`);
	}
}


places.forEach(element => {
	players.push(new Player(element));
});

for (let index = 0; index <28; index++) {
	if (index % 4 == 0) {
		j = 0;
	}
	//if (index >= 14 ) { rotated = true;}
	if (index >= 21) {
		me1 = true;
	}
	let choice = IMAGES.random_choice().toString();
	let dom = new Domino(choice, me1);
	dominoes.push(dom);
	players[j].hand.push(dom);

	j++;
}

players.forEach(player => {
	player.populate();
	player.setScore(0)
});



function* Cycle(iterable, start) {
	let i = start;

	while (true) {
		if (i == iterable.length - 1) {
			i = -1;
		}
		yield iterable[++i];
	}
}



function getDirection() {
	if (LIMITS["left"] > LIMITS["right"]) {
		return "right";
	}

	return "left";
}

function init() {
	transform = new Transform(x, y, tile_w, tile_h);
	test = { left: true, right: true };
	switch_path = { left: false, right: false };
	AFTER_DOUBLE = {
		left: "",
		right: ""
	};
	for (let i = 0; i < numbers.length; i++) {
		IMAGES.push(`${numbers[i]}-${numbers[i]}`);
		for (let j = i + 1; j < numbers.length; j++) {
			IMAGES.push(`${numbers[i]}-${numbers[j]}`);
		}
	}
	VERTICALS = { left: "", right: "" };
	
	TilesPlayed = {
		"0": 0,
		"1": 0,
		"2": 0,
		"3": 0,
		"4": 0,
		"5": 0,
		"6": 0
	};
	LIMITS = {
		left: 0,
		right: 0,
		top: 0,
		down: 0
	};
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, table_w, table_h);
	
	dominoes = [];
	for (let index = 0; index < 28; index++) {
		if (index % 4 == 0) {
			j = 0;
		}
		//if (index >= 14 ) { rotated = true;}
		if (index >= 21) {
			me1 = true;
		}
		let choice = IMAGES.random_choice().toString();
		let dom = new Domino(choice, me1);
		dominoes.push(dom);
		players[j].hand.push(dom);

		j++;
	}
	players.forEach(player => {
		player.clean();
		//p.cleanHand();
		player.populate();
		
	});
	if(endGame) {players.forEach(player => player.resetScore())}
}
function saveSettings(){
	WaitingTime = parseInt(document.querySelector('#time').value) * 1000;
	MaxScore = parseInt(document.querySelector('#maxScore').value);
	players.forEach(p => {p.clean();p.cleanHand();p.resetScore()});
	init();
	
	settingsWindow.style.display = 'none';
	SettingsOn = false;
	play();

}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function allowedTiles(hand) {
	let res = [];
	let flipped = false;
	let direction = "left";
	for (const domino of hand) {
		let v = domino.val;
		if (domino.double) {
			if (
				PLAYABLE["left"] === PLAYABLE["right"] &&
				PLAYABLE["left"] == v[0]
			) {
				direction = getDirection();
				res.push([domino, false, direction]);
			} else if (PLAYABLE["left"] == v[0]) {
				direction = "left";
				res.push([domino, false, direction]);
			} else if (PLAYABLE["right"] == v[0]) {
				direction = "right";
				res.push([domino, false, direction]);
			}
		} else {
			if (
				PLAYABLE["left"] === PLAYABLE["right"] &&
				v.includes(PLAYABLE["left"])
			) {
				direction = getDirection();
				let bool = direction == "left" ? 0 : 1;
				if (VERTICALS[direction]) {
					flipped = PLAYABLE[direction] == v[0] ? bool - 1 : bool - 0;
				} else {
					flipped = PLAYABLE[direction] == v[0] ? bool - 0 : bool - 1;
				}
				res.push([domino, flipped, direction]);
			} else {
				if (v.includes(PLAYABLE["left"])) {
					direction = "left";
					//console.log('top' == VERTICALS['left'])
					if (VERTICALS["left"]) {
						flipped = PLAYABLE["left"] == v[0] ? true : false;
					} else {
						flipped = PLAYABLE["left"] == v[0] ? false : true;
					}
					res.push([domino, flipped, direction]);
				}
				if (v.includes(PLAYABLE["right"])) {
					direction = "right";
					if (VERTICALS["right"]) {
						flipped = PLAYABLE["right"] == v[0] ? false : true;
						//console.log(v, flipped)
					} else {
						//console.log(v + 'no')
						flipped = PLAYABLE["right"] == v[0] ? true : false;
					}
					res.push([domino, flipped, direction]);
				}
			}
		}
	}
	return res;
}
function UpdatePlayable(domino, direction, flipped, max_v) {
	let left = max_v["left"] === true ? 1 : 0;
	let right = max_v["right"] === true ? 1 : 0;
	//let left = 0;let right = 0
	if (VERTICALS[direction]) {
		if (!domino.double) {
			if (direction == "right") {
				PLAYABLE[direction] = flipped
					? domino.val[right - 0]
					: domino.val[1 - right];
			} else {
				PLAYABLE[direction] = flipped
					? domino.val[1 - left]
					: domino.val[left - 0];
			}
		}
	} else {
		if (!flipped) {
			PLAYABLE[direction] =
				direction == "right"
					? domino.val[right - 0]
					: domino.val[1 - left];
		} else {
			PLAYABLE[direction] =
				direction == "right"
					? domino.val[1 - right]
					: domino.val[left - 0];
		}
	}
}

function make_move(d, thisPlayer) {
	//(d)
	thisPlayer.hand.remove(d[0]);
	thisPlayer.clean();
	thisPlayer.populate();
	let vertical = d[0].double && LIMITS[d[2]] == 5 ? "" : VERTICALS[d[2]];
	let after_double =
		!d[0].double && LIMITS[d[2]] == 6 ? "" : AFTER_DOUBLE[d[2]];
	let flipped = d[1];
	if (LIMITS[d[2]] > 7) {
		flipped = d[1] ? false : true;
	}
	UpdatePlayable(d[0], d[2], flipped, switch_path);
	if (d[0].double) {
		TilesPlayed[d[0].val[0]] += 1;
	} else {
		TilesPlayed[d[0].val[0]] += 1;
		TilesPlayed[d[0].val[1]] += 1;
	}
	transform.setTransform(
		ctx,
		d[0].image,
		d[2],
		flipped = flipped,
		(vertical = vertical),
		(after_double = after_double),
		 d[0].double,
		LIMITS[d[2]] == 5 && !d[0].double && test[d[2]],
		LIMITS[d[2]] == 7 && !d[0].double,
		switch_path = switch_path
	);

	if (++LIMITS[d[2]] == 5) {
		VERTICALS[d[2]] = d[2] == "left" ? "top" : "down";
		AFTER_DOUBLE[d[2]] = "";
		if (d[0].double) {
			test[d[2]] = false;
		}
	} else if (LIMITS[d[2]] == 7) {
		if (d[0].double) {
			AFTER_DOUBLE[d[2]] = "h";
		} else {
			AFTER_DOUBLE[d[2]] = "";
		}
	} else if (LIMITS[d[2]] > 7) {
		switch_path[d[2]] = true;
		VERTICALS[d[2]] = "";
		AFTER_DOUBLE[d[2]] = d[0].double ? "v" : "";
	} else {
		if (d[0].double) {
			if (VERTICALS[d[2]]) {
				AFTER_DOUBLE[d[2]] = "h";
			} else {
				AFTER_DOUBLE[d[2]] = "v";
			}
		} else {
			AFTER_DOUBLE[d[2]] = "";
		}
	}
}



function handleConflitLeft(e) {
	canvas.played = true; //e.currentTarget.removeEventListener(e.type, handler);
	canvas.domino[2] = "left";
	//canvas.removeEventListener("click", playingTile);
	clearTimeout(canvas.timout);
	make_move(canvas.domino, canvas.np);
	canvas.reslovethis();
}
function handleConflitright(e) {
	canvas.played = true; //e.currentTarget.removeEventListener(e.type, handler);
	
	canvas.domino[2] = "right";
	for (let index = canvas.res.length - 1; index >= 0; index--) {
		if (canvas.res[index][0] == canvas.domino[0]) {
			canvas.domino[1] = canvas.res[index][1];
			break;
		}
	}
	//canvas.removeEventListener("click", playingTile);
	clearTimeout(canvas.timout);
	make_move(canvas.domino, canvas.np);
	canvas.reslovethis();
}


function PlayMe() {
	canvas.played = false;
	let divs = document.querySelectorAll('#down >.tiles > .allowed');
	
	return new Promise(resolve => {
		let handler = {
			get: function(target, name) {
				return target.hasOwnProperty(name) ? target[name] : 0;
			}
		};

		let dominoDict = new Proxy({}, handler);
		canvas.res.forEach(domino => {			
			dominoDict[domino[0].src] += 1;
		});

		function playingTile(e) {
			canvas.res.filter(  (e) => console.log(e[0].src) )

			let domino = canvas.res.filter((k) => k[0].src.split('/').slice(-1)[0] == e.target.src.split('/').slice(-1)[0])[0]
			console.log(`domino is ${domino[0].src}`)
					if (!canvas.played) {
						if (
							PLAYABLE["left"] !== PLAYABLE["right"] &&
							dominoDict[domino[0].src] > 1
						) {
							canvas.domino = domino;
							leftbutton.style.display = "block";
							leftbutton.style.top =
								(transform.LAST_Y["left"]+ canvas.offsetTop - 40 ).toString()  +
								"px";
							leftbutton.style.left =
								(
									transform.LAST_X["left"] +
									canvas.offsetLeft -40
								).toString() + "px";
							rightbutton.style.display = "block";
							rightbutton.style.top =
								(transform.LAST_Y["right"]  + canvas.offsetTop -40 ).toString()+
								"px";
							rightbutton.style.left =
								(
									transform.LAST_X["right"] +
									canvas.offsetLeft 
								 -40 ).toString() + "px";
						} else {
							//e.currentTarget.removeEventListener(e.type, handler);

							clearTimeout(canvas.timout);
							
							
							make_move(domino, canvas.np);
							//div.className =''
							
							resolve("here");
							
						}
						canvas.played = true;
						divs.forEach((div)=>{
							div.removeEventListener('click', playingTile)
						})
					}
				
			
		}
		canvas.reslovethis = () => {
			
			resolve("");
		};
		
		divs.forEach((div)=>{
				div.addEventListener('click', playingTile)
			})
		canvas.timout = setTimeout(() => {
			divs.forEach((div)=>{
				div.removeEventListener('click', playingTile)
			})
				let d = canvas.res.random_choice()[0];
				make_move(d, canvas.np);
			
			
			resolve("");
		}, WaitingTime);
	});
}
//console.log(width, height)

function PrepareMe(res) {
	let tiles = document.querySelectorAll('#down > .tiles >  img');
	tiles.forEach((e) => e.src);

	
	tiles.forEach((e) => {
		if(res.some((e2) =>	(e.src.split('/').slice(-1)[0] == e2[0].src.split('/').slice(-1)[0]))){ 
			/*
				allowed = allowed.concat([e,e2[1],e2[2]])
				
			 */
			e.classList.add('allowed')
			e.classList.add('tile')
			}
		
	})
	return res
}


function choice(){
	let divs = document.querySelectorAll('#down >.tiles > img');
	return new Promise(resolve => {
	function playThis(e) {
		clearTimeout(tim);
		divs.forEach((div)=>{
			div.removeEventListener('click', playThis)
			div.classList.remove('allowed')
		})
		console.log(` d in choice is ${e.target.src}`);
		resolve(e.target.src);
	}
	divs.forEach((div)=>{
		div.addEventListener('click', playThis)
		div.classList.add('allowed')
	})
	let tim = setTimeout(()=>{
		divs.forEach((div)=>{
			div.removeEventListener('click', playThis)
			div.classList.remove('allowed')
		})			
			let d = Array.from(divs).random_choice()[0].src.split('00/')
			//let d = divs[0].src.split('00/')[1];

			//try using random_choice() later with converting nodelist to array



			
			resolve(d);
		
	

	},WaitingTime)
})}
//location.reload();

async function play() {
	let s = cycle2.next().value
	let starter = players[s]
	console.log(`now play ${s} , ${players[s].place}`)
	console.log(`now hand  ${players[s].hand}`);

	starter.isPlaying();
	let d 
	if (s===2) {
	
		let src = await choice();
	
	console.log(`resolved src is ${src.split('/').slice(-1)[0]}`);
	starter.hand.find(  (e) => console.log(e.src.split('/').slice(-1)[0]) )
	
	d= starter.hand.find(  (e) => e.src.split('/').slice(-1)[0] == src.split('/').slice(-1)[0] )
	console.log(`resolved d is ${d}`);

	
	starter.delete(d)
	
	}
	else {
		console.log(starter.hand.length)
		d= starter.hand.random_choice()[0]
		starter.clean()
		starter.populate()
	}
	//starter.hand.remove(d);
	//starter.delete(d)
	console.log(`index d is ${d}`)
	let image = new Image();
	image.src = d.src;
	
	//leftbutton.style.display = "none";
	//rightbutton.style.display = "none";


	if (!d.double) {
		TilesPlayed[d.val[1]] += 1
		drawFirstTile(ctx, image, x, y)
	}
	else {
		ctx.drawImage(image, x, y, tile_w, tile_h);
		AFTER_DOUBLE["left"] = "v";
		AFTER_DOUBLE["right"] = "v";
	}
	PLAYABLE['left'] = d.val[1]
	PLAYABLE['right'] = d.val[0]
	TilesPlayed[d.val[0]] += 1

	let cycle = Cycle(players, s);
	
	
	var done = false;
	done2 = false;
	starter.donePlaying()
	while (!done && !done2) {
		let np = cycle.next().value;
		let res = allowedTiles(np.hand);
		starter.hand.find(  (e) => console.log(e.src) )

		if (res.length) {
			np.isPlaying()
			if (np.place == "down") {
				PrepareMe(res);

				canvas.res = res;
				canvas.np = np;
				await PlayMe();
				leftbutton.style.display = "none";
				rightbutton.style.display = "none";
			} else {
				
				await sleep(2000);
				let d = res.random_choice()[0];
				make_move(d, np);
				console.log(np.place)
				console.log((np.hand))
			}
			let WinnerSum = 0
			if (np.hand.length == 0) {
				
				for (let index = 0; index < players.length; index++) {
					WinnerSum+= players[index].sum()
				}
				
				starterIndex = players.indexOf(np);

				players.forEach(player => {
					player.clean();
					player.populate();
				});
				done = true;
				if (TwoVsTwo == true) {
					if (np.place == 'down' || np.place == 'up'){
						let winners =players.filter((player)=> player.place == 'down' || player.place == 'up');
						winners[0].setScore(WinnerSum,SCORES[winners[0].pace])
						winners[1].setScore(WinnerSum,SCORES[winners[1].pace])

					}
					else {
						let winners =players.filter((player)=> player.place == 'left' || player.place == 'right');
						winners[0].setScore(WinnerSum,SCORES[winners[0].pace])
						winners[1].setScore(WinnerSum,SCORES[winners[1].pace])

					}
				}
				else{
					np.setScore(WinnerSum,SCORES[np.place])}
			}
			else if (
				PLAYABLE["left"] == PLAYABLE["right"] &&
				TilesPlayed[PLAYABLE["right"]] >= 7
			) {
				
				for (let index = 0; index < players.length; index++) {
					WinnerSum+= players[index].sum()
				}
				
				let winner = players.reduce((a, b) =>
					a.sum() < b.sum() ? a : b
				);
				starterIndex = players.indexOf(winner);
				players.forEach(player => {
					player.clean();
					player.populate();
				});
				done = true;
				if (TwoVsTwo == true) {
					if (winner.place == 'down' || winner.place == 'up'){
						let winners =players.filter((player)=> player.place == 'down' || player.place == 'up');
						winners[0].setScore(WinnerSum,SCORES[winners[0].place])
						winners[1].setScore(WinnerSum,SCORES[winners[1].place])

					}
					else {
						let winners =players.filter((player)=> player.place == 'left' || player.place == 'right');
						winners[0].setScore(WinnerSum,SCORES[winners[0].place])
						winners[1].setScore(WinnerSum,SCORES[winners[1].place])

					}
				}
				else{
					winner.setScore(WinnerSum,SCORES[np.place])}
				//console.log(WinnerSum)
			

				}	
		endGame = players.some(p => p.score>=MaxScore)
		
			} else {
			//np.pass();
			console.log(np.place, " passed");
		}
		np.donePlaying()
	}
	displayResult()
}
//document.addEventListener('load',play())
try {
	play()

} catch(e){
	console.log(e)
}
function displayResult() {
	results.style.display = 'flex'
	players.forEach(p => {p.displayResult()});
}

function drawFirstTile(ctx, image, x, y, deg = 90) {
	ctx.save();
		ctx.translate(x, y);
		ctx.rotate(deg * TO_RADIANS);
		ctx.drawImage(
			image,
			0.5*tile_w,
			-0.75*tile_h,
			tile_w,
			tile_h
		);
		ctx.restore();
}
