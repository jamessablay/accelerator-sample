// -----------------------------------------------------------------------------
// Scatter label placement. Ported verbatim from the APEX by SPEED Tool
// (apex-by-speed/lib/labelPlacement.ts), where it is unit tested; the logic is
// unchanged here. Pure and unit agnostic: the quadrant passes viewBox units.
//
// Places point labels so that every label is fully readable: inside the frame,
// not overlapping another label, not sitting on a dot, and not covering the
// quadrant copy. Labels used to be pinned right of their dot at a fixed offset
// and truncated to fit, which both clipped names ("Outdoor (Out & Ab…") and
// overlapped in crowded bands.
// -----------------------------------------------------------------------------

export interface Rect {
  x: number; // left
  y: number; // top
  w: number;
  h: number;
}

export interface LabelRequest {
  id: string;
  cx: number; // dot centre
  cy: number;
  w: number; // label box width
  h: number; // label box height
}

export interface PlacedLabel extends Rect {
  id: string;
  side: 'left' | 'right'; // which side of the dot it ended up on
}

export interface PlaceOptions {
  bounds: Rect; // labels must stay inside this
  gap: number; // clear space between a dot and its label, and between labels
  dotR: number; // dot radius, so a label never covers a dot
  obstacles?: Rect[]; // fixed blocks to avoid (quadrant labels and their action copy)
}

const overlaps = (a: Rect, b: Rect, pad: number): boolean =>
  a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;

const inside = (r: Rect, b: Rect): boolean =>
  r.x >= b.x && r.y >= b.y && r.x + r.w <= b.x + b.w && r.y + r.h <= b.y + b.h;

/**
 * Returns one placement per request, in the same order. Never fails: if no
 * candidate is clear, the label is clamped inside the bounds at its preferred
 * side, so a label may overlap in a pathological set but is always drawn and
 * always readable at the edges.
 */
export function placeLabels(requests: LabelRequest[], opts: PlaceOptions): PlacedLabel[] {
  const { bounds, gap, dotR } = opts;
  const obstacles = opts.obstacles ?? [];

  // Every dot is an obstacle for every label, including its own neighbours.
  const dots: Rect[] = requests.map((r) => ({
    x: r.cx - dotR,
    y: r.cy - dotR,
    w: dotR * 2,
    h: dotR * 2,
  }));

  // Place the tightest rows first: a point whose vertical neighbours are close
  // has the fewest options, so it should get first pick of the free space.
  const order = requests
    .map((r, i) => ({ r, i }))
    .sort((a, b) => {
      const crowd = (p: LabelRequest) =>
        requests.reduce((n, q) => (q !== p && Math.abs(q.cy - p.cy) < p.h * 1.5 ? n + 1 : n), 0);
      return crowd(b.r) - crowd(a.r) || a.r.cx - b.r.cx;
    });

  const placed: (PlacedLabel | null)[] = requests.map(() => null);
  const taken: Rect[] = [];

  for (const { r, i } of order) {
    // Prefer the right of the dot; fall back to the left when the label would
    // leave the frame. Then try vertical nudges, growing outward, on both sides.
    const preferRight = r.cx + dotR + gap + r.w <= bounds.x + bounds.w;
    const sides: ('left' | 'right')[] = preferRight ? ['right', 'left'] : ['left', 'right'];
    const step = r.h + gap;
    const nudges = [0, -step, step, -2 * step, 2 * step, -3 * step, 3 * step];

    let chosen: PlacedLabel | null = null;
    for (const dy of nudges) {
      for (const side of sides) {
        const x = side === 'right' ? r.cx + dotR + gap : r.cx - dotR - gap - r.w;
        const box: PlacedLabel = { id: r.id, side, x, y: r.cy - r.h / 2 + dy, w: r.w, h: r.h };
        if (!inside(box, bounds)) continue;
        // A label may touch its OWN dot's gap but not any other dot.
        const hitsDot = dots.some((d, di) => di !== i && overlaps(box, d, 0));
        if (hitsDot) continue;
        if (obstacles.some((o) => overlaps(box, o, 0))) continue;
        if (taken.some((t) => overlaps(box, t, gap))) continue;
        chosen = box;
        break;
      }
      if (chosen) break;
    }

    if (!chosen) {
      // Nothing clear: keep it inside the frame on the preferred side and accept
      // the overlap rather than dropping or clipping the name.
      const side = sides[0];
      const rawX = side === 'right' ? r.cx + dotR + gap : r.cx - dotR - gap - r.w;
      chosen = {
        id: r.id,
        side,
        x: Math.min(Math.max(rawX, bounds.x), bounds.x + bounds.w - r.w),
        y: Math.min(Math.max(r.cy - r.h / 2, bounds.y), bounds.y + bounds.h - r.h),
        w: r.w,
        h: r.h,
      };
    }

    placed[i] = chosen;
    taken.push(chosen);
  }

  return placed as PlacedLabel[];
}
