## Create a simple full stack interactive app

Create a new Vite app in an `exercise` folder by running `npm create vite@latest`.

- select `React` as the framework
- select `Typescript` as the variant

You are free to choose your own project name.

Build a simple ReactTS app that does the following:

- Has an input form field where a user can enter a list of comma separated Github user names (e.g. `UNSWComputing`, `Microsoft`, `Google`). Examples of one of these can be found [here](https://api.github.com/users/Microsoft).
- After 500 miliseconds from the last time this user input https://api.github.com/users/fires an `onChange` event, the list of comma separated user names is split, and for each one a `fetch` is made to collect data at the URL "https://api.github.com/users/[USERNAMEGOESHERE]".
- Once ALL of the fetches complete (and not before), you shall display a series of cards underneath on the page. Each card should be a separate ReactTS component that is imported into your `App.tsx`. Each component simply needs to consist of:
  - A 50px by 50px image that is the `avatar_url` property returned by the fetch
  - The `name` of the organisation (derived from the `name` property of the fetch), where clicking on this name links (in a new tab) to the `url` (derived from the `url` property of the fetch).

Note: You can implement the multiple fetches one of two ways:

- With a loop and async/await
- Using promises (preferable), where you can execute many promises at once using [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

In this exercise you are expected to use: `fetch`, `React.useEffect`, `React.useState`, ReactTS Functional Components.
