# SiteSage

A small website generator with the original React interface. Generate a site, preview desktop/tablet/mobile layouts, inspect its HTML and CSS, and download a standalone HTML file.

## Run

Use Node.js 22 or newer:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5000. These commands work in Windows PowerShell and Linux shells. Without an OpenAI key, the app creates a built-in template and says so. To enable AI, set OPENAI_API_KEY in your shell before starting. Never place the key in frontend code.

```sh
npm test
npm run check
npm run build
npm start
```

## Saved work

Generated sites are saved in instance/websites.json. Restarting the server keeps them. The browser remembers the last site's ID and restores it on refresh. A signed HttpOnly cookie identifies your workspace; another browser cannot retrieve its sites. Clearing cookies loses access to that workspace. This is a browser workspace, not a user account or password recovery system.

Back up the whole instance directory, including its session signing key. DATA_FILE overrides the JSON path. SESSION_SECRET can supply a persistent signing key instead. Run only one server process against the file. This simple storage is intended for a personal project, not multiple server replicas.

## Deployment

The default address is 127.0.0.1. Set HOST=0.0.0.0 and PORT for a host that needs an external listener. Production requires HTTPS because the workspace cookie is Secure. Use persistent storage for instance/ and keep the signing key stable across deployments. Ten generation attempts per IP per hour limit accidental API spending; a shared commercial service needs account quotas and shared storage.

Previews disable scripts and form submissions. Downloaded sites are static starter files: review generated code and connect any contact form before publishing. AI output is not guaranteed to be correct. The app does not collect subscription payments or provide user accounts.

## Code map

- client/src/components/website-generator.tsx: form and generation request.
- client/src/components/website-preview.tsx: preview, code view and download.
- server/routes.ts: validation, generation, preview and retrieval routes.
- server/storage.ts: atomic file persistence.
- server/session.ts: signed workspace cookie.
- server/services/openai.ts: AI generation and template fallback.
- tests/generation.test.ts: real HTTP and persistence checks without paid API calls.
