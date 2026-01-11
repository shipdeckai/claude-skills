---
name: prd
description: "Generate AI-optimized Product Requirements Documents for features. Use when planning a feature, starting a new project, or when asked to create a PRD. Triggers on: create a prd, write prd for, plan this feature, requirements for, spec out, prd for. Creates structured PRDs ready for AI task decomposition and Ralph Loop execution."
---

# PRD Generator

Create AI-optimized Product Requirements Documents that are clear, actionable, and ready for task decomposition.

## The Job

1. Receive a feature description from the user
2. Ask 3-5 essential clarifying questions (with lettered options)
3. Generate a structured PRD based on answers
4. Save to `tasks/prd-[feature-name].md`

**Important:** Do NOT start implementing. Just create the PRD.

---

## Step 1: Clarifying Questions

Ask only critical questions where the initial prompt is ambiguous. Focus on:

- **Problem/Goal:** What problem does this solve?
- **Core Functionality:** What are the key actions?
- **Scope/Boundaries:** What should it NOT do?
- **Success Criteria:** How do we know it's done?

### Format Questions Like This:

```
1. What is the primary goal of this feature?
   A. Improve user onboarding experience
   B. Increase user retention
   C. Reduce support burden
   D. Other: [please specify]

2. Who is the target user?
   A. New users only
   B. Existing users only
   C. All users
   D. Admin users only

3. What is the scope?
   A. Minimal viable version
   B. Full-featured implementation
   C. Just the backend/API
   D. Just the UI
```

This lets users respond with "1A, 2C, 3B" for quick iteration.

---

## Step 2: PRD Structure

Generate the PRD with these sections:

### 1. Introduction/Overview
Brief description of the feature and the problem it solves.

### 2. Goals
Specific, measurable objectives (bullet list).

### 3. User Stories
Each story needs:
- **Title:** Short descriptive name (US-001, US-002, etc.)
- **Description:** "As a [user], I want [feature] so that [benefit]"
- **Acceptance Criteria:** Verifiable checklist

**Each story should be small enough to implement in ONE focused session (one context window).**

**Format:**
```markdown
### US-001: [Title]
**Description:** As a [user], I want [feature] so that [benefit].

**Acceptance Criteria:**
- [ ] Specific verifiable criterion
- [ ] Another criterion
- [ ] Tests pass: `npm test path/to/test`
- [ ] Type check passes: `npm run typecheck`
```

**Acceptance criteria must be verifiable, not vague.**
- Bad: "Works correctly"
- Good: "Button shows confirmation dialog before deleting"

### 4. Functional Requirements
Numbered list of specific functionalities:
- "FR-1: The system must allow users to..."
- "FR-2: When a user clicks X, the system must..."

Be explicit and unambiguous.

### 5. Non-Goals (Out of Scope)
What this feature will NOT include. Critical for managing scope.

### 6. Design Considerations (Optional)
- UI/UX requirements
- Link to mockups if available
- Relevant existing components to reuse

### 7. Technical Considerations (Optional)
- Known constraints or dependencies
- Integration points with existing systems
- Performance requirements
- Files likely to be modified

### 8. Success Metrics
How will success be measured?
- "Reduce time to complete X by 50%"
- "Increase conversion rate by 10%"

### 9. Open Questions
Remaining questions or areas needing clarification.

---

## Writing for AI Agents

The PRD reader will be an AI agent (Claude) executing tasks via Ralph Loop. Therefore:

- **Be explicit and unambiguous** - no implicit assumptions
- **Number everything** - FR-1, US-001, AC-1 for easy reference
- **Keep stories atomic** - one context window per story
- **Include file paths** - mention which files will likely be modified
- **Add verification commands** - test commands, typecheck, etc.

---

## Output

- **Format:** Markdown (`.md`)
- **Location:** `tasks/` directory (create if doesn't exist)
- **Filename:** `prd-[feature-name].md` (kebab-case)

After saving, inform the user:

```
PRD saved to: tasks/prd-[feature-name].md

Next step: Run /tasks tasks/prd-[feature-name].md to decompose into Ralph-ready tasks.
```

---

## Example PRD

See [references/example-prd.md](references/example-prd.md) for a complete example.
