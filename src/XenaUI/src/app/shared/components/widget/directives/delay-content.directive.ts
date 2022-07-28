import { Directive, HostListener, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';

@Directive({
    selector: '[delaycontent]'
})

export class DelayContentDirective implements OnInit, OnDestroy {

    constructor(
        private elementRef: ElementRef
    ) {
    }

    @Input() set delaycontent(delaycontent: number) {
        if (!this.elementRef.nativeElement) return;

        setTimeout(() => {
            $(this.elementRef.nativeElement).removeClass('hidden');
        }, delaycontent || 1000)

    }

    ngOnInit() {

    }

    ngOnDestroy() {
    }

}

