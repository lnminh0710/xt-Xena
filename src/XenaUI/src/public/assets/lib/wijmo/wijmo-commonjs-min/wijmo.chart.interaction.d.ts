import * as wjcCore from 'wijmo/wijmo';
import * as wjcChart from 'wijmo/wijmo.chart';
export declare class _RangeSlider {
  private static _HRANGESLIDER;
  private static _VRANGESLIDER;
  private static _RANGESLIDER_DECBTN;
  private static _RANGESLIDER_INCBTN;
  private static _RANGESLIDER_RANGEHANDLE;
  private static _RANGESLIDER_MINHANDLE;
  private static _RANGESLIDER_MAXHANDLE;
  private static _RANGESLIDER_HANDLE_ACTIVE;
  private _isVisible;
  private _buttonsVisible;
  private _minScale;
  private _maxScale;
  private _seamless;
  private _rsContainer;
  private _rsEle;
  private _decBtn;
  private _incBtn;
  private _rsContent;
  private _minHandler;
  private _rangeHandler;
  private _maxHandler;
  private _wrapperSliderMousedown;
  private _wrapperDocMouseMove;
  private _wrapperDocMouseup;
  private _wrapperBtnMousedown;
  private _wrapperRangeSpaceMousedown;
  private _wrapperRangeMouseleave;
  private _isTouch;
  private _slidingInterval;
  private _rangeSliderRect;
  private _isHorizontal;
  private _isBtnMousedown;
  private _needSpaceClick;
  private _hasButtons;
  private _movingEle;
  private _movingOffset;
  private _range;
  private _plotBox;
  private _startPt;
  _minPos: number;
  _maxPos: number;
  constructor(
    container: HTMLElement,
    needSpaceClick: boolean,
    hasButtons?: boolean,
    options?: any
  );
  buttonsVisible: boolean;
  isHorizontal: boolean;
  isVisible: boolean;
  minScale: number;
  maxScale: number;
  seamless: boolean;
  rangeChanged: wjcCore.Event;
  onRangeChanged(e?: wjcCore.EventArgs): void;
  rangeChanging: wjcCore.Event;
  onRangeChanging(e?: wjcCore.EventArgs): void;
  readonly _isSliding: boolean;
  readonly _handleWidth: number;
  private _createSlider(container);
  private _switchEvent(isOn);
  private _onSliderMousedown(e);
  private _onDocMouseMove(e);
  private _onMove(mvPt);
  private _onDocMouseup(e);
  private _onRangeSpaceMousedown(e);
  private _onRangeMouseleave(e);
  private _onBtnMousedown(e);
  _refresh(rsRect?: any): void;
  private _updateElesPosition();
  private _refreshSlider(minCss, rangeCss, maxCss);
  private _invalidate();
  private _changeRange(offset);
  private _doSliding(offset, pt?);
  private _setSlidingInterval(offset, pt?);
  private _clearInterval();
  private _getRsRect();
}
export declare enum Orientation {
  X = 0,
  Y = 1,
}
export declare class RangeSelector {
  private _isVisible;
  private _min;
  private _max;
  private _orientation;
  private _seamless;
  private _minScale;
  private _maxScale;
  private _chart;
  private _rangeSelectorEle;
  private _rangeSlider;
  constructor(chart: wjcChart.FlexChartCore, options?: any);
  isVisible: boolean;
  min: number;
  max: number;
  orientation: Orientation;
  seamless: boolean;
  minScale: number;
  maxScale: number;
  remove(): void;
  rangeChanged: wjcCore.Event;
  onRangeChanged(e?: wjcCore.EventArgs): void;
  private _createRangeSelector();
  private _switchEvent(isOn);
  private _refresh();
  private _adjustMinAndMax();
  private _updateMinAndMaxWithScale(fireEvent);
  private _changeRange();
  private _updateRange();
  private _getMinAndMax();
}
export declare enum MouseAction {
  Zoom = 0,
  Pan = 1,
}
export declare enum InteractiveAxes {
  X = 0,
  Y = 1,
  XY = 2,
}
export declare class ChartGestures {
  static _CSS_ZOOM: string;
  static _CSS_ZOOM_OVERLAY: string;
  static _CSS_PANABLE: string;
  static _CSS_TOUCH_DISABLED: string;
  static _CSS_BLOCK_INTERACTION: string;
  private _chart;
  private _zoomEle;
  private _overlayEle;
  private _zoomEleOffset;
  private _wrapperMousedown;
  private _wrapperMouseMove;
  private _wrapperMouseup;
  private _wrapperPointerdown;
  private _wrapperPointerMove;
  private _wrapperPointerup;
  private _wrapperTouchStart;
  private _wrapperTouchMove;
  private _wrapperTouchEnd;
  private _wrapperMouseWheel;
  private _plotBox;
  private _startFirstPt;
  private _minX;
  private _maxX;
  private _minY;
  private _maxY;
  private _seriesGroup;
  private _threadHold;
  private _scaling;
  private _panning;
  private _startDistance;
  private _clip;
  private _selection;
  private _startPointers;
  private _mvPointers;
  private _plotOffset;
  private _endPoint;
  private _pinchStartEvents;
  private _minXRange;
  private _minYRange;
  private _innerUpdating;
  private _lastMinX;
  private _lastMaxX;
  private _lastMinY;
  private _lastMaxY;
  private _mouseAction;
  private _interactiveAxes;
  private _enable;
  private _scaleX;
  private _scaleY;
  private _posX;
  private _posY;
  constructor(chart: wjcChart.FlexChartCore, options?: any);
  mouseAction: MouseAction;
  interactiveAxes: InteractiveAxes;
  enable: boolean;
  scaleX: number;
  scaleY: number;
  posX: number;
  posY: number;
  remove(): void;
  reset(): void;
  _refreshChart(): void;
  private _initialize();
  private _switchEvent(isOn);
  private _refresh();
  private _onMousedown(e);
  private _onMouseMove(e);
  private _onMouseup(e);
  private _onMouseWheel(e);
  private _mouseDown(e);
  private _mouseMove(e);
  private _mouseup(e);
  private _onPointerdown(e);
  private _onPointerMove(e);
  private _onPointerup(e);
  private _pointerDown(e);
  private _pointerMove(e);
  private _pointerUp(e);
  private _onTouchStart(e);
  private _onTouchMove(e);
  private _onTouchEnd(e);
  private _initOverlay();
  private _updateOverLay(mvPt);
  _updatePoint(mvPt: wjcCore.Point): void;
  _pointInPlotArea(mvPt: wjcCore.Point): boolean;
  private _zoomedChart(endPt);
  private _zoomedAxis(endPt, isX);
  private _panningChart(distanceX, distanceY);
  private _pannedChart(distanceX, distanceY);
  private _scalingChart(scale, offset);
  private _scaledChart(e);
  private _updateAxisByDistance(isX, distance);
  private _updateAxisByChg(isX, chgMin, chgMax);
  private _initAxisRangeWithPosAndScale(isX);
  private _updateAxisRange(axis, tMin, tMax);
  private _reset();
  private _getAxisMin(axis);
  private _getAxisMax(axis);
  private _getTransFormGroups();
  private _disabledOthersInteraction(disabled);
  private _getPoint(e);
  private _getTouchPair(event);
  private _touchDistance(event);
}
