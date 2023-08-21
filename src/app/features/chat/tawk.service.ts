import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { Observable, Subject } from "rxjs";

declare var Tawk_API: any;

@Injectable()
export class TawkService {

    private loaded: boolean;
    private loadSubject: Subject<boolean> = new Subject<boolean>();
    private renderer: Renderer2;

    constructor(
        private rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private _document: Document,
        ) {
            this.renderer = rendererFactory.createRenderer(null, null);
            this.load();
        }

    private load(){
        if(this.loaded)
            return;

        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/601df0fda9a34e36b9745516/1etqfaoe9';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);

        if(Tawk_API){
            Tawk_API.onLoad = this.loadedEvent.bind(this);
        }
    }

    private loadedEvent(){
        this.loaded = true;
        this.loadSubject.next(this.loaded);
    }

    public UpdateTawkUser(user: any) {
        this.loadedWrapper(() => {this.updateAtrributes(user)});
    }

    private loadedWrapper(func: any){ 
        if(!this.loaded){
            var sub = this.loadSubject.asObservable().subscribe({
                next: () => {
                    func();
                    sub.unsubscribe();
                },
                error: () => {}
                });
        } else {
            func();
        }
    }

    public ExpandChatWindow(show: boolean = false){
        this.loadedWrapper(() => show ? Tawk_API.maximize() : Tawk_API.minimize());
    }

    public SetChatVisibility(show: boolean = false) {
        this.loadedWrapper(() => show ? Tawk_API.showWidget() : Tawk_API.hideWidget());
    }

    private updateAtrributes(user: any){
        Tawk_API.setAttributes({
            'name'  : `${user.firstname} ${user.lastname}`,
            'email' : user.email,
            'id'  : user.id,
        }, function(error){});
    }
}