---
name: decompose
description: "Decompose PRDs into Ralph-ready tasks with dependencies. Use after creating a PRD with /prd to break it into context-window-sized tasks for autonomous execution. Triggers on: /decompose, decompose prd, break down prd, create tasks from prd, task breakdown, generate tasks. Creates task files in tasks/ directory ready for Ralph Loop. Supports --github-issues and --github-project flags."
---

# Task Decomposer

Break PRDs into context-window-sized tasks with dependencies, ready for Ralph Loop execution.

## The Job

1. Read the PRD file provided by the user
2. Analyze user stories and requirements
3. Break into "right-sized" tasks (one context window each)
4. Create dependency ordering
5. Generate task files ready for Ralph Loop
6. **Optionally:** Create GitHub Issues and/or Project items

**Important:** Do NOT implement anything. Just create the task breakdown.

---

## Input

User provides path to PRD file with optional flags:
```
/decompose tasks/prd-feature-name.md
/decompose tasks/prd-feature-name.md --github-issues
/decompose tasks/prd-feature-name.md --github-project "Project Name"
/decompose tasks/prd-feature-name.md --github-issues --github-project "Project Name"
```

**Flags:**
| Flag | Effect |
|------|--------|
| (none) | Creates task files only (default) |
| `--github-issues` | Also creates GitHub Issues with dependency links |
| `--github-project "Name"` | Also adds issues to specified GitHub Project |

If no file provided, ask:
```
Which PRD should I decompose?
- Provide a file path (e.g., tasks/prd-my-feature.md)
- Or describe the feature and I'll look for matching PRDs
```

---

## Step 1: Analyze the PRD

Read the PRD and identify:
- All user stories (US-001, US-002, etc.)
- Functional requirements (FR-1, FR-2, etc.)
- Technical considerations
- Files to be modified
- Verification commands

---

## Step 2: Task Sizing

**Each task must be completable in ONE Ralph iteration (~one context window).**

Ralph spawns a fresh Claude instance per iteration with no memory of previous work. If a task is too big, Claude runs out of context before finishing.

### Right-sized tasks:
- Add a database column + migration
- Create a single UI component
- Implement one server action
- Add a filter to an existing list
- Write tests for one module

### Too big (split these):
- "Build the entire dashboard" → Split into: schema, queries, components, filters
- "Add authentication" → Split into: schema, middleware, login UI, session handling
- "Refactor the API" → Split into one task per endpoint

**Rule of thumb:** If you can't describe the change in 2-3 sentences, it's too big.

---

## Step 3: Dependency Ordering

Tasks execute based on dependencies. Earlier tasks must complete before dependent ones start.

**Typical order:**
1. Schema/database changes (migrations) - no dependencies
2. Server actions / backend logic - depend on schema
3. UI components that use the backend - depend on backend
4. Integration / E2E tests - depend on components

**Express dependencies clearly:**
```
Task 1: Schema (no dependencies)
Task 2: Server action (depends on: Task 1)
Task 3: UI component (depends on: Task 2)
Task 4: Tests (depends on: Task 3)
```

Parallel tasks that don't depend on each other can share the same dependency.

---

## Step 4: Create Task Files

Create a directory for the feature's tasks:
```
tasks/[feature-name]/
├── 00-overview.md        # Task list overview with dependencies
├── 01-[task-name].md     # First task
├── 02-[task-name].md     # Second task
├── 03-[task-name].md     # Third task
└── ...
```

### Overview File Format (00-overview.md)

```markdown
# [Feature Name] - Task Breakdown

**Source PRD:** tasks/prd-[feature-name].md
**Total Tasks:** [N]
**Estimated Ralph Iterations:** [N × 1-3]

## Task Dependency Graph

```
01-schema (no deps)
    ↓
02-server-action (depends: 01)
    ↓
03-ui-component (depends: 02)
    ↓
04-tests (depends: 03)
```

## Task List

| # | Task | Depends On | Status |
|---|------|------------|--------|
| 01 | [Task name] | - | pending |
| 02 | [Task name] | 01 | pending |
| 03 | [Task name] | 02 | pending |
| 04 | [Task name] | 03 | pending |

## Execution

Run tasks sequentially with Ralph Loop:
```bash
/ralph-loop "Execute task from tasks/[feature]/01-*.md" --max-iterations 15 --completion-promise "TASK_01_COMPLETE"
```
```

