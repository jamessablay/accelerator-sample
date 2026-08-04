
import React, { useState, useMemo } from 'react';
import { Persona, PersonaCategory, PersonaType } from '../../data/personasData';
import { categoryData } from '../../data/categoryData';
// Segment colours live in data/brand.ts, the single source of truth. Aliasing on
// import keeps the three existing call sites below unchanged.
import { getSegmentColor as getCategoryColor } from '../../data/brand';

interface Props {
  categories: PersonaCategory[];
  onSelectPersona: (persona: Persona) => void;
  selectedPersonaId: number | null;
  onSelectCategory: (categoryKey: string) => void;
  selectedCategoryKey: string | null;
}

const titleCase = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => {
      const match = word.match(/^([“"'(]*)(.+?)([”"')]*)$/);
      if (!match) return word;

      const prefix = match[1];
      const core = match[2];
      const suffix = match[3];

      const titleCasedCore = core
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('-');

      return prefix + titleCasedCore + suffix;
    })
    .join(' ');
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
};

const describeSunburstArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  if (endAngle - startAngle >= 360) {
      if (innerRadius === 0) {
          return [
              'M', x, y - outerRadius,
              'A', outerRadius, outerRadius, 0, 1, 1, x, y + outerRadius,
              'A', outerRadius, outerRadius, 0, 1, 1, x, y - outerRadius,
              'Z'
          ].join(' ');
      }

      const start = polarToCartesian(x, y, outerRadius, 0);
      const end = polarToCartesian(x, y, outerRadius, 180);
      const innerStart = polarToCartesian(x, y, innerRadius, 180);
      const innerEnd = polarToCartesian(x, y, innerRadius, 0);

      return [
        'M', start.x, start.y,
        'A', outerRadius, outerRadius, 0, 1, 1, end.x, end.y,
        'A', outerRadius, outerRadius, 0, 1, 1, start.x, start.y,
        'M', innerEnd.x, innerEnd.y,
        'A', innerRadius, innerRadius, 0, 1, 0, innerStart.x, innerStart.y,
        'A', innerRadius, innerRadius, 0, 1, 0, innerEnd.x, innerEnd.y,
        'Z'
      ].join(' ');
  }

  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', startOuter.x, startOuter.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    'L', endInner.x, endInner.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    'Z',
  ].join(' ');
};

const describeLabelArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number, forceOrientation: 'CW' | 'CCW' | null = null) => {
    if (endAngle - startAngle >= 360) {
        endAngle = startAngle + 359.99;
    }

    const pStart = polarToCartesian(x, y, radius, startAngle);
    const pEnd = polarToCartesian(x, y, radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const midAngle = startAngle + (endAngle - startAngle) / 2;
    const normalizedMid = (midAngle % 360 + 360) % 360;

    let isFlipped = normalizedMid > 90 && normalizedMid < 300;
    if (forceOrientation === 'CW') isFlipped = false;
    if (forceOrientation === 'CCW') isFlipped = true;

    if (isFlipped) {
        return `M ${pEnd.x} ${pEnd.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${pStart.x} ${pStart.y}`;
    }
    return `M ${pStart.x} ${pStart.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${pEnd.x} ${pEnd.y}`;
};

const getOrderedLabelRadii = (startAngle: number, endAngle: number, radiiObj: any, lineCount: number, forceOrientation: 'CW' | 'CCW' | null = null) => {
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    const normalizedMid = (midAngle % 360 + 360) % 360;

    let isFlipped = normalizedMid > 90 && normalizedMid < 300;
    if (forceOrientation === 'CW') isFlipped = false;
    if (forceOrientation === 'CCW') isFlipped = true;

    if (lineCount === 3) {
         if (isFlipped) {
            return [radiiObj.label3Line3, radiiObj.label3Line2, radiiObj.label3Line1];
        }
        return [radiiObj.label3Line1, radiiObj.label3Line2, radiiObj.label3Line3];
    } else if (lineCount === 2) {
        if (isFlipped) {
            return [radiiObj.label2Line2, radiiObj.label2Line1];
        }
        return [radiiObj.label2Line1, radiiObj.label2Line2];
    }
    return [radiiObj.labelSingle || radiiObj.label];
};

const wrapText = (text: string, maxCharsPerLine: number, maxLines: number = 2): string[] => {
    const words = text.split(/\s+/);
    if (words.length <= 1 && text.length <= maxCharsPerLine) {
        return [text];
    }

    const lines: string[] = [];
    let currentLine = words[0];
    const remainingWords = words.slice(1);

    for (const word of remainingWords) {
        if (lines.length === maxLines - 1) {
            currentLine += ' ' + word;
        } else if (currentLine.length + 1 + word.length > maxCharsPerLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine += ' ' + word;
        }
    }
    lines.push(currentLine);
    return lines;
};

// Split a "Segment Name (49%)" title into [...wrappedName lines, share].
//
// Putting the share on its own line is not cosmetic: "Unaware / Unconvinced (49%)"
// is 27 characters and clips at both ends of a 90 degree arc on one line. It also
// makes the four stage labels visually consistent.
//
// Titles are already correctly cased in categoryData, so they are not run through
// titleCase(). A title with no parenthetical falls through to plain wrapText.
const splitTitleWithCount = (title: string, maxChars: number, maxNameLines: number): string[] => {
    const match = title.match(/^(.+?)\s*\((.+)\)\s*$/);
    if (!match) {
        return wrapText(title, maxChars, maxNameLines);
    }
    const baseName = match[1].trim();
    const count = `(${match[2].trim()})`;
    const nameLines = wrapText(baseName, maxChars, maxNameLines);
    return [...nameLines, count];
};

// Geometry: 3 concentric layers, viewBox 340x340 centred at 165.
//
// Hamilton Island's wheel had 4 layers because its model nested two levels above
// the personas (travel intent, then wealth). Lyka's readiness ladder has only one
// level above the personas, so the middle ring is gone and the remaining three
// layers were re-spaced to fill the same radius.
const RADIUS_CONFIG = {
    centre: {
        inner: 0, outer: 52,
    },
    stage: {
        inner: 55, outer: 108,
        label3Line1: 100, label3Line2: 82, label3Line3: 64,
        label2Line1: 95, label2Line2: 72,
        label: 82,
    },
    persona: {
        inner: 111, outer: 165,
        labelSingle: 140,
        label2Line1: 151, label2Line2: 129,
        label3Line1: 155, label3Line2: 138, label3Line3: 121,
    },
};

const CHART_CENTER = 165;

// The four readiness stages, one quadrant each, reading CLOCKWISE FROM 12 O'CLOCK
// so the ladder progresses in natural reading order. polarToCartesian applies
// (angle - 90), so 0 degrees is 12 o'clock and angles increase clockwise.
//
// Arcs are deliberately EQUAL rather than proportional to market share. The
// stages are 49 / 25 / 15 / 11 percent, so proportional arcs would squeeze Ready
// to 40 degrees. The share figures are shown as text on the wedge and in the
// Segment Deep Dive instead. If this is ever switched to proportional, derive the
// sweeps from categoryData[key].marketShare rather than hardcoding them.
//
// Orientation is left to the DEFAULT flip rule (90 < mid < 300 => CCW), which
// gives mid 45 CW, 135 CCW, 225 CCW, 315 CW. That is exactly right for quadrants:
// the top two read facing inward, the bottom two facing outward, and every label
// is the right way up.
//
// Do not force CW here. Hamilton Island did, because its two halves were LEFT and
// RIGHT (0-180, 180-360) where a single orientation works. With quadrants, forcing
// CW renders the two bottom labels upside down.
const STAGE_LAYOUT = [
    { key: 'Unaware',     startAngle: 0,   endAngle: 90,  forceOrient: null },
    { key: 'Curious',     startAngle: 90,  endAngle: 180, forceOrient: null },
    { key: 'Considering', startAngle: 180, endAngle: 270, forceOrient: null },
    { key: 'Ready',       startAngle: 270, endAngle: 360, forceOrient: null },
] as { key: string; startAngle: number; endAngle: number; forceOrient: 'CW' | 'CCW' | null }[];

// The centre disc: the whole dog-owner market. Must be a categoryData key.
const CENTRE_KEY = 'Australian Dog Owners';

/**
 * Characters that fit on one arc line, derived from the wedge's angular sweep.
 *
 * Hamilton hardcoded 10 because every persona wedge was 45 degrees. Lyka's are
 * 45 or 90 depending on how many personas share a stage, so a fixed limit either
 * overflows the narrow wedges or wastes the wide ones. Roughly 0.24 characters
 * per degree at the persona ring's font size, floored so a 45 degree wedge still
 * gets Hamilton's proven 10 and capped so wide wedges do not run edge to edge.
 */
const maxCharsForSweep = (sweep: number): number =>
    Math.max(10, Math.min(18, Math.round(sweep * 0.24)));

const PersonaCompositionChart: React.FC<Props> = ({ categories, onSelectPersona, selectedPersonaId, onSelectCategory, selectedCategoryKey }) => {
  const [hoveredSegmentId, setHoveredSegmentId] = useState<string | number | null>(null);

  const hasSelection = !!(selectedPersonaId || selectedCategoryKey);

  // Single bucket. The chart reads it and groups its personas by `category`.
  const audience = useMemo(
    () => categories.find(c => c.type === PersonaType.LYKA_AUDIENCE) || null,
    [categories]
  );

  const segments = useMemo(() => {
    const allSegments: any[] = [];
    if (!audience) return allSegments;

    /**
     * Attach the 1, 2 or 3 label arc paths a wedge needs.
     *
     * Hamilton repeated this same three-way branch verbatim for each of its three
     * labelled layers, and again in the render block. Extracting it means adding a
     * ring is now one call rather than another copy-paste.
     */
    const attachLabelPaths = (
        seg: any,
        lines: string[],
        radii: { [k: string]: number },
        startAngle: number,
        endAngle: number,
        orient: 'CW' | 'CCW' | null,
        singleRadius: number,
    ) => {
        const ordered = getOrderedLabelRadii(startAngle, endAngle, radii as any, lines.length, orient);
        if (lines.length >= 2) {
            ordered.slice(0, lines.length).forEach((r, i) => {
                seg['labelPath' + (i + 1)] = describeLabelArc(CHART_CENTER, CHART_CENTER, r, startAngle, endAngle, orient);
            });
        } else {
            seg.labelPath = describeLabelArc(CHART_CENTER, CHART_CENTER, singleRadius, startAngle, endAngle, orient);
        }
        return seg;
    };

    // -----------------------------------------------------------------------
    // Layer 0 — Centre disc: the whole dog-owner market
    // -----------------------------------------------------------------------
    const centreColors = getCategoryColor(CENTRE_KEY);
    const centreTitle = categoryData[CENTRE_KEY]?.title || CENTRE_KEY;
    const centreLines = splitTitleWithCount(centreTitle, 12, 3);

    allSegments.push({
        id: CENTRE_KEY,
        type: 'centreDisc',
        layer: 'centre',
        name: centreLines,
        path: describeSunburstArc(CHART_CENTER, CHART_CENTER, RADIUS_CONFIG.centre.inner, RADIUS_CONFIG.centre.outer, 0, 360),
        color: centreColors.base,
        hoverColor: centreColors.hover,
        textColor: '#FFFFFF',
        isCentered: true,
        centerX: CHART_CENTER,
        centerY: CHART_CENTER,
        data: { categoryName: CENTRE_KEY },
    });

    // -----------------------------------------------------------------------
    // Layer 1 — the four readiness stages, one quadrant each
    // Layer 2 — the personas belonging to each stage, splitting its quadrant
    // -----------------------------------------------------------------------
    const personasByStage: Record<string, Persona[]> = audience.personas.reduce((acc, p) => {
        if (!acc[p.category]) acc[p.category] = [];
        acc[p.category].push(p);
        return acc;
    }, {} as Record<string, Persona[]>);

    STAGE_LAYOUT.forEach(({ key, startAngle, endAngle, forceOrient }) => {
        const colors = getCategoryColor(key);
        const title = categoryData[key]?.title || key;
        const S_R = RADIUS_CONFIG.stage;
        // Stage titles carry their market share, e.g. "Considering (15%)". Split so
        // the share sits on its own line: "Unaware / Unconvinced (49%)" is 27
        // characters and overruns a 90 degree arc on one line, clipping at both
        // ends. Splitting also makes the four labels visually consistent.
        const lines = splitTitleWithCount(title, 13, 2);

        const stageSeg = attachLabelPaths(
            {
                id: key,
                type: 'stage',
                layer: 'stage',
                name: lines,
                path: describeSunburstArc(CHART_CENTER, CHART_CENTER, S_R.inner, S_R.outer, startAngle, endAngle),
                color: colors.base,
                hoverColor: colors.hover,
                textColor: '#FFFFFF',
                data: { categoryName: key },
            },
            lines, S_R, startAngle, endAngle, forceOrient, S_R.label,
        );

        allSegments.push(stageSeg);

        // Personas split this stage's quadrant evenly. Unaware has 2 (45 degrees
        // each); the other three stages have 1 (a full 90 degrees).
        const childPersonas = personasByStage[key] || [];
        if (childPersonas.length === 0) return;

        const sweep = endAngle - startAngle;
        const anglePerPersona = sweep / childPersonas.length;
        const maxChars = maxCharsForSweep(anglePerPersona);
        let cursor = startAngle;

        childPersonas.forEach(persona => {
            const pStart = cursor;
            const pEnd = cursor + anglePerPersona;
            const wrappedTitle = wrapText(titleCase(persona.title), maxChars, 2);
            const P_R = RADIUS_CONFIG.persona;

            // Per-persona orientation overrides go here, keyed on persona.title.
            // The default rule (90 < mid < 300 => CCW) flips labels to face
            // outward; force CW on any wedge that should read inward to match a
            // neighbour. Check the wheel after changing a title or a stage's
            // persona count, because both move the mid angles.
            const pForceOrient: 'CW' | 'CCW' | null = null;

            const personaSeg = attachLabelPaths(
                {
                    id: persona.id,
                    type: 'persona',
                    layer: 'persona',
                    parentCategoryId: key,
                    name: wrappedTitle,
                    path: describeSunburstArc(CHART_CENTER, CHART_CENTER, P_R.inner, P_R.outer, pStart, pEnd),
                    color: colors.lighter,
                    hoverColor: colors.lighterHover,
                    textColor: '#FFFFFF',
                    data: persona,
                },
                wrappedTitle, P_R, pStart, pEnd, pForceOrient, P_R.labelSingle,
            );

            allSegments.push(personaSeg);
            cursor += anglePerPersona;
        });
    });

    return allSegments;
  }, [audience]);

  const selectedPersonaParentId = useMemo(() => {
    if (!selectedPersonaId) return null;
    const personaSegment = segments.find(s => s.id === selectedPersonaId);
    return personaSegment?.parentCategoryId || null;
  }, [selectedPersonaId, segments]);

  // Dark outline painted behind the white glyphs so labels stay legible on any
  // wedge colour (paint-order: stroke draws the stroke first, fill on top).
  const labelHalo: React.CSSProperties = {
    paintOrder: 'stroke',
    stroke: 'rgba(0,0,0,0.45)',
    strokeLinejoin: 'round',
  };
  const getTextStyle = (type: string): React.CSSProperties => {
    switch(type) {
        case 'centreDisc':
            return { fontSize: '9px', fontWeight: 'bold', ...labelHalo, strokeWidth: '2.2px' };
        case 'stage':
            return { fontSize: '9.5px', fontWeight: '600', ...labelHalo, strokeWidth: '2px' };
        case 'persona':
        default:
            return { fontSize: '7.5px', fontWeight: '500', ...labelHalo, strokeWidth: '1.5px' };
    }
  };

  return (
    <div className="w-full h-full">
        <svg viewBox="-5 -5 340 340" className="w-full h-full">
          <defs>
            {segments.map(segment => {
              const safeId = segment.id.toString().replace(/[\s/()]/g, '-');
              return (
              <React.Fragment key={`defs-${safeId}`}>
                {!segment.isCentered && segment.labelPath && <path id={`path-${safeId}`} d={segment.labelPath} fill="none" />}
                {!segment.isCentered && segment.labelPath1 && <path id={`path-${safeId}-1`} d={segment.labelPath1} fill="none" />}
                {!segment.isCentered && segment.labelPath2 && <path id={`path-${safeId}-2`} d={segment.labelPath2} fill="none" />}
                {!segment.isCentered && segment.labelPath3 && <path id={`path-${safeId}-3`} d={segment.labelPath3} fill="none" />}
              </React.Fragment>
            )})}
          </defs>
          <g>
            {segments.map((segment) => {
                const safeId = segment.id.toString().replace(/[\s/()]/g, '-');
                const isDirectlySelected = segment.id === selectedPersonaId || segment.id === selectedCategoryKey;
                const isChildOfSelectedCategory = segment.type === 'persona' && segment.parentCategoryId === selectedCategoryKey;
                const isParentOfSelectedPersona = segment.id === selectedPersonaParentId;
                const isSelected = isDirectlySelected || isChildOfSelectedCategory || isParentOfSelectedPersona;
                const isHovered =
                    hoveredSegmentId === segment.id ||
                    (segment.type === 'persona' && segment.parentCategoryId === hoveredSegmentId);
                const isActive = isSelected || isHovered;

                // Fade rule: dim everything except the selected wedge and its
                // chain up the ladder, so the path from market to persona stays
                // readable. The centre disc never fades: it is the whole market
                // and is always the context for whatever is selected.
                let isFaded = false;
                if (hasSelection) {
                    if (segment.type === 'persona') {
                        isFaded = !isSelected;
                    } else if (segment.type === 'stage') {
                        if (selectedPersonaId) {
                            // Keep the selected persona's parent stage lit.
                            isFaded = segment.id !== selectedPersonaParentId;
                        } else if (selectedCategoryKey && selectedCategoryKey !== CENTRE_KEY) {
                            isFaded = segment.id !== selectedCategoryKey;
                        }
                    }
                }

                return (
                    <g
                        key={segment.id}
                        style={{
                            opacity: isFaded ? 0.3 : 1,
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    >
                        <path
                        d={segment.path}
                        fill={isActive ? segment.hoverColor : segment.color}
                        onMouseEnter={() => setHoveredSegmentId(segment.id)}
                        onMouseLeave={() => setHoveredSegmentId(null)}
                        onClick={() => {
                            if (segment.type === 'persona') onSelectPersona(segment.data);
                            else onSelectCategory(segment.id);
                        }}
                        className={`origin-center cursor-pointer`}
                        style={{
                            transition: 'transform 0.3s ease-in-out, fill 0.3s ease-in-out',
                            transform: isActive ? 'scale(1.02)' : 'scale(1)',
                        }}
                        stroke="#fff"
                        strokeWidth={1.5}
                        />

                        {segment.isCentered ? (
                            <text
                                x={segment.centerX ?? CHART_CENTER}
                                y={segment.centerY ?? CHART_CENTER}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="pointer-events-none select-none"
                                style={{ fill: segment.textColor || 'white', ...labelHalo, strokeWidth: '2px' }}
                            >
                                {segment.name.map((line: string, i: number) => {
                                    const total = segment.name.length;
                                    // Offset all tspans so the block is vertically centred.
                                    const dy = i === 0 ? `-${((total - 1) * 0.55).toFixed(2)}em` : '1.1em';
                                    return (
                                        <tspan
                                            key={i}
                                            x={segment.centerX ?? CHART_CENTER}
                                            dy={dy}
                                            style={{
                                                fontSize: '8.5px',
                                                fontWeight: 'bold',
                                                letterSpacing: '0.04em',
                                            }}
                                        >
                                            {line}
                                        </tspan>
                                    );
                                })}
                            </text>
                        ) : (
                            <>
                                {segment.name.length === 1 && segment.labelPath && (
                                    <text
                                        className="pointer-events-none select-none"
                                        style={{ ...getTextStyle(segment.type), fill: segment.textColor || 'white' }}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <textPath startOffset="50%" href={`#path-${safeId}`}>{segment.name[0]}</textPath>
                                    </text>
                                )}
                                {segment.name.length === 2 && (
                                    <>
                                        <text className="pointer-events-none select-none" style={{ ...getTextStyle(segment.type), fill: segment.textColor || 'white' }} textAnchor="middle" dominantBaseline="middle">
                                            <textPath startOffset="50%" href={`#path-${safeId}-1`}>{segment.name[0]}</textPath>
                                        </text>
                                        <text className="pointer-events-none select-none" style={{ ...getTextStyle(segment.type), fill: segment.textColor || 'white' }} textAnchor="middle" dominantBaseline="middle">
                                            <textPath startOffset="50%" href={`#path-${safeId}-2`}>{segment.name[1]}</textPath>
                                        </text>
                                    </>
                                )}
                                {segment.name.length === 3 && (
                                    <>
                                        <text className="pointer-events-none select-none" style={{ ...getTextStyle(segment.type), fill: segment.textColor || 'white' }} textAnchor="middle" dominantBaseline="middle">
                                            <textPath startOffset="50%" href={`#path-${safeId}-1`}>{segment.name[0]}</textPath>
                                        </text>
                                        <text className="pointer-events-none select-none" style={{ ...getTextStyle(segment.type), fill: segment.textColor || 'white' }} textAnchor="middle" dominantBaseline="middle">
                                            <textPath startOffset="50%" href={`#path-${safeId}-2`}>{segment.name[1]}</textPath>
                                        </text>
                                        <text className="pointer-events-none select-none" style={{ ...getTextStyle(segment.type), fill: segment.textColor || 'white' }} textAnchor="middle" dominantBaseline="middle">
                                            <textPath startOffset="50%" href={`#path-${safeId}-3`}>{segment.name[2]}</textPath>
                                        </text>
                                    </>
                                )}
                            </>
                        )}
                    </g>
                );
            })}
          </g>
        </svg>
    </div>
  );
};

export default React.memo(PersonaCompositionChart);
