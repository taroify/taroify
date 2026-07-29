# Taroify Documentation

The documentation site is built with Rspress 2 and a custom theme.

```bash
pnpm --dir .. run install:node_modules
pnpm site:develop
```

The component and Hook pages are generated from package `README.md` files before
the dev server or production build starts.

```bash
pnpm site:build
pnpm site:preview
```

The production site uses `/taroify.com/` as its base path. Override it with
`TAROIFY_SITE_BASE` when deploying elsewhere.
