# `eslint-plugin-react-hooks-better-stable`

This ESLint plugin adds two additional options to the original `eslint-plugin-react-hooks`:

1. `knownStableValues`: If commonly-used variables are known to be stable (e.g., `dispatch` from Redux), you can specify them as RegEx.
2. `markStableValuesAsUnnecessary`: Stable values such as `set` functions returned from `React.setState` don't do anything when included in the dependency array, this allows you to enforce that they are not included in the dependency array.

See [motivation](./MOTIVATION.md) for insight.

See [rules/exhaustive-deps.md](./docs/rules/exhaustive-deps.md) for more details around the extra options.

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
