import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Canvas, FabricImage, Textbox, Circle, Group, Path } from 'fabric';
import EditorToolbar from '../Components/EditorToolbar';
import CanvasWorkspace from '../Components/CanvasWorkspace';
import TemplateSelectorModal from '../Components/TemplateSelectorModal';
import TextPropertiesPanel from '../Components/TextPropertiesPanel';
import PortraitCropperModal from '../Components/PortraitCropperModal';

const TEMPLATES = ['/templates/Quote-1.png', '/templates/Quote-2.png', '/templates/Quote-3.png', '/templates/Quote-4.png', '/templates/Quote-5.png', '/templates/Quote-6.png', '/templates/Quote-7.png'];
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 2000;

export default function QuoteEditor() {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Designs', href: '/designs' }, { title: 'Quote Editor', href: '#' }];
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasElRef = useRef<HTMLCanvasElement>(null);
    const cropCanvasElRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const cropCanvasRef = useRef<Canvas | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const portraitInputRef = useRef<HTMLInputElement>(null);
    const hasLoadedRef = useRef(false);
    const statusTimeoutRef = useRef<number | null>(null);
    const pinchState = useRef<{ distance: number, scaleX: number, scaleY: number } | null>(null);
    const cropPinchState = useRef<{ distance: number, scaleX: number, scaleY: number } | null>(null);
    const cropImageObjRef = useRef<FabricImage | null>(null);
    const cropSizeRef = useRef(800);
    
    const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]);
    const [showTemplates, setShowTemplates] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [cropImageObj, setCropImageObj] = useState<FabricImage | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [cropZoom, setCropZoom] = useState(1);
    const [displayScale, setDisplayScale] = useState(1);
    const [activeTextObj, setActiveTextObj] = useState<Textbox | null>(null);
    const [textInput, setTextInput] = useState('');
    const [fontSize, setFontSize] = useState(120);
    const [textColor, setTextColor] = useState('#ef4444');
    const [textWidth, setTextWidth] = useState(CANVAS_WIDTH * 0.9); // Re-added textWidth state
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            if (window.confirm("Are you sure you want to leave? Unsaved changes may be lost.")) window.history.back();
            else window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);
        return () => { window.removeEventListener('beforeunload', handleBeforeUnload); window.removeEventListener('popstate', handlePopState); };
    }, []);

    const showStatus = useCallback((msg: string) => {
        setStatusMsg(msg);
        if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
        statusTimeoutRef.current = window.setTimeout(() => setStatusMsg(null), 2000);
    }, []);

    const loadTemplateToCanvas = async (canvas: Canvas, url: string) => {
        try {
            const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
            const scaleX = CANVAS_WIDTH / img.width;
            const scaleY = CANVAS_HEIGHT / img.height;
            const scale = Math.max(scaleX, scaleY);
            img.set({ name: 'template', originX: 'center', originY: 'center', left: CANVAS_WIDTH / 2, top: CANVAS_HEIGHT / 2, scaleX: scale, scaleY: scale, selectable: false, evented: false } as any); 
            canvas.add(img);
            canvas.moveObjectTo(img, 0);
            canvas.renderAll();
        } catch (e) {}
    };

    const setupTextEditor = (obj: Textbox) => {
        setActiveTextObj(obj);
        setTextInput(obj.text || '');
        setFontSize(obj.fontSize || 120);
        setTextColor(obj.fill as string || '#000000');
        setTextWidth(obj.width || CANVAS_WIDTH * 0.9); // Re-added width initialization
    };

    const closeTextEditor = () => setActiveTextObj(null);

    const initEditor = useCallback(async () => {
        if (!canvasElRef.current || !containerRef.current) return;
        setDisplayScale(containerRef.current.clientWidth / CANVAS_WIDTH);
        if (!canvasRef.current) {
            canvasRef.current = new Canvas(canvasElRef.current, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, preserveObjectStacking: true });
            
            canvasRef.current.on('selection:created', (e) => {
                const obj = e.selected?.[0];
                if (obj) {
                    if (obj instanceof Textbox) setupTextEditor(obj as Textbox);
                    setIsLocked(!!obj.lockMovementX);
                }
            });
            
            canvasRef.current.on('selection:updated', (e) => {
                const obj = e.selected?.[0];
                if (obj) {
                    if (obj instanceof Textbox) setupTextEditor(obj as Textbox);
                    else closeTextEditor();
                    setIsLocked(!!obj.lockMovementX);
                }
            });
            
            canvasRef.current.on('selection:cleared', () => {
                closeTextEditor();
                setIsLocked(false);
            });

            const upperEl = canvasRef.current.upperCanvasEl;
            upperEl.addEventListener('touchstart', (e: TouchEvent) => {
                if (e.touches.length === 2) {
                    const activeObj = canvasRef.current?.getActiveObject();
                    if (activeObj && !activeObj.lockScalingX) pinchState.current = { distance: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY), scaleX: activeObj.scaleX || 1, scaleY: activeObj.scaleY || 1 };
                }
            }, { passive: false });

            upperEl.addEventListener('touchmove', (e: TouchEvent) => {
                if (e.touches.length === 2 && pinchState.current) {
                    e.preventDefault();
                    const activeObj = canvasRef.current?.getActiveObject();
                    if (activeObj && !activeObj.lockScalingX) {
                        const scale = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY) / pinchState.current.distance;
                        activeObj.set({ scaleX: pinchState.current.scaleX * scale, scaleY: pinchState.current.scaleY * scale });
                        canvasRef.current?.requestRenderAll();
                    }
                }
            }, { passive: false });

            const endPinch = () => { pinchState.current = null; };
            upperEl.addEventListener('touchend', endPinch);
            upperEl.addEventListener('touchcancel', endPinch);
        }
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            const savedData = localStorage.getItem('quote_editor_quick_save');
            if (savedData) {
                try {
                    const { template, canvas } = JSON.parse(savedData);
                    await canvasRef.current.loadFromJSON(canvas);
                    canvasRef.current.getObjects().forEach(obj => { if (obj instanceof Textbox) obj.set({ editable: false }); });
                    canvasRef.current.renderAll();
                    if (template) setActiveTemplate(template);
                    setIsLoading(false);
                    return;
                } catch (e) { localStorage.removeItem('quote_editor_quick_save'); }
            }
        }
        canvasRef.current.clear();
        await loadTemplateToCanvas(canvasRef.current, activeTemplate);
        setIsLoading(false);
    }, [activeTemplate]);

    useEffect(() => {
        initEditor();
        const handleResize = () => { if (containerRef.current) setDisplayScale(containerRef.current.clientWidth / CANVAS_WIDTH); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [initEditor]);

    const handleTemplateChange = async (url: string) => {
        if (window.confirm("Changing the template will reset your current design. Are you sure?")) {
            localStorage.removeItem('quote_editor_quick_save');
            setIsLoading(true);
            setActiveTemplate(url);
            setShowTemplates(false);
        }
    };

    const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !canvasRef.current) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            if (ev.target?.result) {
                const img = await FabricImage.fromURL(ev.target.result as string);
                const scale = Math.max(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
                img.set({ originX: 'center', originY: 'center', left: CANVAS_WIDTH / 2, top: CANVAS_HEIGHT / 2, scaleX: scale, scaleY: scale });
                canvasRef.current!.add(img);
                canvasRef.current!.moveObjectTo(img, 0);
                canvasRef.current!.renderAll();
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const openCropper = async (dataUrl: string) => {
        setShowCropper(true);
        setCropZoom(1);
        setTimeout(async () => {
            if (!cropCanvasElRef.current) return;
            
            cropSizeRef.current = Math.min(window.innerWidth - 40, 800);
            const CROP_SIZE = cropSizeRef.current;
            
            if (!cropCanvasRef.current) {
                cropCanvasRef.current = new Canvas(cropCanvasElRef.current, { width: window.innerWidth, height: window.innerHeight * 0.7, selection: false, backgroundColor: '#000', preserveObjectStacking: true });
                const upperEl = cropCanvasRef.current.upperCanvasEl;
                upperEl.addEventListener('touchstart', (e: TouchEvent) => {
                    if (e.touches.length === 2 && cropImageObjRef.current) cropPinchState.current = { distance: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY), scaleX: cropImageObjRef.current.scaleX || 1, scaleY: cropImageObjRef.current.scaleY || 1 };
                }, { passive: false });
                upperEl.addEventListener('touchmove', (e: TouchEvent) => {
                    if (e.touches.length === 2 && cropPinchState.current && cropImageObjRef.current) {
                        e.preventDefault();
                        const scale = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY) / cropPinchState.current.distance;
                        const newScaleX = cropPinchState.current.scaleX * scale;
                        const newScaleY = cropPinchState.current.scaleY * scale;
                        cropImageObjRef.current.set({ scaleX: newScaleX, scaleY: newScaleY });
                        cropCanvasRef.current?.requestRenderAll();
                        setCropZoom(newScaleX / (cropSizeRef.current / Math.min(cropImageObjRef.current.width, cropImageObjRef.current.height)));
                    }
                }, { passive: false });
                const endPinch = () => { cropPinchState.current = null; };
                upperEl.addEventListener('touchend', endPinch);
                upperEl.addEventListener('touchcancel', endPinch);
            }
            const cropCanvas = cropCanvasRef.current;
            cropCanvas.clear();
            const img = await FabricImage.fromURL(dataUrl);
            setCropImageObj(img);
            cropImageObjRef.current = img;
            const minScale = CROP_SIZE / Math.min(img.width, img.height);
            img.set({ scaleX: minScale, scaleY: minScale, left: cropCanvas.width / 2, top: cropCanvas.height / 2, originX: 'center', originY: 'center', hasControls: false, hasBorders: false, hoverCursor: 'grab', moveCursor: 'grabbing' });
            cropCanvas.add(img);
            cropCanvas.moveObjectTo(img, 0);
            const cx = cropCanvas.width / 2;
            const cy = cropCanvas.height / 2;
            const maskPath = new Path(`M 0 0 H ${cropCanvas.width} V ${cropCanvas.height} H 0 Z M ${cx} ${cy - CROP_SIZE/2} A ${CROP_SIZE/2} ${CROP_SIZE/2} 0 1 0 ${cx} ${cy + CROP_SIZE/2} A ${CROP_SIZE/2} ${CROP_SIZE/2} 0 1 0 ${cx} ${cy - CROP_SIZE/2} Z`, { fill: 'rgba(0,0,0,0.7)', selectable: false, evented: false, fillRule: 'evenodd' });
            const guideCircle = new Circle({ left: cx, top: cy, radius: CROP_SIZE / 2, originX: 'center', originY: 'center', fill: 'transparent', stroke: '#2563eb', strokeWidth: 5, selectable: false, evented: false });
            cropCanvas.add(maskPath, guideCircle);
            cropCanvas.setActiveObject(img);
            cropCanvas.renderAll();
        }, 100);
    };

    const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => { if (ev.target?.result) openCropper(ev.target.result as string); };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const zoom = parseFloat(e.target.value);
        setCropZoom(zoom);
        if (cropImageObjRef.current && cropCanvasRef.current) {
            const baseScale = cropSizeRef.current / Math.min(cropImageObjRef.current.width, cropImageObjRef.current.height);
            cropImageObjRef.current.set({ scaleX: baseScale * zoom, scaleY: baseScale * zoom });
            cropCanvasRef.current.renderAll();
        }
    };

    const applyCrop = async () => {
        if (!cropCanvasRef.current || !cropImageObjRef.current || !canvasRef.current) return;
        const cropCanvas = cropCanvasRef.current;
        const cx = cropCanvas.width / 2;
        const cy = cropCanvas.height / 2;
        const CROP_SIZE = cropSizeRef.current;
        
        cropCanvas.getObjects().forEach(obj => { if (obj !== cropImageObjRef.current) obj.visible = false; });
        const croppedData = cropCanvas.toDataURL({ left: cx - CROP_SIZE / 2, top: cy - CROP_SIZE / 2, width: CROP_SIZE, height: CROP_SIZE, multiplier: 2 });
        const img = await FabricImage.fromURL(croppedData);
        const radius = img.width / 2;
        img.set({ clipPath: new Circle({ radius, originX: 'center', originY: 'center' }), originX: 'center', originY: 'center' });
        const border = new Circle({ radius, fill: 'transparent', stroke: '#fff', strokeWidth: 30, originX: 'center', originY: 'center' });
        const group = new Group([img, border], { left: CANVAS_WIDTH / 2, top: CANVAS_HEIGHT / 2, originX: 'center', originY: 'center', cornerColor: '#2563eb', cornerSize: 60, transparentCorners: false });
        group.scaleToWidth(CANVAS_WIDTH * 0.4);
        canvasRef.current.add(group);
        canvasRef.current.bringObjectToFront(group);
        canvasRef.current.setActiveObject(group);
        canvasRef.current.renderAll();
        setShowCropper(false);
    };

    const addTextObject = (defaultText: string, fill: string, topOffset: number, size: number) => {
        if (!canvasRef.current) return;
        const defaultWidth = CANVAS_WIDTH * 0.9;
        const text = new Textbox(defaultText, { left: CANVAS_WIDTH / 2, top: (CANVAS_HEIGHT / 2) + topOffset, width: defaultWidth, fill, fontSize: size, originX: 'center', originY: 'center', textAlign: 'center', fontWeight: 'bold', cornerColor: '#2563eb', cornerSize: 60, transparentCorners: false, splitByGrapheme: false, editable: false });
        text.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false });
        canvasRef.current.add(text);
        canvasRef.current.setActiveObject(text);
    };

    const updateText = (val: string) => { setTextInput(val); if (activeTextObj && canvasRef.current) { activeTextObj.set({ text: val }); canvasRef.current.requestRenderAll(); } };
    const updateFontSize = (e: React.ChangeEvent<HTMLInputElement>) => { const val = parseInt(e.target.value); setFontSize(val); if (activeTextObj && canvasRef.current) { activeTextObj.set({ fontSize: val }); canvasRef.current.requestRenderAll(); } };
    const updateColor = (color: string) => { setTextColor(color); if (activeTextObj && canvasRef.current) { activeTextObj.set({ fill: color }); canvasRef.current.requestRenderAll(); } };
    
    // Re-added Text Width handler
    const updateTextWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        const safeWidth = Math.min(val, CANVAS_WIDTH);
        setTextWidth(safeWidth);
        if (activeTextObj && canvasRef.current) {
            activeTextObj.set({ width: safeWidth });
            canvasRef.current.requestRenderAll();
        }
    };

    const centerText = () => { if (activeTextObj && canvasRef.current) { activeTextObj.set({ left: CANVAS_WIDTH / 2, originX: 'center' }); canvasRef.current.renderAll(); } };
    const downloadImage = () => { if (!canvasRef.current) return; canvasRef.current.discardActiveObject(); canvasRef.current.renderAll(); const link = document.createElement('a'); link.download = 'quote-design.png'; link.href = canvasRef.current.toDataURL({ format: 'png', multiplier: 1 }); link.click(); };
    const copyImage = async () => { if (!canvasRef.current) return; canvasRef.current.discardActiveObject(); canvasRef.current.renderAll(); try { const blob = await (await fetch(canvasRef.current.toDataURL({ format: 'png', multiplier: 1 }))).blob(); await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); alert('Copied to clipboard!'); } catch (e) { alert('Copy failed.'); } };
    const shareImage = async () => { if (!canvasRef.current) return; setIsSharing(true); canvasRef.current.discardActiveObject(); canvasRef.current.renderAll(); try { const blob = await (await fetch(canvasRef.current.toDataURL({ format: 'png', multiplier: 1 }))).blob(); const file = new File([blob], 'design.png', { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Design', text: ' ' }); } else { alert('Sharing not supported.'); } } catch (e) {} setIsSharing(false); };

    const handleQuickSave = useCallback(() => {
        if (!canvasRef.current) return;
        canvasRef.current.discardActiveObject();
        canvasRef.current.renderAll();
        closeTextEditor();
        const canvasState = canvasRef.current.toObject(['name', 'selectable', 'evented', 'lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY', 'hasControls']);
        const payload = { template: activeTemplate, canvas: canvasState, timestamp: new Date().toISOString() };
        localStorage.setItem('quote_editor_quick_save', JSON.stringify(payload));
        showStatus('Quote and Speaker name is saved if any');
    }, [activeTemplate, showStatus]);

    const handleReset = async () => {
        if (!canvasRef.current) return;
        localStorage.removeItem('quote_editor_quick_save');
        setIsLoading(true);
        canvasRef.current.clear();
        closeTextEditor();
        await loadTemplateToCanvas(canvasRef.current, activeTemplate);
        setIsLoading(false);
        showStatus('Editor reset is done except default template.');
    };

    const handleDelete = useCallback(() => {
        if (!canvasRef.current) return;
        const activeObjects = canvasRef.current.getActiveObjects();
        if (activeObjects.length) {
            activeObjects.forEach(obj => { if ((obj as any).name !== 'template') canvasRef.current?.remove(obj); });
            canvasRef.current.discardActiveObject();
            canvasRef.current.requestRenderAll();
            closeTextEditor();
            showStatus('Object deleted');
        }
    }, [showStatus]);

    const handleLockToggle = useCallback(() => {
        if (!canvasRef.current) return;
        const activeObj = canvasRef.current.getActiveObject();
        if (!activeObj) {
            showStatus('Select an object to lock/unlock');
            return;
        }
        const newLockedState = !isLocked;
        activeObj.set({
            lockMovementX: newLockedState,
            lockMovementY: newLockedState,
            lockRotation: newLockedState,
            lockScalingX: newLockedState,
            lockScalingY: newLockedState,
            hasControls: !newLockedState
        });
        canvasRef.current.requestRenderAll();
        setIsLocked(newLockedState);
        showStatus(newLockedState ? 'Object locked' : 'Object unlocked');
    }, [isLocked, showStatus]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quote Editor - App Name" />
            <div className="mx-auto w-full max-w-3xl flex-1 p-2 md:p-8 flex flex-col items-center dark:bg-gray-900 min-h-screen relative">
                <div className="w-full text-center py-1 min-h-[28px] mb-1">
                    {statusMsg && <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate animate-pulse px-2">{statusMsg}</p>}
                </div>
                <div className="w-full flex justify-between items-center mb-4 min-h-[40px]">
                    <div className="flex items-center gap-3">
                        <button onClick={handleReset} title="Reset" className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                        <button onClick={handleDelete} title="Delete Selected" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-700 active:scale-95 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleLockToggle} title={isLocked ? "Unlock" : "Lock"} className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-95 shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${isLocked ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400 text-white' : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white'}`}>
                            {isLocked ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                            )}
                        </button>
                        <button onClick={handleQuickSave} title="Save" className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </button>
                    </div>
                </div>
                {isLoading && <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-gray-950/90 dark:text-white font-bold">Initializing...</div>}
                {isSharing && <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-gray-950/90 dark:text-white font-bold">Preparing...</div>}
                <EditorToolbar onTheme={() => setShowTemplates(true)} onBg={() => fileInputRef.current?.click()} onImg={() => portraitInputRef.current?.click()} onQuote={() => addTextObject('Enter Quote', '#e11d48', -200, 120)} onName={() => addTextObject('— Name', '#ffffff', 300, 80)} onCopy={copyImage} onSave={downloadImage} onPost={shareImage} bgRef={fileInputRef} imgRef={portraitInputRef} onBgUpload={handleBgUpload} onImgUpload={handlePortraitUpload} />
                <CanvasWorkspace containerRef={containerRef} canvasElRef={canvasElRef} displayScale={displayScale} canvasWidth={CANVAS_WIDTH} canvasHeight={CANVAS_HEIGHT} />
                {showTemplates && <TemplateSelectorModal templates={TEMPLATES} activeTemplate={activeTemplate} onSelect={handleTemplateChange} onClose={() => setShowTemplates(false)} />}
                
                {/* CORRECTED: Props added back in for textWidth, maxCanvasWidth, and onWidth */}
                {activeTextObj && <TextPropertiesPanel textColor={textColor} fontSize={fontSize} textInput={textInput} textWidth={textWidth} maxCanvasWidth={CANVAS_WIDTH} onColor={updateColor} onSize={updateFontSize} onText={updateText} onWidth={updateTextWidth} onCenter={centerText} onClose={closeTextEditor} />}
                
                {showCropper && <PortraitCropperModal canvasRef={cropCanvasElRef} zoom={cropZoom} onZoom={handleZoom} onApply={applyCrop} onCancel={() => setShowCropper(false)} />}
            </div>
        </AppLayout>
    );
}