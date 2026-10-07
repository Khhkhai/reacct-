## Review a ReactJS app and find out what is wrong with it

Take a look at the ReactJS app in `review/`.

What would you do to improve this source code? Discuss as a class.

- What is wrong with the style of the source code for this page?
- Make appropriate changes to clean up these DOM elements.

## Answers

- Unnecessary repetition of null - can use `Array.from`
- Use of both `function() {}` syntax and `() => {}` syntax
- Use of `if else` branch where `switch` would work.
  - Good exercise in reading documentation for recommended idioms
  - e.g. handling arrow keys - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
- Rendering in return does not make use of conditional rendering
