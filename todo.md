# Optimization & Cleanup Checklist

- [x] Refactor repeated work-item HTML into a reusable function/component (now generateCardListHtml)
- [x] Refactor "My Work" window to use the shared work-item generator
- [x] Centralize and deduplicate CSS for window/card/list styling (unified as .card/.card-list)
- [x] Audit and centralize theme & decoration logic (setTheme now used everywhere)
- [x] Centralize and optimize sound effect management
- [x] Ensure all drag & touch logic is unified and legacy code is removed
- [x] Unify color scheme for all window headers and card content (now matches Find Me Online)
- [ ] Abstract and deduplicate icon/window management logic
- [ ] Fix all outstanding TypeScript/lint errors and improve typings
- [x] Audit for accessibility & semantic HTML improvements
- [x] Optimize large images/assets and enable lazy loading where possible (converted to webp/webm, updated code, added lazy loading)
- [ ] Remove unused code, functions, and assets
- [x] Remove redundant profile from home window (already exists in About window)
_Note: .card/.card-list are now the standard._

_Add more as needed during the process. Check each item as it's completed._
