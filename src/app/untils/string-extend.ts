
export class stringExtend extends String {
    like(value: string) {
        return (new RegExp(value, 'i')).test(this.valueOf());
    }
    left(n: number) {
        return this.slice(0, n);
    }
    right(n: number) {
        return this.slice(this.length - n);
    }
    static isNullOrEmpty(value: string) {
        return value == null || value == undefined || value.length == 0;
    }
    static isNotNullOrEmpty(value: string) {
        return !this.isNullOrEmpty;
    }
    static isBlank(value: string) {
        let regEx = /^\s+$/g;
        return String.isNullOrEmpty(value) || value.search(regEx) > -1;
    }
    static isNotBlank(value: string) {
        return !this.isBlank;
    }

    get GetFileName() {
        let url = this.valueOf();
        let res = /\/?((?:[^\.^\/]*\.)+(?:[^\.\?;]+))([\?;].*)*$/g.exec(url);
        let filename = res != null ? res[1] : '';
        if (filename) return filename;

        let regEx = /^.*\/([^\/\?]*).*$/;
        return this.replace(regEx, '$1').replace(/([\?\;].*)*$/, "");;
    }

    get GetExtensionName() {
        let url = this.valueOf();
        let res = /\/?[^\.\/]*\.([^\.\?;]+)([\?;].*)*$/g.exec(url);
        let extName = res != null ? res[1] : '';
        if (extName)
            return "." + extName;

        let regEx = /^.*\/[^\/]*(\.[^\.\?]*).*$/;
        let ext = this.replace(regEx, '$1');
        let srcStr = this.valueOf();
        if ((ext != srcStr || (ext == srcStr && srcStr[0] == ".")) && ext != "." && ext[0] == ".")
            return ext.replace(/([\?\;].*)*$/, "");
        if (ext == srcStr) {
            let splitVals = srcStr.split(".");
            if (splitVals.length == 2) {
                return "." + splitVals[1].replace(/([\?\;].*)*$/, "");
            }
        }
        return "";
    }
    get hasExtensionName() {
        return String.isNotNullOrEmpty(this.GetExtensionName);
    }

    _testprop: string;
    get testprop() {
        return this._testprop;
    }
    set testprop(value: string) {
        this._testprop = value;
    }

    static _testStaticProp: string;
    static get testStaticProp() {
        return this._testStaticProp;
    }
    static set testStaticProp(value: string) {
        this._testStaticProp = value;
    }

}