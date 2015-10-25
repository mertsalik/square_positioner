/**
 * Created by mertsalik on 25/10/15.
 */


/**
 * Define the Rectangle with K and L edges
 * K will be the horizontal edge ( imaginary )
 * L will be the vertical edge
 */

function Rectangle(K, L) {
    if (typeof K === 'number' && typeof L === 'number') {
        return {
            width: K,
            height: L
        };
    } else {
        throw new Error("Edge values of the rectangle must be number !");
    }
}

/**
 * Define the Square, which will be placed in Rectangle
 * The edge of the square will be named as a.
 */

function Square(a) {
    if (typeof a === 'number') {
        return {
            height: a,
            width: a
        }
    } else {
        throw new Error("Edge value of squares must be number!");
    }
}

/**
 * We can place 'x' pieces of square in horizontal dimension,
 * and 'y' pieces of square will be in the vertical dimension.
 * If the required square count is 'N', we will have these equations
 */

var N, x, y;

function Equation_Rectangle(number_of_squares) {
    return (x * y == number_of_squares);
}

function Equation_Horizontal(rectangle_object, square_object, number_of_squares) {
    return (x * square_object.width <= rectangle_object.width);
}

function Equation_Vertical(rectangle_object, square_object, number_of_squares) {
    return (y * square_object.height <= rectangle_object.height);
}

/**
 * We must find divisors of the required number of square count
 */
function find_dividors_of_number(any_number) {
    if (typeof any_number === 'number') {
        if (any_number < 1) {
            throw new Error("Number out of range (< 1)");
        } else if (any_number >= 9007199254740992) {
            throw new Error("Number too large");
        } else {
            // happy path :3
            return getFactors(any_number);
        }
    } else {
        throw new Error("Can only find the divisors of number objects!");
    }
}

/**
 * Returns list of all divisors
 * @param integer
 * @returns {Array}
 */
function getFactors(integer) {
    var factors = [],
        quotient = 0;

    for (var i = 1; i <= integer; i++) {
        quotient = integer / i;

        if (quotient === Math.floor(quotient)) {
            factors.push(i);
        }
    }
    return factors;
}

/**
 * Returns the list of divisors (in ascending order) of the given integer.
 * Examples:
 *   divisorList(1) = [1]
 *   divisorList(5) = [1, 5]
 *   divisorList(12) = [1, 2, 3, 4, 6, 12]
 *
 *   original source : http://www.nayuki.io/res/calculate-divisors-javascript.js
 */
function listDivisors(n) {
    if (n < 1)
        throw "Argument error";

    var small = [];
    var large = [];
    var end = Math.floor(Math.sqrt(n));
    for (var i = 1; i <= end; i++) {
        if (n % i == 0) {
            small.push(i);
            if (i * i != n)  // Don't include a square root twice
                large.push(n / i);
        }
    }
    large.reverse();
    return small.concat(large);
}


/**
 * We will be initialize the environment with a Rectangle and Required number of square count
 */

function check_square_sample(square_sample, the_rectangle, number_of_squares) {
    if (!Equation_Rectangle(number_of_squares)) {
        return false;
    }
    if (!Equation_Horizontal(the_rectangle, square_sample, N)) {
        return false;
    }
    if (!Equation_Vertical(the_rectangle, square_sample, N)) {
        return false;
    }
    return true;
}

function init(rectangle_width, rectangle_height, number_of_squares) {
    console.log("rectangle_width:" + rectangle_width);
    console.log("rectangle_height:" + rectangle_height);
    var valid_results = [];
    N = number_of_squares;
    var the_rectangle = new Rectangle(rectangle_width, rectangle_height);
    var possible_cases_of_x_and_y = find_dividors_of_number(N);
    console.log("divisors");
    console.log(possible_cases_of_x_and_y);
    for (var i = 0; i < possible_cases_of_x_and_y.length; i++) {
        x = possible_cases_of_x_and_y[i];
        y = possible_cases_of_x_and_y[(possible_cases_of_x_and_y.length - i - 1)];
        console.log("x: " + x + " y:" + y);
        var square_sample = new Square(the_rectangle.width / x);

        if (check_square_sample(square_sample, the_rectangle, number_of_squares)) {
            valid_results.push({
                x: x,
                y: y,
                square: square_sample,
                rectangle: the_rectangle
            });
        }

        square_sample = new Square(the_rectangle.height / x);
        if (check_square_sample(square_sample, the_rectangle, number_of_squares)) {
            valid_results.push({
                x: x,
                y: y,
                square: square_sample,
                rectangle: the_rectangle
            });
        }
    }

    console.log(valid_results);

    var best_fit = null;
    best_fit = best_fit_by_x_and_y_diff(valid_results);
    //best_fit = best_fit_by_empty_area_optimization(valid_results);
    return [valid_results, best_fit];
}

/**
 * Best fit can be found via the min difference between 'x' and 'y'
 */
function best_fit_by_x_and_y_diff(cases) {
    var best_fit = null;
    var min_diff_between_x_and_y = Number.MAX_VALUE;
    for (var i = 0; i < cases.length; i++) {
        var valid_result_sample = cases[i];
        var diff = Math.abs(valid_result_sample.x - valid_result_sample.y);
        if (diff < min_diff_between_x_and_y) {
            min_diff_between_x_and_y = diff;
            best_fit = valid_result_sample;
        }
    }
    console.log("Best fit:");
    console.log(best_fit);
    return best_fit;
}

function best_fit_by_empty_area_optimization(cases) {
    var best_fit = null;
    var min_empty_area = Number.MAX_VALUE;
    for (var i = 0; i < cases.length; i++) {
        var valid_result_sample = cases[i];
        var empty_area = (valid_result_sample.rectangle.width * valid_result_sample.rectangle.height)
            - (valid_result_sample.x * valid_result_sample.y * valid_result_sample.square.height);
        if (empty_area < min_empty_area) {
            min_empty_area = empty_area;
            best_fit = valid_result_sample;
        }
    }
    return best_fit;
}

function init2(rectangle_width, rectangle_height, number_of_squares) {
    var row_count = 1;
    var temp_square_count = 0;
    var valid_area_results = [];
    while (row_count == 1) {
        temp_square_count++;
        var results = init(rectangle_width, rectangle_height, temp_square_count);
        var fit = results[1];
        if (fit != null) {
            if (fit.y == 1) {
                valid_area_results.push(fit);
            }
            row_count = fit.y;
        }
    }
    // we have to select maximum area result in valid_area_results
    var max_area_environment = best_fit_by_empty_area_optimization(valid_area_results);
    var new_environment = init(max_area_environment.square.height * max_area_environment.x, max_area_environment.square.height * max_area_environment.y, number_of_squares);
    if (new_environment.length == 2 && new_environment[1] != null) {
        new_environment[1].rectangle.width = rectangle_width;
        new_environment[1].rectangle.height = rectangle_height;
    }


    return new_environment;
}