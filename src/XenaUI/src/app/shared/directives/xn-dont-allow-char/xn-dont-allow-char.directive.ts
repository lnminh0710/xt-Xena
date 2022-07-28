import { Directive, ElementRef, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Directive({
    selector: '[xn-dont-allow-char]'
})
export class XnDontAllowCharDirective implements OnInit, OnDestroy {
    @Input('xn-dont-allow-char') dontAllowChar: string;

    constructor(private el: ElementRef,
        private ref: ChangeDetectorRef) {}

    public ngOnInit() {
        if (!this.dontAllowChar || !this.dontAllowChar.length) return;
        $(this.el.nativeElement).on('keydown', (e) => {
            this.onKeydown(e);
        });
        $(this.el.nativeElement).on('change', (e) => {
            this.onChange();
            this.ref.markForCheck();
            this.ref.detectChanges();
        });
    }

    public ngOnDestroy() {
        if (!this.dontAllowChar || !this.dontAllowChar.length) return;
        $(this.el.nativeElement).off('keydown');
        $(this.el.nativeElement).off('change');
    }

    /* Private methods */

    private onKeydown(e) {
        if (this.dontAllowChar.indexOf(e.key) === -1) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
    }

    private onChange() {
        this.el.nativeElement.value = (this.removeDontAllowChar(this.el.nativeElement.value));
    }

    private removeDontAllowChar(text: string): string {
        const textArr = text.split('');
        for (let char of textArr) {
            if (this.dontAllowChar.indexOf(char) === -1) continue;
            text = text.replace(char, '');
        }
        return text;
    }
}
