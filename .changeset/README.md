# Changesets

Create a changeset for user-facing changes:

```bash
pnpm changeset
```

Update package versions and `CHANGELOG.md` from pending changesets:

```bash
pnpm changeset:version
```

Publish the current version to npm with the `next` dist-tag:

```bash
pnpm release
```

For release candidates, enter prerelease mode before collecting changesets:

```bash
pnpm changeset pre enter rc
```
