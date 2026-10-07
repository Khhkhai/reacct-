## Review some messy ReactTS code and discuss how can be improved

Take a look at the ReactTS app in `review/`. It is the ReactTS component from lab04.

What would you do to improve this source code? Discuss as a class.

- What is wrong with the style of the source code for this page?
- Make appropriate changes to clean up these DOM elements.

> - Inline CSS in Card.tsx
> - App.tsx has a redundant wrapper `<div>` around the input; prefer the Fragment or <></> element
> - Card.tsx imports "React"; outdated practice from React 17 and onwards
> - Unused imports have been removed: run `npm run typecheck` in `review` for comparison
