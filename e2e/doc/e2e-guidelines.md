# Guidelines to write e2e-tests

- Use Page Objects.
- Commands in Page Objects generally should wait for required elements to be
  available, so we dont need to `waitFor*` prior to calling them.
- Commands in Page Objects generally should not wait for result of their
  exectution, because often the result of the command is dependent on the
  context. But if it isn't dependent, then it is fine to wait for result.
- `waitFor*` commands should accept `timeout` and `reverse` to be similar to
  built-in `waitFor*` commands.
