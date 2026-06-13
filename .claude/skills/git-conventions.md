---
name: git-conventions
description: >
  Apply this skill whenever Claude is about to run `git commit`, `git checkout -b`, or any command
  that creates a git branch or writes a commit message. This includes staging changes and committing,
  amending commits, or setting up a new feature/fix/chore branch. Triggers on any task that involves
  committing code to git or naming a new branch — even if the user just says "commit this" or
  "make a branch for this change". Do NOT skip this skill when performing git operations.
---

# Git Conventions Skill

Use this skill every time you write a git commit message or create a branch name.

---

## Commit Messages

### Format

```
<type>(<scope>): <short imperative summary>

[optional body: what changed and why, if non-obvious]
```

### Rules

- **Be concise**: the subject line must be ≤72 characters
- **Use imperative mood**: "add", "fix", "remove" — not "added", "fixes", "removing"
- **Name what was affected**: always name the feature(s), module(s), or component(s) impacted
- **No vague messages**: never use "update files", "misc changes", "WIP", "fix stuff"
- **Type prefix** (pick one):
  - `feat` — new feature or capability
  - `fix` — bug fix
  - `refactor` — code restructuring without behavior change
  - `chore` — tooling, deps, config, build
  - `test` — adding or updating tests
  - `docs` — documentation only
  - `style` — formatting, linting (no logic change)
  - `perf` — performance improvement

### Scope

The scope is the module, page, service, or layer affected — e.g. `auth`, `dashboard`, `api`, `cart`, `db`, `notifications`. Use whatever matches the project's structure. Omit scope only if the change is truly cross-cutting.

### Examples

```
feat(auth): add OAuth2 login flow with Google provider

fix(cart): prevent duplicate items when re-adding to cart

refactor(api): extract rate-limiter into standalone middleware

chore(deps): upgrade React to v19 and update peer deps

test(notifications): add unit tests for email queue retry logic

perf(dashboard): lazy-load analytics charts to reduce initial bundle
```

---

## Branch Names

### Format

```
claude-<type>/<short-slug>
```

### Rules

- **Always prefixed with `claude-`** — every branch created by Claude must start with `claude-`
- **Max 5 words** in the slug (after the type prefix)
- Use **kebab-case** (lowercase, hyphens only — no underscores, no slashes beyond the type separator)
- The slug must summarize **what changes** the branch introduces
- No ticket numbers unless the user explicitly asks for them
- Type prefix mirrors commit types: `feat/`, `fix/`, `refactor/`, `chore/`, `test/`, `docs/`

### Examples

```
claude-feat/google-oauth-login
claude-fix/cart-duplicate-items
claude-refactor/api-rate-limiter
claude-chore/upgrade-react-v19
claude-test/notification-queue-retries
claude-docs/api-auth-endpoints
```

---

## Workflow

1. **Inspect the diff or task description** to understand which features/modules are touched.
2. **Pick the right type** based on the nature of the change.
3. **Identify the scope** — the most specific module or layer affected.
4. **Write the subject line** — imperative, ≤72 chars, names what changed.
5. **Add a body only if needed** — when the "why" or context isn't obvious from the subject.
6. For branches: prepend `claude-`, then the type prefix, then compress to ≤5 words in the slug.

When in doubt, be more specific rather than less. A commit message like `fix(checkout): resolve null pointer on empty address field` is always better than `fix: bug fix`.
