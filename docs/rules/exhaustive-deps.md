# exhaustive-deps

An extension of the original `eslint-plugin-react-hooks`'s `exhaustive-deps` rule, found [here](https://github.com/facebook/react/blob/master/packages/eslint-plugin-react-hooks).

## Added Options

### knownStableValues

This option allows to specify Regex patterns for variable naming systems to specify specific variables to be considered stable.

Here is an example of how to use the `knownStableValues` option:

```js
{
  "rules": {
    "react-hooks-exhaustive-deps-better-stable/exhaustive-deps": ["warn", {
      "knownStableValues": "^(dispatch|createMixPanelTrackingCallback)$"
    }]
  }
}
```

Correct:

```js
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '../index';

const useAppDispatch = useDispatch.withTypes<AppDispatch>();

function MyComponent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(someAction());
  }, []); // The original `exhaustive-deps` rule would flag this as a warning with a missing dependency
}
```

```js
const mixpanelTrackNewFolder = useCallback(
  createMixPanelTrackingCallback('Folders.Create', {
    component: 'FolderModal',
    element: 'Button',
    action: 'Click',
  }),
  [],
);
```

### markStableValuesAsUnnecessary

This option enforces that stable values are not included in the dependency array.

Here is an example of how to use the `markStableValuesAsUnnecessary` option:

```js
{
  "rules": {
    "react-hooks-exhaustive-deps-better-stable/exhaustive-deps": ["warn", {
      "markStableValuesAsUnnecessary": true
    }]
  }
}
```

Correct:

```js
function MyComponent() {
  const [foo, setFoo] = useState(0);

  useEffect(() => {
    setFoo((prev) => prev + 1);
  }, []); // foo is stable from useState, so it's unnecessary to include it in the dependency array
}
```

Incorrect:

```js
function MyComponent() {
  const [foo, setFoo] = useState(0);

  useEffect(() => {
    setFoo((prev) => prev + 1);
  }, [setFoo]); // "React Hook useEffect has an unnecessary dependency: 'setFoo'. Either exclude it or remove the dependency array."
}
```

### checkReactiveFunctionOutputIsStable

This is adapted from the [@wogns3623/eslint-plugin-better-exhaustive-deps](https://github.com/wogns3623/eslint-plugin-better-exhaustive-deps/tree/master#checkmemoizedvariableisstatic) plugin. It checks if variables memoized by `useCallback` or `useMemo` are stable, i.e., do not change between renders.

NOTE: This may cause slower linting performance due to its recursive nature.

Here is an example of how to use the `checkReactiveFunctionOutputIsStable` option:

```js
{
  "rules": {
    "react-hooks-exhaustive-deps-better-stable/exhaustive-deps": ["warn", {
      "checkReactiveFunctionOutputIsStable": true
    }]
  }
}
```

Correct:

```js
function MyComponent() {
  const [foo, setFoo] = useState(0);

  const handleClick = useCallback(() => {
    setFoo((prev) => prev + 1);
  }, []);

  useEffect(() => {
    handleClick();
  }, []); // The original `exhaustive-deps` rule would flag this as a warning with a missing dependency
}
```

Incorrect:

```js
function MyComponent() {
  const [foo, setFoo] = useState(0);

  const handleClick = useCallback(() => {
    console.log('foo', foo);
  }, [foo]);

  const handleClick = useCallback(() => {
    handleClick();
  }, []); // "React Hook useEffect has a missing dependency: 'foo'. Either include it or remove the dependency array."
}
```

### stableHooks

This option allows to specify a list of Hooks that are known to be stable and their respective dependencies.

Here is an example of how to use the `stableHooks` option:

```js
{
  "rules": {
    "react-hooks-exhaustive-deps-better-stable/exhaustive-deps": ["warn", {
      "stableHooks": {
        "useCustomArray": [true, false]
				"useCustomHook": true,
				"useCustomObject": { foo: true, bar: false}
      }
    }]
  }
}
```

Correct:

```js
function MyComponent() {
  const [stable, notStable] = useCustomArray();

  useEffect(() => {
    console.log(stable, notStable);
  }, [notStable]);
}
```

```js
function MyComponent() {
  const stable = useCustomHook();

  useEffect(() => {
    console.log(stable);
  }, []);
}
```

```js
function MyComponent() {
  const { foo, bar } = useCustomObject();

  useEffect(() => {
    console.log(foo, bar);
  }, [bar]);
}
```
