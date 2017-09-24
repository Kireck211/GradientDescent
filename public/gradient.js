var SIZE = 600;
var b = 0;
var m = 0;
var learning_rate = 0;
var points = [];
var iterations = 1000;
var canvas;
var min_value_x = 1000000, min_value_y = 1000000;
var max_value_x = -1, min_value_y = 1000000;

function squared_min_difference(b, m, points) {
	var total_error = 0;
	for (var i = 0; i < points.length; i++) {
		var x = points[i, 0];
		var y = points[i, 1];
		total_error += (y - (m * x + b)) ** 2;
	}
	return total_error / (points.length).toFixed(0);
}

function step_gradient(current_b, current_m, points, learning_rate) {
	var gradient_b = 0;
	var gradient_m = 0;
	var N = points.length.toFixed(0);
	for (var i = 0; i < N; i++) {
		var x = points[i, 0];
		var y = points[i, 1];
		gradient_b += -(2/N) * (y - (current_m * x + current_b));
		gradient_m += -(2/N) * x * (y - (current_m * x + current_b));
	}
	var new_b = current_b - (learning_rate * gradient_b);
	var new_m = current_m - (learning_rate * gradient_m);
	return new_b, new_m;
}

function get_extreme_points(b, m) {
	var function_calc = function (m, x, b) {
		return m * x + b;
	}
	return 0, SIZE - function_calc(m, 0, b), SIZE, SIZE - function_calc(m, SIZE, b);
}

function init_drawing(data) {
	var all_text_lines = data.split(/\r\n|\n/);
	var entries = [];
	for (var i = 0; i < all_text_lines.length - 1; i++) {
		var array = all_text_lines[i].split(',');
		array[0] = parseFloat(array[0]);
		array[1] = parseFloat(array[1]);
		if (array[0] < min_value_x)
			min_value_x = array[0];
		if (array[1] < min_value_y)
			max_valule_y = array[1];
		if (array[0] > max_value_x)
			max_value_x = array[0];
		if (array[1] > max_valule_y)
			max_valule_y = array[1];
		entries.push(array);
	}
	var points = [];

	while (entries.length > 0) {
		var x_y = entries.shift();
		x_y[0] = (x_y[0] - min_value_x) * SIZE / (max_valule_x - min_value_x);
		x_y[1] = (x_y[0] - min_value_y) * SIZE / (max_valule_y - min_value_y);
		ellipse(x_y[0], x_y[1], 2, 2);
		//point(x_y[0], x_y[1]);
		points.push(x_y);
	}

	return points;
}

function gdb() {
	b, m = step_gradient(b, m, points, learning_rate);
	// change values of b and m from index
	line(get_extreme_points(b, m));
}

function start_gradient() {
	$.ajax({
		type: 'GET',
		url: '/static/hours_score.csv',
		datatype: "text"
	}).done(function (data) {
		points = init_drawing(data);
	});
}

function setup() {
	canvas = createCanvas(SIZE, SIZE);
	canvas.parent('data-holder');
	background('#C0C0C0');
	start_gradient();
}

function draw() {
	if (points.length > 0 && iterations > 0) {
		gdb();
		iterations--;
	}
}