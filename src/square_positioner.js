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
            return listDivisors(any_number);
        }
    } else {
        throw new Error("Can only find the divisors of number objects!");
    }
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

function init(rectangle_width, rectangle_height, number_of_squares) {
    var valid_results = [];
    N = number_of_squares;
    var the_rectangle = new Rectangle(rectangle_width, rectangle_height);
    var possible_cases_of_x_and_y = find_dividors_of_number(N);

    for (var i = 0; i < possible_cases_of_x_and_y.length; i++) {
        x = possible_cases_of_x_and_y[i];
        y = possible_cases_of_x_and_y[(possible_cases_of_x_and_y.length - i - 1)];
        //console.log("x: "+x +" y:"+y);
        var square_sample = new Square(the_rectangle.width / x);
        if (!Equation_Rectangle(number_of_squares)) {
            continue;
        }
        if (!Equation_Horizontal(the_rectangle, square_sample, N)) {
            continue;
        }
        if (!Equation_Vertical(the_rectangle, square_sample, N)) {
            continue;
        }

        // if we came here our square object is valid.
        valid_results.push({
            x: x,
            y: y,
            square: square_sample,
            rectangle: the_rectangle
        });
    }

    // if there is only one possible case of x and y, we have to check
    // sample square creation with the_rectangle.height / y
    if (possible_cases_of_x_and_y.length == 1) {
        x = possible_cases_of_x_and_y[0];
        y = possible_cases_of_x_and_y[0];

        var square_sample = new Square(the_rectangle.height / x);
        if (Equation_Rectangle(number_of_squares) &&
            Equation_Horizontal(the_rectangle, square_sample, N) &&
            Equation_Vertical(the_rectangle, square_sample, N)) {

            valid_results.push({
                x: x,
                y: y,
                square: square_sample,
                rectangle: the_rectangle
            });
        }
    }


    console.log(valid_results);

    /**
     * Best fit can be found via the min difference between 'x' and 'y'
     */
    var best_fit = null;
    var min_diff_between_x_and_y = Number.MAX_VALUE;
    for (var i = 0; i < valid_results.length; i++) {
        var valid_result_sample = valid_results[i];
        var diff = Math.abs(valid_result_sample.x - valid_result_sample.y);
        if (diff < min_diff_between_x_and_y) {
            min_diff_between_x_and_y = diff;
            best_fit = valid_result_sample;
        }
    }
    console.log("Best fit:");
    console.log(best_fit);

    return [valid_results, best_fit];
}