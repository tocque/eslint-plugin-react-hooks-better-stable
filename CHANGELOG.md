## 1.0.0

- Initial release: added two new options:
  1. knownStableValues: If commonly-used variables are known to be stable (e.g., `dispatch` from Redux), you can specify them as RegEx
  2. markStableValuesAsUnnecessary: Stable values such as `set` functions returned from `React.setState` don't do anything when included in the dependency array, this allows you to explicitly exclude them 

Forked from v5.0.0 of the original `eslint-plugin-react-hooks` React package.
