
export class styleUntils {
    static setupStyleEl(el: any, style: string) {
        let animationStyleEl: HTMLStyleElement = document.createElement('style');
        let styleHTML = style;
        animationStyleEl.innerHTML = styleHTML;
        if (el) {
            el.appendChild(animationStyleEl);
        }
        return () => el.removeChild(animationStyleEl);
    }

    static allowUserSelect(allowSelect: boolean = false) {
        let styleHtml = ` 
        body {
          -webkit-user-select:none;
          user-select:none;
        }`;
        if (allowSelect) {
            styleHtml = ` 
        body {
          -webkit-user-select:text;
          user-select:text;
        }`;
        }
        return styleUntils.setupStyleEl(document.body, styleHtml);
    }
}