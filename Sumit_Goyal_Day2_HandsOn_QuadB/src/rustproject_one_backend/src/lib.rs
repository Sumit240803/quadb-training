use std::io;

fn main() {
    let mut input = String::new();

    println!("Enter first number:");
    io::stdin().read_line(&mut input).expect("Failed to read");
    let num1: f64 = input.trim().parse().expect("Invalid number");
    input.clear(); // Clear buffer

    println!("Enter an operator (+, -, *, /):");
    io::stdin().read_line(&mut input).expect("Failed to read");
    let operator = input.trim().to_string(); // Store operator separately
    input.clear();

    println!("Enter second number:");
    io::stdin().read_line(&mut input).expect("Failed to read");
    let num2: f64 = input.trim().parse().expect("Invalid number");

    let result = match operator.as_str() { // Convert back to &str for matching
        "+" => num1 + num2,
        "-" => num1 - num2,
        "*" => num1 * num2,
        "/" => {
            if num2 == 0.0 {
                println!("Error: Division by zero");
                return;
            }
            num1 / num2
        }
        _ => {
            println!("Invalid operator!");
            return;
        }
    };

    println!("Result: {}", result);
}
