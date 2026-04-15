import { useEffect, useRef, MutableRefObject } from 'react';
import type { Chart as ChartJS } from 'chart.js';

export type DragHandler = (dataIndex: number, nextValue: number) => void;

/**
 * Attaches mouse/touch drag listeners to a Chart.js canvas so users can
 * directly manipulate data points by dragging them vertically (or
 * horizontally for horizontal bar charts). Each dataset is assigned a
 * handler; datasets without a handler stay read-only.
 *
 * The handler receives the period index and the new numeric value (already
 * rounded and clamped to >= 0) and is expected to persist it back to the
 * data store. Chart.js re-renders automatically when the store updates.
 */
export function useChartDragEditor(
  chartRef: MutableRefObject<ChartJS | null>,
  datasetHandlers: Array<DragHandler | null>,
  enabled = true
) {
  const handlersRef = useRef(datasetHandlers);
  handlersRef.current = datasetHandlers;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const canvas = chart.canvas;
    // Expose the Chart.js instance on the canvas element so the parent
    // chart component or integration tests can grab it via a DOM query.
    (canvas as unknown as { _chartInstance: typeof chart })._chartInstance = chart;

    let dragging: { datasetIndex: number; dataIndex: number } | null = null;

    const getPoint = (ev: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top,
      };
    };

    const findElement = (ev: MouseEvent | Touch, strict: boolean) => {
      const c = chartRef.current;
      if (!c) return null;
      const fake: MouseEvent =
        ev instanceof MouseEvent
          ? ev
          : (new MouseEvent('mousemove', {
              clientX: ev.clientX,
              clientY: ev.clientY,
            }) as MouseEvent);
      // Strict mode (mousedown): require the click to actually intersect
      // a drawn element. Loose mode (hover): find the nearest element
      // along the category axis so the cursor affordance updates as the
      // pointer sweeps across the chart.
      const els = c.getElementsAtEventForMode(
        fake,
        'nearest',
        strict ? { intersect: true } : { intersect: false, axis: 'x' },
        false
      );
      if (!els.length) return null;
      const el = els[0];
      return { datasetIndex: el.datasetIndex, dataIndex: el.index };
    };

    const applyValue = (datasetIndex: number, dataIndex: number, px: number, py: number) => {
      const c = chartRef.current;
      if (!c) return;
      const dataset = c.data.datasets[datasetIndex] as { xAxisID?: string; yAxisID?: string };
      const horizontal = (c.options as { indexAxis?: 'x' | 'y' }).indexAxis === 'y';
      const scaleId =
        (horizontal ? dataset?.xAxisID : dataset?.yAxisID) ?? (horizontal ? 'x' : 'y');
      const scale = c.scales[scaleId];
      if (!scale) return;
      const raw = scale.getValueForPixel(horizontal ? px : py);
      if (raw === undefined || Number.isNaN(raw)) return;
      const next = Math.max(0, Math.round(Number(raw) / 50) * 50);
      const handler = handlersRef.current[datasetIndex];
      handler?.(dataIndex, next);
    };

    const onDown = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      const found = findElement(e, true);
      if (!found) return;
      if (!handlersRef.current[found.datasetIndex]) return;
      dragging = found;
      canvas.style.cursor = 'grabbing';
      canvas.setAttribute('data-dragging', 'true');
      e.preventDefault();
      e.stopPropagation();
    };

    const onMove = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      if (!dragging) {
        const found = findElement(e, true);
        if (found && handlersRef.current[found.datasetIndex]) {
          canvas.style.cursor = 'grab';
        } else {
          canvas.style.cursor = '';
        }
        return;
      }
      const { x, y } = getPoint(e);
      applyValue(dragging.datasetIndex, dragging.dataIndex, x, y);
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = null;
      canvas.style.cursor = '';
      canvas.removeAttribute('data-dragging');
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!enabledRef.current) return;
      const t = e.touches[0];
      if (!t) return;
      const found = findElement(t, true);
      if (!found) return;
      if (!handlersRef.current[found.datasetIndex]) return;
      dragging = found;
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!enabledRef.current) return;
      if (!dragging) return;
      const t = e.touches[0];
      if (!t) return;
      const { x, y } = getPoint(t);
      applyValue(dragging.datasetIndex, dragging.dataIndex, x, y);
      e.preventDefault();
    };

    const onTouchEnd = () => {
      dragging = null;
    };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.style.cursor = '';
    };
  }, [chartRef]);
}
