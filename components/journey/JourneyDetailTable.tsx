
import React, { useState } from 'react';
import { JourneySubCategory, JourneyStageDetail } from '../../data/journeyDetailsData';
import JourneyScoreGraph from './JourneyScoreGraph';
import Modal from '../shared/Modal';
import InfoIcon from '../icons/InfoIcon';
import { LYKA, FOCUS } from '../../data/brand';
import { MEDIA_FOCUS_LABEL, MEDIA_FOCUS_NOTE } from '../../data/mediaFocus';

interface JourneyDetailTableProps {
  journey: JourneySubCategory;
  /**
   * Stage titles to wash as the media focus, for THIS journey. Resolved by the
   * caller (see TableAdapter), so this component holds no opinion about which
   * journeys or stages qualify and cannot drift from the other four views.
   *
   * OPTIONAL AND DEFAULTED so the baseline contract is intact: called without
   * it, this table renders exactly what it rendered before 2026-08-07.
   */
  focusStages?: readonly string[];
}

interface RowConfig {
    title: string;
    render: (stage: JourneyStageDetail) => React.ReactNode;
}

// Splits on SEMICOLONS. Any field authored with full stops only renders as one
// long bullet, so write these strings semicolon delimited to get a real list.
const renderStandardList = (text: string) => (
    <ul className="list-disc pl-4 space-y-1.5">
        {text.split(';').map((item, index) => (
            item.trim() && <li key={index}>{item.trim()}</li>
        ))}
    </ul>
);

// The legacy Xero "isAccountant" branch (an alternate 6-row layout gated behind
// a hardcoded `false`) was removed in the Lyka conversion along with its
// journeyType prop. Only this configuration was ever reachable.
const ROW_CONFIG: RowConfig[] = [
    { title: "What they're doing & thinking", render: (stage) => renderStandardList(stage.doingThinking) },
    { title: 'Key pain points & barriers',    render: (stage) => renderStandardList(stage.painPoints) },
    { title: 'Influences & touchpoints',      render: (stage) => renderStandardList(stage.influences) },
    { title: 'Moments to win',                render: (stage) => renderStandardList(stage.momentsToWin) },
];

