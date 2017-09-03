import { Component, ViewChild, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export interface accordionMenuItem {
    menuItemTitle: string;
    childs: accordionMenuItem[];
    isOpen: boolean;

}

@Component({
    moduleId: module.id,
    selector: 'x-accordion-menu',
    templateUrl: 'accordion-menu.component.html',
    styleUrls: ['accordion-menu.component.css']
})
export class AccordionMenuComponent implements OnInit, AfterViewInit {
    ngAfterViewInit(): void {
        // let links = this.hostElementRef.nativeElement.querySelectorAll("div.link");
        // Observable.fromEvent(links, 'click')
        //     .subscribe((event: MouseEvent) => {
        //         event.preventDefault();
        //     });
        let alinks = this.hostElementRef.nativeElement.querySelectorAll("a");
        Observable.fromEvent(alinks, 'click')
            .subscribe((event: MouseEvent) => {
                event.preventDefault();
            });
    }
    items: accordionMenuItem[] = [
        {
            menuItemTitle: "aaa",
            isOpen: false,
            childs: [{
                menuItemTitle: "aaa",
                isOpen: false,
                childs: []
            },
            {
                menuItemTitle: "aaa",
                isOpen: false,
                childs: []
            },
            {
                menuItemTitle: "aaa",
                isOpen: false,
                childs: []
            }]
        },
        {
            menuItemTitle: "bbb",
            isOpen: false,
            childs: [{
                menuItemTitle: "aaa",
                isOpen: false,
                childs: []
            }
            ]
        }
    ];

    dropdown(event: any, item: accordionMenuItem) {
        if (!this.multiple && this.current && this.current != item) {
            this.current.isOpen = false;
        }
        if (this.current != item) this.current = item;
        this.current.isOpen = !this.current.isOpen;
    }

    ngOnInit(): void {

    }

    @ViewChild("accordionmenu") elementRef: ElementRef;
    @Input() multiple: boolean = false;

    current: accordionMenuItem;

    constructor(private hostElementRef: ElementRef) {

    }
    // $(function() {
    //     var Accordion = function(el, multiple) {
    //         this.el = el || {};
    //         this.multiple = multiple || false;

    //         // Variables privadas
    //         var links = this.el.find('.link');
    //         // Evento
    //         links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown)
    //     }

    //     Accordion.prototype.dropdown = function(e) {
    //         var $el = e.data.el;
    //         $this = $(this),
    //             $next = $this.next();

    //         $next.slideToggle();
    //         $this.parent().toggleClass('open');

    //         if (!e.data.multiple) {
    //             $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
    //         };
    //     }

    //     var accordion = new Accordion($('#accordion'), false);
    // });


}
