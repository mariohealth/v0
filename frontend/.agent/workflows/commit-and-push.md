---
description: stage, commit, and push changes using conventional commits
---
// turbo-all
1. Run `git add .` to stage all changes.
2. Run `git diff --cached` to see what is being committed.
3. Summarize the changes by file/component.
4. Suggest a descriptive conventional commit message (e.g., `feat(search): restore brain mri fallback`).
5. Run `git commit -m "[message]"` with the confirmed message.
6. Run `git push origin [current-branch]`.
7. If push fails:
   a. Run `git pull --rebase origin [current-branch]`.
   b. Resolve any conflicts (if applicable).
   c. Run `git push origin [current-branch]`.
8. Report the commit summary and push status.
