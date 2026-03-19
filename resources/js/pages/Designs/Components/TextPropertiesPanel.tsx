import React, { useState } from 'react';
import { Check, Maximize2, Minimize2 } from 'lucide-react';

interface Props {
    textColor: string;
    fontSize: number;
    textInput: string;
    textWidth: number;
    maxCanvasWidth: number;
    onColor: (c: string) => void;
    onSize: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onText: (v: string) => void;
    onWidth: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCenter: () => void;
    onClose: () => void;
}

export default function TextPropertiesPanel({ textColor, fontSize, textInput, textWidth, maxCanvasWidth, onColor, onSize, onText, onWidth, onCenter, onClose }: Props) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 dark:bg-gray-900 border-t border-gray-700 pb-safe shadow-2xl">
            <div className="flex justify-center gap-4 p-4 dark:bg-black/50">
                {['#000000', '#ffffff', '#ef4444', '#3b82f6', '#eab308'].map(c => (
                    <button key={c} onClick={() => onColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${textColor === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                ))}
            </div>
            <div className="p-4 flex flex-col gap-4 max-w-3xl mx-auto">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold w-16 text-blue-600 dark:text-blue-400">Text Size</span>
                        <input type="range" min="40" max="300" value={fontSize} onChange={onSize} className="flex-1 accent-blue-500" />
                        <button onClick={onCenter} className="dark:bg-gray-700 dark:text-white px-3 py-1 rounded text-xs font-bold tracking-wider w-[76px]">CENTER</button>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold w-16 text-emerald-600 dark:text-emerald-400">Width</span>
                        <input type="range" min="100" max={maxCanvasWidth} value={textWidth} onChange={onWidth} className="flex-1 accent-emerald-500" />
                        <div className="w-[76px]"></div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <textarea value={textInput} onChange={(e) => onText(e.target.value)} placeholder="Type here..." className={`w-full dark:bg-gray-800 dark:text-white p-3 pr-10 rounded-lg border-2 border-blue-500 focus:outline-none resize-none font-semibold transition-all duration-200 ${expanded ? 'h-[280px]' : 'h-[50px]'}`} />
                        <button onClick={() => setExpanded(!expanded)} title={expanded ? "Minimize" : "Expand"} className="absolute right-3 top-3 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                            {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                    </div>
                    <button onClick={onClose} className="bg-blue-600 text-white px-6 rounded-lg font-bold flex items-center justify-center"><Check size={20}/></button>
                </div>
            </div>
        </div>
    );
}