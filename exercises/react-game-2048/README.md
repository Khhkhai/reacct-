# Get familiar using ReactTS by building a 2048 game

You must complete the page based on the specification below. You are required to build this game as a ReactTS app.

## Project Initialisation

Create a new Vite app in an `exercise` folder by running `npm create vite@latest`.

- select `React` as the framework
- select `Typescript` as the variant

You are free to choose your own project name.

## Static

Once the project has been made, inside of `App.tsx` make a start on the static page.

1. Add any CSS. As you are getting familiar with React, it's okay for now to use `.css` files, but in the assignment, it's much better to use CSS modules, styling frameworks like Tailwind CSS, or pre-styled libraries like MaterialUI.
2. Add any HTML as simple TSX \(TypeScript React\).

## Dynamic State Updates

Once you've got the page OK statically, you can then use the `useState` hook discussed in lectures, in conjunction with the `onKeyPress` \(do some Googling, (e.g. here)[https://stackoverflow.com/questions/27827234/how-to-handle-the-onkeypress-event-in-reactjs]\) attribute in React that you can bind to the table, to create the intended functionality.

There is no requirement to use components, props, or conditional rendering in this exercise. It may help some students, but it can be completed fine without.

See `Instructions for Exercise 1 (Vanilla) and Exercise 2 (ReactTS)` for instructions on what to implement.

## Instructions for Exercise 1 (Vanilla) and Exercise 2 (ReactTS)

The stub code is provided to you in the exercise02 folder.

```html
<table border="1">
  <tr>
    <td>2</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>
```

![](overview.png)

The game always begins with a single `2` in the top left, and all other cells empty.

You must add key listener events to the board such that when:

- The "down" key is pressed, all the cells slide down as far as they can to the bottom
- The "right" key is pressed, all the cells slide right as far as they can to the right
- The "left" key is pressed, all the cells slide left as far as they can to the left
- The "up" key is pressed, all the cells slide up as far as they can to the up

After a slide occurs, a cell containing either `2` or `4` (randomly chosen) should appear in one of the empty cells on the board (randomly chosen).

The following function can be used to generate a random number:

```javascript
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.ceil(max));
};
```

The following features are considered challenge exercises as part of this exercise, and are **NOT required to be completed**:

- The finish state, when 2048 is reached.
- The fail state, when the board is full and no more moves can be made.
- The merging of cells when two adjacent cells slide together as part of a slide.

If you're unsure about any intended behaviour, whether it be the features you include or not, you can see the behaviour in the (2048 Game)[https://play2048.co/].

### Hints

- The easiest and simplest way to solve this problem is just to store a 4 x 4 array for either exercise 1 or exercise 2,

#### Bonus

Now try and refactor your code to break some parts into separate components so it's not already in one file. Please note: The current solution does not do this.
