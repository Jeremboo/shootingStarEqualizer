class ProgressBar {

	constructor(element, duration){
		this.element = element;
		this.duration = duration || -1;
		this.interval;
	}

	init(duration){
		this.endTo = new Date()/1000 + duration;
		this.duration = duration;
	}

	start(){
		this._update();
		this.interval = setInterval(() => {
			this._update();
		}, 150);
	}

	pause(){
		window.clearInterval(this.interval);
	}

	_update(){
		let size = 100-  (((this.endTo - (new Date()/1000))*100)/this.duration)
		if(size < 100 ){
			this.element.style.width = size+"%";
		} else {
			this.pause();
		}
	}
}

module.exports = ProgressBar