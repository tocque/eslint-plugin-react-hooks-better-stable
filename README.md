# `jcayabyab/eslint-plugin-react-hooks`

This ESLint plugin adds two additional options to the original `eslint-plugin-react-hooks`:
1. `knownStableValues`: If commonly-used variables are known to be stable (e.g., `dispatch` from Redux), you can specify them as RegEx.
2. `markStableValuesAsUnnecessary`: Stable values such as `set` functions returned from `React.setState` don't do anything when included in the dependency array, this allows you to enforce that they are not included in the dependency array.

See [motivation](./MOTIVATION.md) for more details.

## Installation

```sh
# npm
npm install @jcayabyab/eslint-plugin-react-hooks --save-dev

# yarn
yarn add @jcayabyab/eslint-plugin-react-hooks --dev
```

Then extend the recommended eslint config and turn off the original `eslint-plugin-react-hooks/exhaustive-deps` rule:

```js
{
  "extends": [
    // ...
    "plugin:@jcayabyab/react-hooks/recommended"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "off"
  }
}
```

## Changes

### knownStableValues

Here is an example of how to use the `knownStableValues` option:

```js
{
  "rules": {
    "@jcayabyab/react-hooks/exhaustive-deps": ["warn", {
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
  }, []); // The original rule would flag this as a warning with a missing dependency
}
```

```js
const mixpanelTrackNewFolder = useCallback(
  createMixPanelTrackingCallback('Folders.Create', {
    component: 'FolderModal',
    element: 'Button',
    action: 'Click',
  }),
  []
);
```

### markStableValuesAsUnnecessary

Here is an example of how to use the `markStableValuesAsUnnecessary` option:

```js
{
  "rules": {
    "@jcayabyab/react-hooks/exhaustive-deps": ["warn", {
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
    setFoo(prev => prev + 1);
  }, []);
}
```

Incorrect:

```js
function MyComponent() {
  const [foo, setFoo] = useState(0);

  useEffect(() => {
    setFoo(prev => prev + 1);
  }, [setFoo]); // "React Hook useEffect has an unnecessary dependency: 'setFoo'. Either exclude it or remove the dependency array."
}
```

Below is the original documentation.

# `eslint-plugin-react-hooks`

This ESLint plugin enforces the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).

It is a part of the [Hooks API](https://react.dev/reference/react/hooks) for React.

## Installation

**Note: If you're using Create React App, please use `react-scripts` >= 3 instead of adding it directly.**

Assuming you already have ESLint installed, run:

```sh
# npm
npm install eslint-plugin-react-hooks --save-dev

# yarn
yarn add eslint-plugin-react-hooks --dev
```

Then extend the recommended eslint config:

```js
{
  "extends": [
    // ...
    "plugin:react-hooks/recommended"
  ]
}
```

### Custom Configuration

If you want more fine-grained configuration, you can instead add a snippet like this to your ESLint configuration file:

```js
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```


## Advanced Configuration

`exhaustive-deps` can be configured to validate dependencies of custom Hooks with the `additionalHooks` option.
This option accepts a regex to match the names of custom Hooks that have dependencies.

```js
{
  "rules": {
    // ...
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useMyOtherCustomHook)"
    }]
  }
}
```

We suggest to use this option **very sparingly, if at all**. Generally saying, we recommend most custom Hooks to not use the dependencies argument, and instead provide a higher-level API that is more focused around a specific use case.

## Valid and Invalid Examples

Please refer to the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) documentation to learn more about this rule.

## License

MIT
