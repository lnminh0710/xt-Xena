import {
    Directive,
    ElementRef,
    Input,
    Renderer,
    Output,
    EventEmitter,
} from "@angular/core";

@Directive({
    selector: "[imageLoader]",
})
export class XnImageLoaderDirective {
    @Input() imageLoader;
    @Input() imageNameDefault = "noimage.jpg";

    @Output() loaded: EventEmitter<any> = new EventEmitter();
    private loadingDiv: any;

    constructor(private el: ElementRef, private renderer: Renderer) {
        this.loadingDiv = document.createElement("img");
        this.loadingDiv.src = "/public/assets/img/loading.gif";
        this.loadingDiv.style.position = "absolute";
        this.loadingDiv.style.height = "3px";
        this.loadingDiv.style.width = "100%";
        this.loadingDiv.style.top = "0";
        this.loadingDiv.style.left = "0";
        this.loadingDiv.style.right = "0";

        el.nativeElement.parentNode.appendChild(this.loadingDiv);
        el.nativeElement.style.display = "none";

        setTimeout(() => {
            this.loadImg();
        });
    }

    private loadImg() {
        const image = new Image();
        image.addEventListener("load", () => {
            this.el.nativeElement.style.display = "block";
            this.el.nativeElement.src = this.imageLoader;
            if (this.loadingDiv) {
                this.renderer.setElementStyle(
                    this.loadingDiv,
                    "display",
                    "none"
                );
            }
            this.loaded.emit();
        });
        image.addEventListener("error", () => {
            this.el.nativeElement.style.display = "block";
            this.el.nativeElement.src =
                "/public/assets/img/" + this.imageNameDefault;
            if (this.loadingDiv) {
                this.renderer.setElementStyle(
                    this.loadingDiv,
                    "display",
                    "none"
                );
            }
            this.loaded.emit();
        });
        image.src = this.imageLoader;
    }

    public reloadImg(imgUrl) {
        this.imageLoader = imgUrl;
        this.loadImg();
    }
}