### Individual Task File Format

```markdown
# Task [##]: [Task Title]

**Depends on:** [Task ## or "none"]
**Estimated iterations:** 1-3

## Objective

[One sentence: What this task accomplishes]

## Context

[2-3 sentences: Why this matters, what came before, relevant patterns to follow]

## Requirements

From PRD:
- US-[###]: [User story reference]
- FR-[#]: [Functional requirement reference]

Implementation:
- [ ] [Specific deliverable 1]
- [ ] [Specific deliverable 2]
- [ ] [Specific deliverable 3]

## Files to Modify

- `path/to/file1.ts` - [what to change]
- `path/to/file2.ts` - [what to change]
- `path/to/new-file.ts` - [create new]

## Acceptance Criteria

- [ ] [Verifiable outcome 1]
- [ ] [Verifiable outcome 2]
- [ ] Type check passes: `npm run typecheck`
- [ ] Tests pass: `npm test [path]` (if applicable)

## Notes

- [Pattern to follow from existing code]
- [Edge case to handle]
- [Reference to similar implementation]

## Completion

When all requirements are met and verification passes, output:
<promise>TASK_[##]_COMPLETE</promise>
```

---

## Step 5: Output Summary

After creating all task files, show:

```
Task breakdown complete!

Created: tasks/[feature-name]/
├── 00-overview.md
├── 01-[task].md
├── 02-[task].md
├── 03-[task].md
└── 04-[task].md

Dependency order:
1. 01-[task] (no deps)
2. 02-[task] (depends: 01)
3. 03-[task] (depends: 02)
4. 04-[task] (depends: 03)

To execute with Ralph Loop:
/ralph-loop "Execute task from tasks/[feature]/01-*.md" --max-iterations 15 --completion-promise "TASK_01_COMPLETE"

Or run all sequentially - see tasks/[feature]/00-overview.md
```

---

## Task Description Quality

Write descriptions that a future Ralph iteration can pick up without context:

**Good description:**
```
Implement category name to ID mapping for expenses.

**What to do:**
- Create function mapExpenseCategoryNameToId(name, isChildExpense)
- Query item_category table with category_type filter
- Add alias mapping for common synonyms (rent → Rent or Mortgage)

**Files:**
- workflows/tools/upsert-expense.ts

**Acceptance criteria:**
- Function returns category ID for valid names
- Returns null for unknown categories
- npm run typecheck passes

**Notes:**
- Follow pattern from upsert-income.ts
- EXPENSE type for family, CHILD_EXPENSE for child
```

**Bad description:**
```
Add the category mapping feature.
```

---

## Acceptance Criteria Rules

**Every task requires verifiable criteria:**

Good (testable):
- "Add `investorType` column with default 'cold'"
- "Filter dropdown shows: All, Cold, Friend"
- "npm run typecheck passes"

Bad (vague):
- "Works correctly"
- "Good UX"
- "Handles edge cases"

**Mandatory for all tasks:**
- `npm run typecheck passes` (or equivalent type check)

**For UI tasks:**
- Include browser verification step

**For logic tasks:**
- Include test command if tests exist

---

## GitHub Issues Integration (--github-issues)

When the `--github-issues` flag is provided, create GitHub Issues for each task AFTER creating the task files.

### Step 6a: Create Parent Issue

First, create a parent/tracking issue for the entire feature:

```bash
gh issue create \
  --title "[Feature] Feature Name" \
  --body "## Overview
Tracking issue for [Feature Name] implementation.

**Source PRD:** tasks/prd-feature-name.md
**Task Directory:** tasks/feature-name/

## Tasks
- [ ] #XX Task 01: Schema
- [ ] #XX Task 02: Backend
- [ ] #XX Task 03: Frontend
- [ ] #XX Task 04: Tests

## Progress
Updated automatically as tasks complete." \
  --label "feature,tracking"
```

### Step 6b: Create Task Issues with Dependencies

For each task, create an issue that references:
1. The task file location
2. Blocking issues (dependencies)
3. The parent tracking issue

```bash
# Task 01 (no dependencies)
gh issue create \
  --title "[Feature] 01: Schema - Add user tables" \
  --body "## Task File
\`tasks/feature-name/01-schema.md\`

## Objective
[One sentence from task file]

## Dependencies
None - this task can start immediately.

## Acceptance Criteria
- [ ] Migration created and runs successfully
- [ ] Type check passes

## Completion
When done, close this issue and update the tracking issue.

---
*Part of #PARENT_ISSUE*" \
  --label "feature,task"
```

