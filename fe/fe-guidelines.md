# Guidelines to write front-end

- Whatever that has global affection should go to `plugins` directory. Simply importing a pluging should register it and makes it be ready to use.
- You should use module state for managing state in singleton modules like `services` for simplicity (without extra class declaration and management).
- `services` are meant to be used by client code. Those are safe to use and user-friendly functions.
- `plugins` are basically `services` but with initialization code affecting the app globally (like registering Vue plugins).
- When using export, you should export each function individually on its declaration
- On any getter-like exported function should be specified if it is reactive or not.
- You should never call store mutations in the vue components. Only change state via `services`.
