# Project Reflection: OpenAI Integration

## Feature Overview
**Components**: `openai.js` (Frontend), `server.js` (Backend)
**Goal**: Integrate OpenAI API to provide AI-powered Pokemon team recommendations based on user tasks.

## Timeline & Process

### Week 11: Planning & Skeleton
- **Focus**: user workflows and architectural design.
- **Output**: Created initial file structure and defined function signatures in `openai.js`.
- **Tests**: 0. Focus was on requirements gathering.

### Week 12: Detailed Design
- **Focus**: Refining the API contract and error handling strategy.
- **Output**: Detailed pseudo-code and `implementation_plan.md`.
- **Tests**: 0.

### Week 13: Testing Phase 1 (Unit & Integration)
- **Focus**: Applying TDD principles to the core logic.
- **Actions**:
    - **Unit Testing**: Wrote tests for parsing logic before finalizing the frontend code.
    - **Integration Testing**: used `supertest` to define expected API behavior (200 OK, 500 Retry logic) before implementing the full `server.js` logic.
- **Tests Added**: ~10 (Unit + Integration).

### Week 14: Testing Phase 2 (End-to-End)
- **Focus**: Verifying the complete user journey.
- **Actions**: Added Puppeteer tests to simulate real user interactions in the browser, mocking both the OpenAI and PokeAPI responses to ensure determinism.
- **Tests Added**: 1 (Comprehensive E2E scenario).

---

## Category 3: Test Driven Development (TDD)

### TDD Journey
The development process shifted from pure planning to test-first implementation in Week 13. By defining the integration tests for `server.js` first, we ensured the backend handled errors and retries correctly from day one.

#### Tests vs Code Evolution
```mermaid
xychart-beta
    title "Tests Written vs Code Written Over Time"
    x-axis [Wk 11, Wk 12, Wk 13, Wk 14]
    y-axis "Count" 0 --> 250
    line [0, 0, 10, 14] string "Tests Count"
    line [50, 150, 200, 220] string "Lines of Code"
```
*Note: The "Tests Count" spike in Week 13 represents the introduction of the Jest suite.*

### Refactoring Example
**Context**:
The `handleAIQuery` function in `openai.js` originally contained both the DOM manipulation logic (updating the UI) and the business logic (parsing the raw string from OpenAI into structured data). This made unit testing difficult as it required mocking the entire DOM.

**The Refactor**:
We extracted the parsing logic into a pure function `parseAIResult(text)`.

**Safety via Tests**:
1.  **Before**: The logic was coupled. We wrote an E2E test to verify the overall feature worked.
2.  **During**: We extracted `parseAIResult`.
3.  **After**: We immediately wrote unit tests for `parseAIResult` covering edge cases (empty strings, missing colons) that were hard to hit manually.
4.  **Result**: The code is now cleaner and the logic is verified by fast-running unit tests, reducing the reliance on slower E2E tests for logic verification.

**Code Snippet (Refactoring)**:
```javascript
// BEFORE (Implicit logic inside event handler)
// const lines = data.result.split('\n')...
// lines.forEach(...)

// AFTER (Extracted Pure Function)
export function parseAIResult(text) {
  if (!text) return [];
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  // ... parsing logic ...
  return pokemonEntries;
}
```
