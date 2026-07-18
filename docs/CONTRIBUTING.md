# BlockBazaar - Contributing Guidelines

## Git Workflow

### Branch Naming

```
feature/<short-description>    — new features
fix/<short-description>        — bug fixes
docs/<short-description>       — documentation only
```

Examples:
```
feature/auth-controller
feature/marketplace-ui
fix/transfer-negative-balance
docs/update-readme
```

### Daily Workflow

```bash
# 1. Start your day — sync with main
git checkout main
git pull origin main

# 2. Create or switch to your feature branch
git checkout feature/your-feature

# 3. Work on your task, commit often
git add .
git commit -m "feat: implement JWT auth filter"

# 4. Before pushing, rebase on main
git fetch origin
git rebase origin/main

# 5. Push your branch
git push origin feature/your-feature

# 6. When ready, create a PR (or notify team for review)
```

### Commit Message Convention

Use this format:
```
<type>: <short description>
```

Types:
| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation change |
| `style` | Formatting, no logic change |
| `refactor` | Code restructuring, no behavior change |
| `test` | Adding or updating tests |
| `chore` | Build, config, dependency changes |

Examples:
```
feat: add transfer endpoint with balance validation
fix: prevent self-transfer
docs: add API reference for marketplace endpoints
test: add SHA-256 hashing unit test
```

---

## Code Standards

### Backend (Java)

- Follow standard Java naming conventions (camelCase for methods/variables, PascalCase for classes)
- One class per file
- Use Lombok `@Data`, `@Builder` where appropriate to reduce boilerplate
- All service methods should be `public` and well-named
- Use `@Transactional` on methods that modify multiple tables (transfers, purchases)
- Handle errors with meaningful messages, not stack traces

### Frontend (React)

- One component per file
- Use functional components with hooks (no class components)
- Use `.jsx` extension for React components
- Use `async/await` for API calls
- Handle loading and error states in the UI
- Keep components under 200 lines — split if larger

---

## Pull Request Rules

1. **At least one review** before merging to `main`
2. PR description should explain **what** and **why**
3. Don't merge your own PR unless urgent and team is offline
4. Delete your feature branch after merge
5. Keep PRs small and focused — one feature/fix per PR

---

## Daily Communication

- **Standup:** Share what you completed and what you're working on
- **Blockers:** Post immediately in the group chat
- **API changes:** Announce before making them — frontend depends on contracts
- **Database changes:** Coordinate with Gyle before modifying schema
