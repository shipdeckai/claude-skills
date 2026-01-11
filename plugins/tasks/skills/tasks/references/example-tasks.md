# Example Task Breakdown: Task Priority System

Based on PRD: `tasks/prd-task-priority.md`

---

## 00-overview.md

```markdown
# Task Priority System - Task Breakdown

**Source PRD:** tasks/prd-task-priority.md
**Total Tasks:** 4
**Estimated Ralph Iterations:** 4-12

## Task Dependency Graph

```
01-database-schema (no deps)
    ↓
02-priority-badge (depends: 01)
    ↓
03-task-edit-modal (depends: 02)
    ↓
04-priority-filter (depends: 03)
```

## Task List

| # | Task | Depends On | Status |
|---|------|------------|--------|
| 01 | Database schema migration | - | pending |
| 02 | Priority badge component | 01 | pending |
| 03 | Task edit modal update | 02 | pending |
| 04 | Priority filter component | 03 | pending |

## Execution

Run tasks sequentially with Ralph Loop:

```bash
# Task 1
/ralph-loop "Execute task from tasks/task-priority/01-database-schema.md" --max-iterations 10 --completion-promise "TASK_01_COMPLETE"

# Task 2
/ralph-loop "Execute task from tasks/task-priority/02-priority-badge.md" --max-iterations 10 --completion-promise "TASK_02_COMPLETE"

# Task 3
/ralph-loop "Execute task from tasks/task-priority/03-task-edit-modal.md" --max-iterations 10 --completion-promise "TASK_03_COMPLETE"

# Task 4
/ralph-loop "Execute task from tasks/task-priority/04-priority-filter.md" --max-iterations 10 --completion-promise "TASK_04_COMPLETE"
```
```

---

## 01-database-schema.md

```markdown
# Task 01: Database Schema Migration

**Depends on:** none
**Estimated iterations:** 1-2

## Objective

Add priority field to tasks table with migration.

## Context

This is the foundation task. The priority field will be used by all subsequent UI components. Follow existing Prisma migration patterns in the codebase.

## Requirements

From PRD:
- US-001: Add priority field to database
- FR-1: Add `priority` field with enum values
- FR-2: Default priority is 'medium'

Implementation:
- [ ] Add `priority` enum to Prisma schema: `'high' | 'medium' | 'low'`
- [ ] Set default value to `'medium'`
- [ ] Generate Prisma migration
- [ ] Run migration successfully

## Files to Modify

- `prisma/schema.prisma` - Add priority field to Task model
- `prisma/migrations/` - New migration will be generated

## Acceptance Criteria

- [ ] Prisma schema includes priority field with correct type
- [ ] Default value is 'medium'
- [ ] Migration runs without errors: `npx prisma migrate dev`
- [ ] Type check passes: `npm run typecheck`

## Notes

- Check existing enum patterns in schema.prisma
- Migration name should be descriptive: `add_priority_to_tasks`

## Completion

When all requirements are met and verification passes, output:
<promise>TASK_01_COMPLETE</promise>
```

---

## 02-priority-badge.md

```markdown
# Task 02: Priority Badge Component

**Depends on:** Task 01 (database schema)
**Estimated iterations:** 2-3

## Objective

Create PriorityBadge component and integrate into TaskCard.

## Context

Now that the database has priority, we need to display it. Create a reusable badge component following existing component patterns. The badge will be used in TaskCard and potentially other places.

## Requirements

From PRD:
- US-002: Display priority indicator on task cards
- FR-3: Priority badge colors: high=red, medium=yellow, low=gray

Implementation:
- [ ] Create `components/PriorityBadge.tsx` component
- [ ] Accept priority prop: `'high' | 'medium' | 'low'`
- [ ] Display colored badge with appropriate styling
- [ ] Integrate into existing TaskCard component

## Files to Modify

- `components/PriorityBadge.tsx` - Create new component
- `components/TaskCard.tsx` - Add PriorityBadge to card layout

## Acceptance Criteria

- [ ] PriorityBadge renders correctly for all three priority levels
- [ ] Colors match spec: high=#EF4444, medium=#F59E0B, low=#9CA3AF
- [ ] Badge visible on TaskCard without hover
- [ ] Type check passes: `npm run typecheck`
- [ ] Visual verification: badges display correctly in browser

## Notes

- Follow component patterns from existing Badge or Chip components
- Use Tailwind classes for colors
- Consider accessibility (color contrast, aria-label)

## Completion

When all requirements are met and verification passes, output:
<promise>TASK_02_COMPLETE</promise>
```

---

## 03-task-edit-modal.md

```markdown
# Task 03: Task Edit Modal Update

**Depends on:** Task 02 (priority badge)
**Estimated iterations:** 2-3

## Objective

Add priority selector to task edit modal.

## Context

Users need to be able to change task priority. Add a dropdown to the existing edit modal. The PriorityBadge component from Task 02 can be reused in the dropdown options.

## Requirements

From PRD:
- US-003: Add priority selector to task edit

Implementation:
- [ ] Add priority dropdown to TaskEditModal
- [ ] Show current priority as selected value
- [ ] Save priority change to database
- [ ] Update UI optimistically

## Files to Modify

- `components/TaskEditModal.tsx` - Add priority dropdown
- Possibly: server action for updating priority

## Acceptance Criteria

- [ ] Dropdown appears in edit modal
- [ ] Current priority is pre-selected
- [ ] Selecting new priority saves to database
- [ ] UI updates immediately (optimistic update)
- [ ] Type check passes: `npm run typecheck`
- [ ] Visual verification: dropdown works in browser

## Notes

- Check existing dropdown/select patterns in the codebase
- Use same color coding as PriorityBadge for options
- Handle loading and error states

## Completion

When all requirements are met and verification passes, output:
<promise>TASK_03_COMPLETE</promise>
```

---

## 04-priority-filter.md

```markdown
# Task 04: Priority Filter Component

**Depends on:** Task 03 (task edit modal)
**Estimated iterations:** 2-3

## Objective

Add priority filter dropdown to task list.

## Context

Final task in the feature. Users should be able to filter the task list by priority. Use URL params for filter state so it persists across navigation.

## Requirements

From PRD:
- US-004: Filter tasks by priority
- FR-4: Filter dropdown appears above task list
- FR-5: URL param format: `?priority=high`

Implementation:
- [ ] Create `components/PriorityFilter.tsx` component
- [ ] Options: All, High, Medium, Low
- [ ] Store filter state in URL params
- [ ] Filter task list based on selection
- [ ] Show empty state when no matches

## Files to Modify

- `components/PriorityFilter.tsx` - Create new component
- `components/TaskList.tsx` - Add filter and filtering logic
- Possibly: update data fetching to filter server-side

## Acceptance Criteria

- [ ] Filter dropdown renders above task list
- [ ] Selecting filter updates URL params
- [ ] Task list shows only matching tasks
- [ ] "All" option shows all tasks
- [ ] Empty state message when no tasks match
- [ ] Type check passes: `npm run typecheck`
- [ ] Visual verification: filter works in browser

## Notes

- Use Next.js useSearchParams for URL state
- Consider server-side filtering for performance
- Follow existing filter patterns if they exist

## Completion

When all requirements are met and verification passes, output:
<promise>TASK_04_COMPLETE</promise>
```
