var word = {
  secret_word: "",
  word_list: ['ruby', 'rails', 'javascript', 'array', 'hash', 'underscore', 'sinatra', 'model', 'controller', 'view', 'devise', 'authentication', 'capybara', 'jasmine', 'cache', 'sublime', 'terminal', 'system', 'twitter', 'facebook', 'function', 'google', 'amazon', 'development', 'data', 'design', 'inheritance', 'prototype', 'gist', 'github', 'agile', 'fizzbuzz', 'route', 'gem', 'deployment', 'database'],

  setSecretWord: function() {
  	this.secret_word = _.sample(this.word_list)
  },

  checkLetters: function(guessed_letters) {
  	var secret_word_letters = this.secret_word.split('');
  	var letters_with_blanks = _.map(secret_word_letters, function(letter) {
  		if(_.contains(guessed_letters, letter)) {
  			return letter;
  		} else {
  			return '_';
  		}	
  	});
  	var secret_word_with_blanks = letters_with_blanks.join(' ');

  	var wrong_letters = _.reject(guessed_letters, function(letter) {
  		return _.contains(secret_word_letters, letter);
  	});

  	// console.log('wrong_letters = ' + wrong_letters)
  	
  	var return_obj = {
  		secret_word_with_blanks: secret_word_with_blanks, 
  		wrong_letters: wrong_letters
  	};

  	return return_obj;
  }
};

var player = {
	MAX_GUESSES: 7,
	guessed_letters: [],
	isLetter: function(input) {
		return input.length === 1 && input.match(/[a-z]/);
	},
	alreadyGuessed: function(letter) {
		return this.guessed_letters.indexOf(letter) >= 0;
	},
	makeGuess: function(letter) {
		letter = letter.toLowerCase();
		var already_guessed = this.alreadyGuessed(letter);
		if (this.isLetter(letter) && !already_guessed) {
			this.guessed_letters.push(letter);
			this.guessed_letters = _.uniq(this.guessed_letters);
		}
		var results = word.checkLetters(this.guessed_letters);
		var guesses_left = this.MAX_GUESSES - results.wrong_letters.length;

		if (results.wrong_letters.indexOf(letter) >= 0 && !already_guessed) {
			moveMan();
		} 

		if (guesses_left > 0) {
			game.updateDisplay(results.secret_word_with_blanks, this.guessed_letters, guesses_left);
			this.checkWin(results.secret_word_with_blanks);
		} else {
			game.giveUp();
		}

	},
	checkWin: function(word) {
		if (word.indexOf('_') < 0) {
			// not a winner
			resetMan(true);
			alert('You Won!!!!!')
			game.resetGame();
		} 
	},
	checkLose: function(wrong_letters) {
		if (wrong_letters.length >= this.MAX_GUESSES) {
			// sorry you lost!
		}
	}
};

var game = {
	updateDisplay: function(word_string, guessed_letters, guesses_left) {
		
		
		document.getElementById('word_string').innerHTML = word_string;
		document.getElementById('guessed_letters').innerHTML = guessed_letters.join(' ');
		document.getElementById('guesses_left').innerHTML = guesses_left;

	},
	giveUp: function() {
		this.updateDisplay(word.secret_word.split('').join(' '), ['you', 'lose!'], 0);
		resetMan(false);
	},
	resetGame: function() {
		word.setSecretWord();
		player.guessed_letters = [];
		player.makeGuess('');
		resetMan(true);
	}
};

var disappointed_man;

window.onload = function() {
	var give_up_button = document.getElementById('give_up_button');
	var reset_button = document.getElementById('reset_button');
	var letter_field = document.getElementById('letter_field');
	disappointed_man = document.getElementById('disappointment')

	disappointed_man.style.backgroundPosition = "0px 0px"

	document.addEventListener('keyup', function(e) { 
		player.makeGuess(String.fromCharCode(e.keyCode));
	});

	give_up_button.addEventListener('click' , function() { game.giveUp(); });
	reset_button.addEventListener('click', function() { game.resetGame(); })
	game.resetGame();


}

function moveMan() {
	var style_array = disappointed_man.style.backgroundPosition.split(' ')
	var top_pos = parseFloat(style_array[1]);
	top_pos -= 261.5;
	if (top_pos < -784.5) {
		// move to front
		style_array[0] = "-200px"
		style_array[1] = "0px"
	} else {
		style_array[1] = top_pos + 'px';
	}
	
	disappointed_man.style.backgroundPosition = style_array.join(' ');
	return style_array
}

function resetMan(beginning) {
	if (beginning) {
		disappointed_man.style.backgroundPosition = "0px 0px"
	} else {
		disappointed_man.style.backgroundPosition = "-200px -784.5px"
	}
}


