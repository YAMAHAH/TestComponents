export function isPDFPluginInstall() {
    if (!isIE()) { //ie 浏览器 和  非ie浏览器支持
        // not ie  
        if (navigator.plugins && navigator.plugins.length) // / Adobe Reader | Adobe PDF | Acrobat | Chrome PDF Viewer
            for (var i = 0; i < navigator.plugins.length; i++) {
                var plugin = navigator.plugins[i].name;
                if (plugin == 'Adobe Reader' || plugin == 'Adobe PDF' || plugin == 'Acrobat' || plugin == 'Chrome PDF Viewer') return true;
            }
        return false;
    } else {
        // ie
        var isInstalled = false;
        // var version = null;

        // var control = null;
        // try {
        //     control = new ActiveXObject('AcroPDF.PDF');
        // } catch (e) {
        //     alert(e);
        // }
        // if (!control) {
        //     try {
        //         control = new ActiveXObject('PDF.PdfCtrl');
        //     } catch (e) {
        //     }
        // }
        // if (!control) {
        //     try {
        //         control = new ActiveXObject('Adobe Acrobat');
        //     } catch (e) {
        //     }
        // }

        // if (!control) {
        //     try {
        //         control = new ActiveXObject('Adobe PDF Plug-in');
        //     } catch (e) {
        //     }
        // }
        // if (control) {
        //     isInstalled = true;
        //     version = control.GetVersions().split(',');
        //     version = version[0].split('=');
        //     version = parseFloat(version[1]);
        //     return isInstalled;
        // }
    }
}

function isIE() { //ie    支持到ie11
    if (!!window["ActiveXObject"] || "ActiveXObject" in window)
        return true;
    else
        return false;
} 