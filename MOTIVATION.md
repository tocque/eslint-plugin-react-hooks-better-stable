## Motivation

The original `exhaustive-deps` rule from the`eslint-plugin-react-hooks` plugin is unopinionated in terms of how it deals with **stable** values, i.e., values that are guaranteed to not change on a re-render (`set` functions from `useState`, `dispatch` from `useReducer`, etc.).

When a value is stable, `exhaustive-deps` doesn't care whether it is included in the dependency array or not. However, the issue arises when these stable values are passed through props or returned from custom hooks, where they are then flagged as missing dependencies.

```js
function useMapSettings() {
  const [zoom, setZoom] = useState(10);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  return { zoom, x, y, z, setZoom, setX, setY, setZ };
}

function MyComponent() {
  const { setZoom } = useMapSettings();

  useEffect(() => {
    setZoom(10);
  }, [setZoom]); // The original rule would flag this as a warning, even though mapSettings is stable!
}
```

While adding it to the dependency array is harmless (since stable values don't cause re-renders), it is unnecessary and can cause confusion:

```js
function MyComponent() {
  const { setZoom, setX, setY, setZ } = useMapSettings();

  const [valueWeWantToReactTo, setValueWeWantToReactTo] = useState('hello');

  useEffect(() => {
    setZoom(10);
    setX(1);
    setY(2);
    setZ(3);
  }, [setZoom, setX, setY, setZ, valueWeWantToReactTo]); // When does this effect change? It's not immediately obvious!
}
```

When using `knownStableValues`, you can specify commonly-used variables that are known to be stable (e.g., `dispatch` from Redux, or functions that start with `set`).

```js
{
  "rules": {
    "react-hooks-exhaustive-deps-better-stable/exhaustive-deps": ["warn", {
      "knownStableValues": "^(set.*)$"
    }]
  }
}
```

Now, the following code will not be flagged as a missing dependency:

```js
function MyComponent() {
  const { setZoom, setX, setY, setZ } = useMapSettings();

  const [valueWeWantToReactTo, setValueWeWantToReactTo] = useState('hello');

  useEffect(() => {
    setZoom(10);
    setX(1);
    setY(2);
    setZ(3);
  }, [valueWeWantToReactTo]); // No warning!
}
```

This `useEffect` hook is now clear in its intent: it will only re-run when `valueWeWantToReactTo` changes.

Furthermore, the `markStableValuesAsUnnecessary` option allows you to mark stable values as unnecessary, which can enforce the omission of unnecessary stable values from the dependency array:

```js
{
  "rules": {
    "react-hooks-exhaustive-deps-better-stable/exhaustive-deps": ["warn", {
      "knownStableValues": "^(set.*)$",
      "markStableValuesAsUnnecessary": true
    }]
  }
}
```

Now, including stable values in the dependency array will raise a warning:

```js
function MyComponent() {
  const [foo, setFoo] = useState(0);

  useEffect(() => {
    setFoo((prev) => prev + 1);
  }, [setFoo]); // "React Hook useEffect has an unnecessary dependency: 'setFoo'. Either exclude it or remove the dependency array."
}
```

This enforces dependency intent and cleanliness, making it easier to understand when hooks re-render.

The `checkReactiveFunctionOutputIsStable` option allows you to specify a function that checks if the output of a reactive function is stable. This allows for more implicit stability of variables with simple `useCallback` and `useMemo` calls.
