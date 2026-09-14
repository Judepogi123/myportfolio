# Project screenshots

Drop a screenshot here and point at it from `src/data/profile.ts`:

```ts
{
  id:    'giams',
  cover: '/projects/giams.png',   // <- served from this folder
  ...
}
```

Without a `cover`, the card draws its line-art motif instead, so the gallery
always looks finished.

- **Aspect ratio** — `21:8` for the featured (first) card, `16:10` for the rest.
- **Size** — around 1600px wide is plenty; anything larger is wasted bytes.
- **Format** — `.webp` if you can, `.png` otherwise.
