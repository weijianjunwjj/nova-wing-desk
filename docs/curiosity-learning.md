# Curiosity Mode Learning Protocol v0.1

Curiosity Mode is a reusable learning protocol for AI-assisted development.

Its goal is not to force continuous studying. Its goal is to turn real implementation problems into short, high-interest learning loops while preventing AI from silently replacing the learner at the exact points where understanding matters.

## Product principle

> Do not force the developer to study. Keep surfacing a real problem that is interesting enough to make them want to understand it.

Learning should emerge from shipping real product work, not from detached curriculum completion.

## Modes

### Fast Mode
Use when the work is already understood or mechanically repetitive.

AI may complete the work directly, subject to normal project constraints and verification.

Examples:
- styling and copy changes
- repetitive CRUD wiring
- familiar component work
- boilerplate and mechanical refactors

### Curiosity Mode
Use when a task contains a meaningful knowledge gap, a new capability, or a concept that repeatedly appears without being understood.

Curiosity Mode is the default learning path.

### Strict Mode
Use only for critical foundational concepts, repeated dependence on AI, or deliberately selected training tasks.

Strict Mode may require stronger human-only explanation and implementation gates.

## Core loop

1. **Hook** — present 2-3 real problems from the current backlog without naming the concept first.
2. **Choose** — let the learner pick the problem they most want to understand, not necessarily the most important one.
3. **Predict** — ask: `What do you think will happen?`
4. **Gap** — ask: `What part do you understand least?`
5. **Proof target** — ask: `What one thing will you prove or implement yourself?`
6. **Minimal experiment** — create the smallest experiment that can confirm or falsify the learner's prediction.
7. **Learn just enough** — explain only the knowledge needed to unblock the experiment.
8. **Human core edit** — the learner implements the highest-learning-value part themselves.
9. **AI finish** — AI completes low-learning-value engineering work around it.
10. **Verify** — run the normal technical verification loop.
11. **Aha record** — save one short statement describing what changed in the learner's mental model.

A successful session is one completed learning loop, not a fixed amount of study time.

## The three mandatory questions

Curiosity Mode should keep the mandatory learner input lightweight:

1. **Prediction** — What do I think will happen?
2. **Unknown** — What do I understand least?
3. **Proof** — What will I personally prove or change?

Avoid turning the protocol into paperwork.

## Human core edit

AI should not require the learner to hand-write everything.

The learner should own the part with the highest knowledge density, usually 10-30 meaningful lines or one small design decision. AI can handle surrounding boilerplate, repetitive code, styling, test scaffolding, and cleanup.

The objective is understanding, not manual typing volume.

## Boss fights

After a meaningful new concept has been encountered, Curiosity Mode may create a short independent challenge.

Examples:
- restore UI state after an optimistic update fails
- prevent two users from claiming the same record
- make stale server data refresh correctly
- recover a failed background job without duplicating side effects

Boss fights should:
- take roughly 15-30 minutes
- test transfer, not memorization
- avoid naming the concept before the learner encounters the problem when possible
- require a working result, not a textbook explanation

## Hint ladder

When stuck, reveal help progressively:

1. Hint 1 — conceptual direction only
2. Hint 2 — relevant API or primitive
3. Hint 3 — pseudocode or partial structure
4. Hint 4 — reference solution

The system should record the deepest hint used. This is useful evidence for mastery estimation.

## Skip policy

Curiosity Mode must not block shipping by default.

The learner may choose `Ship it` instead of `Learn it`.

However, if the same important concept is skipped repeatedly, the system should escalate:

- first skip: no warning
- second skip: remember the unresolved knowledge gap
- third skip: recommend a Curiosity Mode session
- repeated dependence after that: allow Strict Mode for that concept

This prevents both extremes: constant interruption and permanent AI dependence.

## Skill graph

Mastery should never increase because a concept was merely seen or explained.

Evidence may include:
- correctly predicted behavior
- implemented the core change
- solved a boss fight
- explained the failure mode accurately
- fixed a related bug later
- solved a similar problem after a delay
- amount of hint support required

The skill graph is evidence-based and time-sensitive. A concept may weaken if it cannot be transferred later.

## Session record

A portable implementation should be able to persist at least:

```json
{
  "protocol_version": "0.1",
  "mode": "curiosity",
  "task_id": "...",
  "hook": "...",
  "prediction": "...",
  "unknown": "...",
  "proof_target": "...",
  "concepts": ["..."],
  "human_owned_change": "...",
  "hint_level": 0,
  "verification": "passed",
  "aha": "...",
  "timestamp": "..."
}
```

The exact storage engine is intentionally unspecified so the protocol can move to other repositories and products.

## Portability rule

Curiosity Mode belongs to NovaWing's reusable learning layer, not to NovaWing Desk's business domain.

NovaWing Desk is the first dogfood environment because it has real full-stack problems and a clear product loop. The protocol should remain domain-agnostic so it can later be applied to other repositories, programming languages, algorithms, infrastructure work, or non-coding learning workflows.

## Anti-patterns

Do not:
- force a full learning ceremony for trivial work
- reward reading as mastery
- make the learner manually write boilerplate for its own sake
- ask long textbook explanation questions when a runnable experiment is available
- let AI answer the learner-only checkpoint on the learner's behalf
- use gamification points that are disconnected from demonstrated ability
- optimize for streaks instead of understanding

## Success criteria

The protocol is working if, over time:

- the learner voluntarily enters Curiosity Mode
- repeated AI dependence on the same concept decreases
- independent transfer to similar problems increases
- learning sessions still result in real product progress
- the learner can point to concrete `Aha` moments rather than hours studied

The long-term target is simple: **known work becomes faster, unknown work becomes interesting, and AI remains leverage instead of becoming a substitute for understanding.**
