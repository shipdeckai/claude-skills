---
name: tasks
description: "Decompose PRDs into Ralph-ready tasks with dependencies. Use after creating a PRD with /prd to break it into context-window-sized tasks for autonomous execution. Triggers on: /tasks, decompose prd, break down prd, create tasks from prd, task breakdown, generate tasks. Creates task files in tasks/ directory ready for Ralph Loop."
---

# Task Decomposer

Break PRDs into context-window-sized tasks with dependencies, ready for Ralph Loop execution.

## The Job

1. Read the PRD file provided by the user
2. Analyze user stories and requirements
3. Break into "right-sized" tasks (one context window each)
4. Create dependency ordering
5. Generate task files ready for Ralph Loop

**Important:** Do NOT implement anything. Just create the task breakdown.

---

## Input

User provides path to PRD file:
```
/tasks tasks/prd-feature-name.md
```

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

## Example

See [references/example-tasks.md](references/example-tasks.md) for a complete task breakdown example.