```bash
# Task 02 (depends on Task 01)
gh issue create \
  --title "[Feature] 02: Backend - Server actions" \
  --body "## Task File
\`tasks/feature-name/02-backend.md\`

## Objective
[One sentence from task file]

## Dependencies
> **Blocked by:** #TASK_01_ISSUE
>
> This task requires Task 01 (Schema) to be complete first.

## Acceptance Criteria
- [ ] Server actions implemented
- [ ] Type check passes

## Completion
When done, close this issue and update the tracking issue.

---
*Part of #PARENT_ISSUE*" \
  --label "feature,task"
```

### Dependency Expression in Issues

GitHub doesn't have native dependency tracking, so express dependencies clearly:

**In the issue body:**
```markdown
## Dependencies
> **Blocked by:** #12, #13
>
> This task requires the following to complete first:
> - #12 - Database schema
> - #13 - API types
```

**In the parent issue (task list):**
```markdown
## Tasks (in dependency order)
- [ ] #10 Schema (no deps)
- [ ] #11 Backend (blocked by #10)
- [ ] #12 Frontend (blocked by #11)
- [ ] #13 Tests (blocked by #12)
```

### Output with GitHub Issues

```
Task breakdown complete!

Created files:
  tasks/feature-name/00-overview.md
  tasks/feature-name/01-schema.md
  tasks/feature-name/02-backend.md
  tasks/feature-name/03-frontend.md
  tasks/feature-name/04-tests.md

Created GitHub Issues:
  #100 [Feature] Feature Name (tracking)
  #101 [Feature] 01: Schema
  #102 [Feature] 02: Backend (blocked by #101)
  #103 [Feature] 03: Frontend (blocked by #102)
  #104 [Feature] 04: Tests (blocked by #103)

Dependency order preserved in issue descriptions.
```

---

## GitHub Projects Integration (--github-project)

When `--github-project "Project Name"` is provided, add all created issues to the specified GitHub Project.

**Requires:** `--github-issues` flag (issues must exist to add to project)

### Step 7: Add Issues to Project

After creating issues, add them to the project:

```bash
# Get project ID
PROJECT_ID=$(gh project list --owner @me --format json | jq -r '.projects[] | select(.title=="Project Name") | .number')

# Add each issue to the project
gh project item-add $PROJECT_ID --owner @me --url https://github.com/OWNER/REPO/issues/101
gh project item-add $PROJECT_ID --owner @me --url https://github.com/OWNER/REPO/issues/102
gh project item-add $PROJECT_ID --owner @me --url https://github.com/OWNER/REPO/issues/103
gh project item-add $PROJECT_ID --owner @me --url https://github.com/OWNER/REPO/issues/104
```

### Setting Up Project Fields for Dependencies

If the project has custom fields, set them:

```bash
# If project has a "Status" field
gh project item-edit --project-id $PROJECT_ID --id $ITEM_ID --field-id $STATUS_FIELD_ID --single-select-option-id $TODO_OPTION_ID

# If project has a "Blocked By" text field (for dependency tracking)
gh project item-edit --project-id $PROJECT_ID --id $ITEM_ID --field-id $BLOCKED_FIELD_ID --text "#101"
```

### Recommended Project Setup

For best dependency tracking, create a project with these fields:

| Field | Type | Purpose |
|-------|------|---------|
| Status | Single select | Todo, In Progress, Done |
| Task Number | Number | 01, 02, 03... for ordering |
| Blocked By | Text | Issue numbers this depends on |
| Feature | Single select | Group tasks by feature |

### Output with GitHub Project

```
Task breakdown complete!

Created files:
  tasks/feature-name/*.md (5 files)

Created GitHub Issues:
  #101-#104 (4 task issues + 1 tracking issue)

Added to GitHub Project "My Project":
  ✓ #100 [Feature] Feature Name
  ✓ #101 [Feature] 01: Schema
  ✓ #102 [Feature] 02: Backend
  ✓ #103 [Feature] 03: Frontend
  ✓ #104 [Feature] 04: Tests

View project: https://github.com/users/USERNAME/projects/PROJECT_NUMBER
```

---

## Example

See [references/example-tasks.md](references/example-tasks.md) for a complete task breakdown example.
