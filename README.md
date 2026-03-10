 Precision Scientific Calculator

A fully functional, responsive scientific calculator built with HTML5, CSS3, and JavaScript. This project focuses on accurate mathematical expression evaluation and a seamless user experience.

Key Features
- **Complex Expression Parsing:** Supports nested parentheses and multiple functions in a single calculation.
- **Three Angle Modes:** Toggle between Degrees (DEG), Radians (RAD), and Gradians (GRAD).
- **Advanced Math Functions:** Includes Trigonometric (Sin, Cos, Tan), Hyperbolic, Inverse, Logarithmic, and Factorial operations.
- **Smart Logic:** - Automatically handles implicit multiplication (e.g., typing `5π` becomes `5 * π`).
  - Automatically balances unclosed parentheses.
  - Floating-point correction to prevent precision errors (e.g., $sin(180)$ correctly equals $0$).

Technical Implementation
The core logic utilizes a **String-to-Math Evaluator**. Before evaluation, the input string undergoes a sanitization and transformation pipeline:

1. **Regex Processing:** Converts user-friendly symbols (like `^`, `√`, `π`) into JavaScript-compatible operators and `Math` constants.
2. **Angle Conversion:** Injects a dynamic conversion factor based on the selected mode ($DEG$, $RAD$, or $GRAD$) directly into trigonometric calls.
3. **Safety Lookbehinds:** Uses negative lookbehinds in Regular Expressions to distinguish between standard and inverse functions (e.g., ensuring `sin` replacements don't break `asin`).



Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/scientific-calculator.git](https://github.com/your-username/scientific-calculator.git)
