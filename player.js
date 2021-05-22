export default class Player {
	constructor(place) {
		this.place = place;
		this.me = false;
		this.rotate = false;
        this.element = document.querySelector(`#${this.place}`)
        this.scorePlace = document.createElement('div');
		this.text = document.createElement('p')
		this.text.innerHTML = `${Math.round(Math.random()*100)}`;
		this.scorePlace.appendChild(this.text);
		this.scorePlace.title = 'player Score';
		this.scorePlace.className = 'score';
		this.score = 0;
		this.element.appendChild(this.scorePlace);
		this.handResult = document.querySelector(`#result${this.place}`);
		//console.log(this.handResult)
		this.countResult = document.querySelector(`#count${this.place}`)
		if (place == "down") {
			this.me = true;
		}
		this.hand = [];
		
	};/*
	starter() {
		for (const tile of this.hand) {
			//console.log('tile is ' + tile.val)
			if (tile.val[0] == "6" && tile.val[1] == "6") {
				return tile;
			}
		}
		return false;
	}*/

	isPlaying(){
		this.scorePlace.style.color = 'white';
		this.scorePlace.style.backgroundColor = '#219e39';


	}
	donePlaying(){
		this.scorePlace.style.color = 'black';
		this.scorePlace.style.backgroundColor = 'white';
	}
	setScore(scre){
		//this.hand = [];
		this.score += scre;
		this.scorePlace.innerHTML = this.score.toString()
		}
	resetScore(){
		this.score = 0
		this.scorePlace.innerHTML = this.score.toString()
	}
	populate() {
		
		if (this.place =='down' || this.place =='up'){
			if (this.place =='down')	{
				
				this.hand.forEach((domino)=>{
					this.append(domino.image)
				})
			}
			else {
				
				this.hand.forEach((domino)=>{
					this.append(domino.alt)
				})
		}}
		else {
				this.hand.forEach((domino)=>{
					this.append(domino.alt2)
				});
	}}
	append(image){
		let tile = document.querySelector(`#${this.place} > .tiles`)
		image.className = 'tile';
		tile.appendChild(image);
	
	}
	displayResult(){
		this.hand.forEach((e)=>{
			e.image.className = 'smallimage';
			this.handResult.appendChild(e.image);
		})
		
		
	}
	
	sum() {
		let s = 0;
		for (let index = 0; index < this.hand.length; index++) {
			s += this.hand[index].count;
		}

		return s;
	}
	delete(d){
		let i  =this.hand.indexOf(d)
		//let tiles = this.element.querySelectorAll('.tiles > .tile')
		console.log(this.hand[0])
		console.log(d)
		this.hand[i].image.style.display = 'none'
		this.hand.remove(d)
		//this.element.removeChild(this.hand[i].alt)
		//this.element.removeChild(this.hand[i].alt2)
		
		
	}
	cleanHand(){
		this.hand = []
	}
	clean(){
		this.handResult.childNodes.forEach((e)=>e.remove())
		
		this.element.querySelectorAll('.tile').forEach((e)=>{
			e.remove()
		})
		
	}
	pass() {
		//let toast = document.querySelector("#toast");
		this.toast.classList.add('toast')
		this.toast.classList.add('show')
		this.toast.innerHTML = `pass :(`;
		//this.toast.style.top =( this.y ).toString() + 'px'
		//this.toast.style.left = (this.x  + (this.place == 'right' ? -canvas.offsetLeft:canvas.offsetLeft) ).toString() + 'px'
		  
  		setTimeout(()=>{this.toast.classList.remove("show"); }, 2000);

	}
}