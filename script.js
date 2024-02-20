class ParamsGenerate {

	constructor() {
		this.current_level = 1;  // Текущий уровень
		this.levels = 9;  // Количество уровней
		this.min_number = 1;  // Минимальное число для генерации
		this.max_number = 10;  // Максимальное число
		this.num_row = 2;
		this.num_col = 3;

		this.animation_permission = false;

		// Параметры уровней
		this.levelParameters = {
			1: { min: 1, max: 10, numRows: 2, numCols: 3 },
			2: { min: 10, max: 100, numRows: 2, numCols: 3 },
			3: { min: 100, max: 1000, numRows: 2, numCols: 3 },
			4: { min: 100, max: 1000, numRows: 3, numCols: 4 },
			5: { min: 100, max: 1000, numRows: 3, numCols: 4 },
			6: { min: 1000, max: 10000, numRows: 4, numCols: 4 },
			7: { min: 1000, max: 10000, numRows: 4, numCols: 4 },
			8: { min: 1000, max: 10000, numRows: 5, numCols: 5 },
			9: { min: 1000, max: 10000, numRows: 5, numCols: 5 },
		};
	}

	// Установить новые параметры (диапазон чисел, количество строк и столбцов)
	set() {
		const params = this.levelParameters[this.current_level] || {};
		this.min_number = params.min || this.min_number;
		this.max_number = params.max || this.max_number;
		this.num_row = params.numRows || this.num_row;
		this.num_col = params.numCols || this.num_col;

		// После 2 уровня выдаём разрешение на добавление анимации к кнопкам
		if (this.current_level > 2) {
			this.animation_permission = true;
		} else {
			this.animation_permission = false;
		}
	}

	// Функция для генерации рандомного числа в заданных границах (включительно)
	generateRandomNumber(exception_array) {
		const min = Math.ceil(this.min_number);
		const max = Math.floor(this.max_number);
		const random_number = Math.floor(Math.random() * (max - min + 1)) + min;
		if (exception_array.includes(random_number)) {
			return this.generateRandomNumber(exception_array);
		}
		return random_number;
	}

	// Функция для получения рандомного значения из заданного массива
	getRandomValueFromArray(arr){
		return arr[Math.floor(Math.random() * arr.length)];
	}

	// Функция для сброса параметров
	reset() {
		this.current_level = 1;
	}
}

class Stat {

	constructor() {
		this.num_correct_answers = 0;  // Счётчик количества правильных ответов
	}

	// Функция для вычисления результата игры
	getResult(current_level) {
		const accuracy = ((this.num_correct_answers / current_level) * 100).toFixed(0);
		return `Отгадано чисел: ${this.num_correct_answers} из ${current_level}. Точность: ${accuracy}%`;
	}

	// Функция для сброса параметров
	reset(){
		this.num_correct_answers = 0;
	}
}

class FindNumberGame {
	
	constructor() {
		// Settings
		this.default_time = 60;  // Стандартное время на прохождение теста, с

		this.color_array = ["pink", "orange", "purple", "blue", "yellow", "green"];  // Цвета кнопок
		this.animation_array = ["blink", "scale", "rotate"];  // Анимация кнопок

		// Объявление экземпляров классов
		this.paramsGen = new ParamsGenerate(); 
		this.stat = new Stat(this.paramsGen.levels);

		// Process var
		this.timer;  // Таймер
		this.current_time;  // Текущее время таймера, с
		this.target_number;  // Число, которое необходимо найти
		this.current_numbers_array;  // Массив с числами таблицы
	}
	
	// Функция для запуска игры
	start() {
		this.initializeGame();
		this.startTimer();
		this.updateGameWindow();
	}

	// Функция для инициализации игры
	initializeGame() {
		this.target_number = null;
		this.paramsGen.reset();
		this.stat.reset();

		document.querySelector(".start-button").disabled = true;
		document.querySelector(".game-container").classList += ` item-color--${this.paramsGen.getRandomValueFromArray(this.color_array)}`
		document.querySelector(".result").style.display = "none";
	}

	// Функция для запуска таймера
	startTimer() {
		this.current_time = this.default_time;
		this.timer = setInterval(() => this.updateTimer(), 1000);
	}
	
	// Функция для обновления окна с игрой
	updateGameWindow() {
		document.querySelector(".level").innerHTML = `(Уровень: ${this.paramsGen.current_level} - ${this.paramsGen.levels})`;
		this.generateTable();
		this.target_number = this.paramsGen.getRandomValueFromArray(this.current_numbers_array);
		this.updateTargetNumber();
	}

	// Функция для генерации и отображения таблицы с числами
	generateTable() {
		this.current_numbers_array = [];
		const div_table = document.querySelector(".number-table");
		div_table.innerHTML = "";

		// Устанавливаем значения генерации для конкретного уровня
		this.paramsGen.set();

		for (let i = 0; i < this.paramsGen.num_row; i++) {
			var div_row = document.createElement("div");
			div_row.classList = "number-table__row";

			for (let j = 0; j < this.paramsGen.num_col; j++) {
				// Генерация числа
				const number = this.paramsGen.generateRandomNumber(this.current_numbers_array);
				this.current_numbers_array.push(number);

				// Создание кнопки
				const button = document.createElement("button");
				const random_color = this.paramsGen.getRandomValueFromArray(this.color_array);

				let button_class = `number-item item-color--${random_color} `;

				if (this.paramsGen.animation_permission === true) {
					let random_animation = this.paramsGen.getRandomValueFromArray(this.animation_array);
					button_class += `number-item-animation--${random_animation}`;
				}

				button.classList = button_class;
				button.addEventListener("click", () => this.selectNumber(number, button));

				// Добавление содержимого к кнопке 
				const span = document.createElement("span");
				span.textContent = number;
				span.classList = "number-item__text";
				button.appendChild(span);
				
				// Добавлени кнопки в строку 
				div_row.appendChild(button);
			}
			// Добавление строки в таблицу
			div_table.appendChild(div_row);
		}
	}

	// Функция для отображения числа, которое необходимо найти
	updateTargetNumber() {
		if (this.target_number !== null) {
			document.querySelector(".target-number-reference").textContent = this.target_number;
		}
	}

	// Функция для обновления таймера
	updateTimer() {
		if (this.current_time-- > 0) {
			document.querySelector(".timer").innerHTML = `Осталось времени: ${this.current_time} сек.`;
		} else {
			clearInterval(this.timer);
		}
	}

	// Функция для регистрации нажатия на кнопку с числом
	selectNumber(number, button) {
		if (number === this.target_number) {
			this.stat.num_correct_answers++;
		}
		if (this.current_time > 0) {
			this.nextLevel();
		} else {
			this.endGame();
		}
	}

	// Функция для перехода на следующий уровень
	nextLevel() {
		if (this.paramsGen.current_level < this.paramsGen.levels) {
			this.paramsGen.current_level++;
			this.updateGameWindow();
		} else {
			this.endGame();
		}
	}

	// Функция для завершения игры
	endGame() {
		document.querySelector(".start-button").disabled = false;
		clearInterval(this.timer);
		document.querySelector(".timer").innerHTML = ""
		document.querySelector(".target-number-reference").innerHTML = ""
		document.querySelector(".number-table").textContent = "";
		
		document.querySelector(".result").innerHTML = this.stat.getResult(this.paramsGen.current_level);
		document.querySelector(".result").style.display = "block";
	}
}

