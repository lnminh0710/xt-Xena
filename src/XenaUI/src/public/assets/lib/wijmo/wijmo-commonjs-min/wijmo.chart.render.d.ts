import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcCore from 'wijmo/wijmo';
export declare class _CanvasRenderEngine implements wjcChart.IRenderEngine {
  private _element;
  private _canvas;
  private _svgEngine;
  private _fill;
  private _stroke;
  private _textFill;
  private _strokeWidth;
  private _fontSize;
  private _fontFamily;
  private _canvasRect;
  private _canvasDefaultFont;
  private _applyCSSStyles;
  constructor(element: HTMLElement, applyCSSStyles?: boolean);
  beginRender(): void;
  endRender(): void;
  setViewportSize(w: number, h: number): void;
  readonly element: Element;
  fill: string;
  fontSize: string;
  fontFamily: string;
  stroke: string;
  strokeWidth: number;
  textFill: string;
  addClipRect(clipRect: wjcCore.Rect, id: string): void;
  drawEllipse(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    className?: string,
    style?: any
  ): any;
  drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    className?: string,
    style?: any,
    clipPath?: string
  ): any;
  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    className?: string,
    style?: any
  ): any;
  drawLines(
    xs: number[],
    ys: number[],
    className?: string,
    style?: any,
    clipPath?: string
  ): any;
  drawSplines(
    xs: number[],
    ys: number[],
    className?: string,
    style?: any,
    clipPath?: string
  ): any;
  drawPolygon(
    xs: number[],
    ys: number[],
    className?: string,
    style?: any,
    clipPath?: string
  ): any;
  drawPieSegment(
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    sweepAngle: number,
    className?: string,
    style?: any,
    clipPath?: string
  ): any;
  drawDonutSegment(
    cx: number,
    cy: number,
    radius: number,
    innerRadius: number,
    startAngle: number,
    sweepAngle: number,
    className?: string,
    style?: any,
    clipPath?: string
  ): any;
  drawString(
    s: string,
    pt: wjcCore.Point,
    className?: string,
    style?: any
  ): any;
  drawStringRotated(
    s: string,
    pt: wjcCore.Point,
    center: wjcCore.Point,
    angle: number,
    className?: string,
    style?: any
  ): any;
  measureString(
    s: string,
    className?: string,
    groupName?: string,
    style?: any
  ): wjcCore.Size;
  startGroup(
    className?: string,
    clipPath?: string,
    createTransform?: boolean
  ): any;
  endGroup(): void;
  drawImage(imageHref: string, x: number, y: number, w: number, h: number): any;
  private _applyCanvasClip;
  private _getOpacityColor(color, opacity?);
  private _applyCanvasStyles;
  private _applyColor(key, val, rect);
}
