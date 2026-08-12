# Taste

## Workflow
- Prefers read-only exploration when asked to analyze/explain a project; explicitly requests "do not modify any files" during analysis. Analysis tasks should never alter, refactor, or write to the codebase unless the user asks for changes. Confidence: 0.8

## Communication
- When requesting a project analysis, wants a comprehensive, structured breakdown covering: project structure, backend architecture, important files, dependencies, and how the application currently works (data flow from request to response). Confidence: 0.6
- Wants professional, GitHub-ready documentation with a comprehensive standard section structure (Overview, Key Features, Technology Stack, Project Structure, Prerequisites, Installation, Environment Variables, Running the App, API Usage, Workflow/Architecture, Example Usage, Troubleshooting, Future Improvements), using proper Markdown formatting and code blocks for commands. Confidence: 0.8
- Documentation must never invent features or technologies that don't exist in the codebase; preserve useful existing info but correct outdated/inaccurate content, and mark unclear items as "not currently documented" rather than guessing. Confidence: 0.9
- After completing a modification task, wants a concise summary of what was changed (what was corrected, added, and any notable findings). Confidence: 0.6
