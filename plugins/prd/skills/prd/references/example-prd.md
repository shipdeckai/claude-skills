# Example PRD: Task Priority System

## Introduction

Add priority levels to tasks so users can focus on what matters most. Tasks can be marked as high, medium, or low priority, with visual indicators and filtering.

## Goals

- Allow assigning priority (high/medium/low) to any task
- Provide clear visual differentiation between priority levels
- Enable filtering and sorting by priority
- Default new tasks to medium priority

## User Stories

### US-001: Add priority field to database
**Description:** As a developer, I need to store task priority so it persists across sessions.

**Acceptance Criteria:**
- [ ] Add `priority` column to tasks table: `'high' | 'medium' | 'low'` (default `'medium'`)
- [ ] Generate and run migration successfully
- [ ] Type check passes: `npm run typecheck`

**Files:** `prisma/schema.prisma`, `prisma/migrations/`

---

### US-002: Display priority indicator on task cards
**Description:** As a user, I want to see task priority at a glance so I know what needs attention first.

**Acceptance Criteria:**
- [ ] Each task card shows colored priority badge (red=high, yellow=medium, gray=low)
- [ ] Badge includes icon appropriate to priority level
- [ ] Priority visible without hovering or clicking
- [ ] Type check passes: `npm run typecheck`
- [ ] Visual verification in browser

**Files:** `components/TaskCard.tsx`, `components/PriorityBadge.tsx` (new)

---

### US-003: Add priority selector to task edit
**Description:** As a user, I want to change a task's priority when editing it.

**Acceptance Criteria:**
- [ ] Priority dropdown in task edit modal
- [ ] Shows current priority as selected
- [ ] Saves immediately on selection change
- [ ] Type check passes: `npm run typecheck`
- [ ] Visual verification in browser

**Files:** `components/TaskEditModal.tsx`

---

### US-004: Filter tasks by priority
**Description:** As a user, I want to filter the task list to see only high-priority items when I'm focused.

**Acceptance Criteria:**
- [ ] Filter dropdown with options: All | High | Medium | Low
- [ ] Filter persists in URL params
- [ ] Empty state message when no tasks match filter
- [ ] Type check passes: `npm run typecheck`
- [ ] Visual verification in browser

**Files:** `components/TaskList.tsx`, `components/PriorityFilter.tsx` (new)

## Functional Requirements

- FR-1: Add `priority` field to tasks table with enum values `'high' | 'medium' | 'low'`
- FR-2: Default priority for new tasks is `'medium'`
- FR-3: Priority badge colors: high=red (#EF4444), medium=yellow (#F59E0B), low=gray (#9CA3AF)
- FR-4: Filter dropdown appears above task list
- FR-5: URL param format: `?priority=high` or `?priority=all`

## Non-Goals (Out of Scope)

- Custom priority labels (only high/medium/low)
- Priority-based notifications
- Bulk priority editing
- Priority inheritance from parent tasks

## Technical Considerations

- Use existing Prisma schema patterns
- Follow component patterns from existing TaskCard
- Use URL search params for filter state (Next.js useSearchParams)
- Consider existing color palette in tailwind.config.js

## Success Metrics

- Users can set and view priority on 100% of tasks
- Filter reduces visible tasks correctly
- No regression in task list performance

## Open Questions

- Should priority sort be automatic or user-controlled?
- Include priority in task list header counts?
