# Device showcase design notes

The projects showcase uses a single, continuously scrolling row that moves right to left. It duplicates the rendered group seamlessly, pauses on hover, focus, manual scrolling or reduced-motion, and supports previous/next and play/pause controls.

Each card has a device-appropriate preview:
- NESTS uses a phone shell, because its existing Firebase screenshot is portrait/mobile.
- Desktop-oriented projects use laptop shells. Other uploaded assets are classified by native aspect ratio when not explicitly configured.
- A project may optionally set \`previewDevice\` to \`laptop\`, \`phone\`, or \`tablet\` in its existing record. No schema migration is needed.

Leasio is included as a curated fallback project only if there is no matching Leasio project in Firebase. Its checked-in preview is an **illustrative interface graphic based on the public Leasio homepage copy, not a screenshot**. Replace \`/public/projects/leasio-preview.svg\` with an actual website screenshot or add an image in the existing Projects admin when available.

Review mobile viewport, reduced motion, keyboard focus, touch scroll, fast scrolling, actual image proportions, and verify the project modal works.
