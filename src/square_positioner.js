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
    var valid_results = [];
    N = number_of_squares;
    var the_rectangle = new Rectangle(rectangle_width, rectangle_height);
    var possible_cases_of_x_and_y = find_dividors_of_number(N);

    for (var i = 0; i < possible_cases_of_x_and_y.length; i++) {
        x = possible_cases_of_x_and_y[i];
        y = possible_cases_of_x_and_y[(possible_cases_of_x_and_y.length - i - 1)];
        if (x == 3 && y == 2 && rectangle_width == 3 && rectangle_height == 2) {
            var anan = "za";
        }
        var square_sample = new Square(the_rectangle.width / x);

        if (check_square_sample(square_sample, the_rectangle, number_of_squares)) {
            valid_results.push({
                x: x,
                y: y,
                square: square_sample,
                rectangle: the_rectangle,
                refer: "w"
            });
        }

        square_sample = new Square(the_rectangle.height / x);
        if (check_square_sample(square_sample, the_rectangle, number_of_squares)) {
            valid_results.push({
                x: x,
                y: y,
                square: square_sample,
                rectangle: the_rectangle,
                refer: "h"
            });
        }
    }

    //console.log(valid_results);

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
    //console.log("Best fit:");
    //console.log(best_fit);
    return best_fit;
}

function best_fit_by_empty_area_optimization(cases) {
    var best_fit = null;
    var min_empty_area = Number.MAX_VALUE;
    for (var i = 0; i < cases.length; i++) {
        var valid_result_sample = cases[i];
        var empty_area = find_empty_area(valid_result_sample);
        if (empty_area < min_empty_area) {
            min_empty_area = empty_area;
            best_fit = valid_result_sample;
        }
    }
    return best_fit;
}

function find_empty_area(environment_objects) {
    return (environment_objects.rectangle.width * environment_objects.rectangle.height) - ((environment_objects.x * environment_objects.square.height) * (environment_objects.y * environment_objects.square.height));
}

function max_int(int1, int2) {
    return int1 >= int2 ? int1 : int2;
}

function init2(rectangle_width, rectangle_height, number_of_squares) {
    var row_count = 1;
    var temp_square_count = 0;
    var valid_area_results = [];
    var _gcd_rectangle_width_and_height = gcd(rectangle_width, rectangle_height);
    var trial_condition = (max_int(rectangle_height, rectangle_width) / _gcd_rectangle_width_and_height);
    //console.log("Trial cond: " + trial_condition);
    while (row_count <= trial_condition) {
        temp_square_count++;
        var results = init(rectangle_width, rectangle_height, temp_square_count);
        var fit = results[1];
        if (fit != null) {
            if (fit.y <= trial_condition) {
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

function compare_empty_area(obj1, obj2) {
    if (obj1.empty_area < obj2.empty_area)
        return -1;
    if (obj1.empty_area > obj2.empty_area)
        return 1;
    return 0;
}

function compare_square_count(obj1, obj2) {
    if (obj1.square_count < obj2.square_count)
        return -1;
    if (obj1.square_count > obj2.square_count)
        return 1;
    return 0;
}

var gcd = function (a, b) {
    if (!b) {
        return a;
    }

    return gcd(b, a % b);
};

function sort_best_options(rectangle_width, rectangle_height, number_of_square) {
    var results = [];
    number_of_square = number_of_square + 10;
    for (var i = 1; i <= number_of_square; i++) {
        var trial = init2(rectangle_width, rectangle_height, i);
        if (trial.length == 2) {
            results.push({
                empty_area: find_empty_area(trial[1]),
                environment: trial,
                square_count: i
            });
        }
    }
    results.sort(compare_empty_area);
    return results;
}


function recommmand_up_and_down(possible_options, number_of_square_given) {
    var result = [];

    var actual = null;
    for (var i = 0; i < possible_options.length; i++) {
        var opt = possible_options[i];
        if (opt.square_count == number_of_square_given) {
            actual = opt;
        }
    }

    if (actual.empty_area == 0) {
        // this option completely fits the rectangle
        console.log("skipping new recommandations...");
        return result;
    }

    var upper_recommandation = null;
    for (var i = 0; i < possible_options.length; i++) {
        var opt = possible_options[i];
        if (opt.square_count > number_of_square_given) {
            if (opt.empty_area < actual.empty_area) {
                if (upper_recommandation == null) {
                    upper_recommandation = opt;
                } else {
                    if (opt.empty_area < upper_recommandation.empty_area) {
                        upper_recommandation = opt;
                    }
                }
            }
        }
    }
    if (upper_recommandation != null) {
        result.push(upper_recommandation);
    }

    var lower_recommandation = null;
    for (var i = 0; i < possible_options.length; i++) {
        var opt = possible_options[i];
        if (opt.square_count < number_of_square_given) {
            if (opt.empty_area < actual.empty_area) {
                if (lower_recommandation == null) {
                    lower_recommandation = opt;
                } else {
                    if (opt.empty_area < lower_recommandation.empty_area) {
                        lower_recommandation = opt;
                    } else if (opt.empty_area == lower_recommandation.empty_area) {
                        if (opt.square_count > lower_recommandation.square_count) {
                            lower_recommandation = opt;
                        } else {
                            // higher valued lower recommandation is set already
                        }
                    }
                }
            }
        }
    }

    if (lower_recommandation != null) {
        result.push(lower_recommandation);
    }


    return result;
}