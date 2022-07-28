import { Directive, HostListener, Input, ElementRef, Inject, Renderer2, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
    selector: '[xn-tooltip]'
})

export class XnTooltipDirective implements OnDestroy {

    constructor(private elementRef: ElementRef,
        private renderer2: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) { }

    @Input() tooltipText: string;
    @Input() tooltipPlacement: string;
    elementId: string;
    className = 'xn-tooltip xn-show xn-fade xn-tooltip-d';

    private isRemoved: boolean = false;
    @HostListener('mouseenter', ['$event']) mouseover(event) {
        this.createTooltip();
    }

    private createTooltip() {
        if (this.tooltipText && this.tooltipText.length) {
            this.removeAllElement();

            const defaultDistanceX = 5;
            const defaultHeightDivTooltip = 33;
            const positionElement = this.elementRef.nativeElement.getBoundingClientRect();
            let positionTop = Math.floor(positionElement.top);
            let positionBot = Math.floor(positionElement.bottom);
            let positionLeft = Math.floor(positionElement.left);

            let newPlacement = this.tooltipPlacement;
            if (positionTop < 30 && newPlacement == 'top') {

                newPlacement = 'bottom';
            }

            this.elementId = Math.floor(new Date().getTime()).toString();
            const div = this.renderer2.createElement('div') as HTMLParagraphElement;
            div.className = `${this.className} xn-tooltip-${newPlacement}`;
            div.id = this.elementId;

            const divArrow = this.renderer2.createElement('div') as HTMLParagraphElement;
            divArrow.className = 'xn-tooltip-arrow';

            const divInner = this.renderer2.createElement('div') as HTMLParagraphElement;
            divInner.className = 'xn-tooltip-inner';
            divInner.innerHTML = this.tooltipText;

            div.appendChild(divArrow);
            div.appendChild(divInner);

            this.document.body.appendChild(div);

            //console.log('elment-mouseenter: ' + this.elementId);
            const that = this;
            div.addEventListener("mouseenter", function () {
                if (that.isRemoved) {
                    //console.log('div-mouseenter');
                    that.isRemoved = false;
                    that.createTooltip();
                }
            });
            div.addEventListener("mouseleave", function () {
                //console.log('div-mouseleave');
                that.removeElement();
            });
            div.addEventListener("blur", function () {
                //console.log('div-blur');
                that.removeElement();
            });

            let positionLeftDivArrow = -1;
            switch (newPlacement) {
                case 'top':
                    positionTop -= div.offsetHeight;
                    positionLeft -= ((div.offsetWidth / 2) - (this.elementRef.nativeElement.offsetWidth / 2));

                    if (positionTop < 0) positionTop = 0;
                    if (positionLeft < 0) {
                        positionLeftDivArrow = positionLeft;
                        positionLeft = 0;
                    }

                    div.setAttribute('style', `top: ${positionTop}px; left: ${positionLeft}px;`);

                    let remaining = div.offsetHeight - defaultHeightDivTooltip;
                    if (remaining > 0) {
                        positionLeftDivArrow = remaining;
                        remaining += 10;
                        div.setAttribute('style', `top: ${positionTop}px; left: ${positionLeft - remaining}px;`);
                    }

                    if (positionLeftDivArrow > 0)
                        divArrow.setAttribute('style', `left: calc(50% + ${remaining}px);`);
                    break;
                case 'bottom':
                    positionLeft -= ((div.offsetWidth / 2) - (this.elementRef.nativeElement.offsetWidth / 2));

                    if (positionBot < 0) positionBot = 0;
                    if (positionLeft < 0) {
                        divArrow.setAttribute('style', `left: calc(50% + ${positionLeft}px);`);
                        positionLeft = 0;
                    }

                    div.setAttribute('style', `top: ${positionBot}px; left: ${positionLeft}px;`);
                    break;
                case 'left':
                    positionLeft -= div.offsetWidth;

                    if (positionTop < 0) positionTop = 0;
                    if (positionLeft < 0) positionLeft = 0;

                    div.setAttribute('style', `top: ${positionTop}px; left: ${positionLeft}px;`);
                    break;
                case 'right':
                    positionLeft += (defaultDistanceX + this.elementRef.nativeElement.offsetWidth);

                    if (positionTop < 0) positionTop = 0;
                    if (positionLeft < 0) positionLeft = 0;

                    div.setAttribute('style', `top: ${positionTop}px; left: ${positionLeft}px;`);
                    break;
                default:
                    positionTop -= div.offsetHeight;
                    positionLeft -= ((div.offsetWidth / 2) - (this.elementRef.nativeElement.offsetWidth / 2));

                    if (positionTop < 0) positionTop = 0;
                    if (positionLeft < 0) positionLeft = 0;

                    div.setAttribute('style', `top: ${positionTop}px; left: ${positionLeft}px;`);
                    break;
            }
        }
    }

    removeElement() {
        const element = this.document.getElementById(this.elementId);
        if (element) {
            //console.log('elment-remove: ' + this.elementId);
            this.isRemoved = true;
            element.remove();
        }
    }
    removeAllElement() {
        $('.xn-tooltip-d').remove();
        //const elements = this.document.getElementsByClassName(this.className);
        //if (elements.length) {
        //    elements[0].parentNode.removeChild(elements[0]);
        //}
    }

    @HostListener('mouseleave', ['$event']) mouseleave(event) {
        this.removeElement();
    }

    @HostListener('blur', ['$event']) focusOut(event): void {
        this.removeElement();
    }

    ngOnDestroy() {
        //console.log('removeAllElement');
        this.removeAllElement();
        this.elementRef.nativeElement.removeEventListener('mouseenter', this.mouseover);
        this.elementRef.nativeElement.removeEventListener('mouseleave', this.mouseleave);
        this.elementRef.nativeElement.removeEventListener('blur', this.focusOut);
    }
}

