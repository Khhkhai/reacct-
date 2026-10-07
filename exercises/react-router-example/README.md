## Learn how to use React Router V6 with some examples

`react-router` is a popular library used with React that enables you to navigate to different pages within your application.
There are a couple of core components you will use anytime you're using `react-router`:

- `<Router>` - a component that tells `react-router` how to style URL paths. Usually you will need to use `<BrowserRouter>` and wrap it around your top level component.
- `<Routes>` - a container that holds all your `<Route>` components.
  It will conditionally render a component based on the URL's path.
  You would usually have this in the `App.js` (or equivalent) file.  
  All child components to the `<Routes>` component must be a `<Route>` component.
- `<Route>` - a path to a certain location.
  It renders when the URL is equal to the path specified.
- `<Link>` - a link that you can define in any component.
  It will change the URL to the path you have specified.

More information on these core components are outlined in a [documentation article](https://reactrouter.com/home).

Let's look at this example `<Routes>` component:

```js
<Routes>
  <Route path="/about" element={<About />} />
  <Route path="/topics" element={<Topics />} />
  <Route path="/" element={<Home />} />
</Routes>
```

When the URL path is `/about`, we will render the `<About />` component.
Similarly, we will render the `<Topics />` and `<Home />` component when the URL path is `/topics` and `/` respectively.
Now look at this example component which includes `<Link>`s:

```js
<ul>
  <li>
    <Link to="/">Home</Link>
  </li>
  <li>
    <Link to="/about">About</Link>
  </li>
  <li>
    <Link to="/topics">Topics</Link>
  </li>
</ul>
```

This will render a bullet point list with hyperlinks (`<a>` tags) at `Home`, `About` and `Topics`.
When `About` is clicked, the path will change to `/about` and the `<About />` component is rendered (based on the `<Routes />` above).

`react-router` also provides some useful hooks. A few notable ones include:

- `useLocation` - gets the URL of the current page.
- `useParams` - gets the URL parameters defined in a `<Route>` component.
- `useNavigate` - navigate to another route in your app using JavaScript rather than a `<Link>` component.

For more information on `react-router`, visit [their documentation website](https://reactrouter.com/tutorials/quickstart).

Let's put this knowledge to use! Create a folder called `exercise4` with `npm create vite@latest`. Also install `react-router` by calling `yarn add react-router-dom`.
Now, build a React + React Router app that:

1. Has two pages: one at the `"/"` route and another at `"/post/:id"` route. Note that `id` is a URL parameter, assumed to be an integer between 0 to 100.
2. On the `"/post/:id"` page, display the `:id` of the post. (Hint: use the `useParam` hook).
3. On the `"/"` page, display a `<Link>` to `/post/:id`, where `:id` is a randomly generated number. To generate a random integer between 0 and 100, feel free to use this function:

```js
const generateRndInt = () => {
  return Math.floor(Math.random() * (100 - 1) + 1);
};
```

## Project Initialisation

Create a new Vite app in an `exercise` folder by running `npm create vite@latest`.

- select `React` as the framework
- select `Typescript` as the variant

You are free to choose your own project name.

Read the documentation for `react-router` to find the necessary `npm` commands to add it as a dependency.

You are free to add any external modules on the NPM repository to generate random next if you wish.