const JourneyDetailTable: React.FC<JourneyDetailTableProps> = ({ journey, focusStages = [] }) => {
    const [selectedStage, setSelectedStage] = useState<JourneyStageDetail | null>(null);

    if (!journey || !journey.stages || journey.stages.length === 0) {
        return <div className="text-center p-8">No journey data available.</div>;
    }

    const { stages } = journey;

    // BY TITLE, not by column index. See data/mediaFocus.ts.
    const isFocus = (stage: JourneyStageDetail) => focusStages.includes(stage.title);
    const anyFocus = stages.some(isFocus);

    const handleHeaderClick = (stage: JourneyStageDetail) => {
        if (stage.definition || stage.coreQuestion) {
            setSelectedStage(stage);
        }
    };

  return (
    <>
        <div
            className="overflow-hidden rounded-2xl border animate-fadeIn"
            style={{ borderColor: LYKA.mint, boxShadow: LYKA.shadow }}
        >
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse">
                    <thead style={{ backgroundColor: LYKA.cream }}>
                        <tr>
                            <th
                                scope="col"
                                className="sticky left-0 z-20 px-6 py-4 w-48 text-left text-sm font-bold uppercase tracking-wider border-b font-mono"
                                style={{ backgroundColor: LYKA.cream, color: LYKA.muted, borderColor: LYKA.mint }}
                            >
                            {/* Empty top-left corner */}
                            </th>
                            {stages.map((stage) => {
                                const focus = isFocus(stage);
                                return (
                                <th
                                    key={stage.title}
                                    scope="col"
                                    className={`relative px-6 py-4 w-56 text-left text-sm font-bold uppercase tracking-wider border-b ${stage.definition ? 'cursor-pointer transition-colors hover:brightness-[0.97]' : ''}`}
                                    style={{
                                        color: LYKA.muted,
                                        borderColor: LYKA.mint,
                                        backgroundColor: focus ? FOCUS.wash : undefined,
                                    }}
                                    onClick={() => handleHeaderClick(stage)}
                                >
                                    {/* The rule sits ON TOP of the column, where the
                                        wash begins, so the marked column reads as one
                                        object from here down. */}
                                    {focus && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-x-0 top-0 h-[3px]"
                                            style={{ backgroundColor: FOCUS.edge }}
                                        />
                                    )}
                                    <div className="flex items-center">
                                        <div
                                            className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-white mr-3"
                                            style={{ backgroundColor: LYKA.accentInk }}
                                        >
                                            {stage.icon}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-base font-semibold" style={{ color: LYKA.tealDeepest }}>{stage.title}</span>
                                            {/* muted, not mintMuted: the affordance for a click
                                                target, and 1.88:1 misses the 3:1 non-text floor.
                                                Colour only; this file is the A/B baseline. */}
                                            {stage.definition && <InfoIcon className="w-5 h-5 ml-1.5" style={{ color: LYKA.muted }} />}
                                        </div>
                                    </div>
                                    {focus && (
                                        <span
                                            className="mt-1.5 inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                                            style={{ backgroundColor: FOCUS.tagBg, color: FOCUS.tagInk }}
                                        >
                                            {MEDIA_FOCUS_LABEL}
                                        </span>
                                    )}
                                </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: LYKA.mint }}>
                        {ROW_CONFIG.map(row => (
                            <tr key={row.title} className="group">
                                <th
                                    scope="row"
                                    className="sticky left-0 bg-white group-hover:bg-[#F9F6F1] z-10 px-6 py-5 text-base font-semibold text-left align-top transition-colors duration-200"
                                    style={{ color: LYKA.ink }}
                                >
                                    {row.title}
                                </th>
                                {stages.map((stage, idx) => (
                                    <td
                                        key={`${stage.title}-${idx}`}
                                        className="px-6 py-5 text-base align-top"
                                        style={{
                                            color: LYKA.muted,
                                            // 4.75:1 for this ink on the wash. Asserted, check 6d.
                                            backgroundColor: isFocus(stage) ? FOCUS.wash : undefined,
                                        }}
                                    >
                                        {row.render(stage)}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {/* Graph row */}
                        <tr style={{ backgroundColor: LYKA.ivory }}>
                            <th
                                scope="row"
                                className="sticky left-0 z-10 px-6 py-5 text-base font-semibold text-left align-top"
                                style={{ backgroundColor: LYKA.ivory, color: LYKA.ink }}
                            >
                                Emotional &amp; Rational Journey
                            </th>
                            <td colSpan={stages.length} className="p-0 relative z-0">
                                <JourneyScoreGraph stages={stages} />
                            </td>
                        </tr>

                        {/* Duration row */}
                        <tr className="group">
                            <th
                                scope="row"
                                className="sticky left-0 bg-white group-hover:bg-[#F9F6F1] z-10 px-6 py-5 text-base font-semibold text-left align-top transition-colors duration-200"
                                style={{ color: LYKA.ink }}
                            >
                                Duration
                            </th>
                            {stages.map(stage => (
                                <td
                                    key={`${stage.title}-duration`}
                                    className="px-6 py-5 text-base font-medium align-top"
                                    style={{
                                        color: LYKA.ink,
                                        backgroundColor: isFocus(stage) ? FOCUS.wash : undefined,
                                    }}
                                >
                                    {stage.duration}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* An unexplained colour on a data table reads as an encoding, so the
            wash says what it is. Rendered only when something is actually
            marked, or it describes an emphasis that is not on screen. */}
        {anyFocus && (
            <p className="mt-2 text-meta" style={{ color: LYKA.muted }}>
                {MEDIA_FOCUS_NOTE}
            </p>
        )}

        <Modal
            isOpen={!!selectedStage}
            onClose={() => setSelectedStage(null)}
            title={selectedStage?.title}
            maxWidth="max-w-xl"
        >
            <div className="flex flex-col gap-6">
                {selectedStage?.definition && (
                    <div className="p-6 rounded-xl border" style={{ backgroundColor: LYKA.cream, borderColor: LYKA.mint }}>
                         <div className="flex items-center mb-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: LYKA.accentInk }}>Definition</h4>
                         </div>
                        <p className="text-2xl leading-relaxed font-normal" style={{ color: LYKA.tealDeepest }}>
                            {selectedStage.definition}
                        </p>
                    </div>
                )}

                {selectedStage?.coreQuestion && (
                    <div
                        className="p-8 rounded-xl text-center"
                        style={{ backgroundColor: LYKA.tealDeepest, boxShadow: LYKA.shadow }}
                    >
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 font-mono" style={{ color: LYKA.accent }}>Core Question</h4>
                        <p className="text-3xl italic leading-tight text-white">
                            &ldquo;{selectedStage.coreQuestion.replace(/^['"]+|['"]+$/g, '')}&rdquo;
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    </>
  );
};

export default JourneyDetailTable;
