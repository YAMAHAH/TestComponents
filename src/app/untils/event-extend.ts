export class EventExtend {

    createEvent() {

    }

    removeEvent() {

    }

    fireEvent(eventName: string, eventArgs: any) {
        //div2.fireEvent(eventName,eventArgs);
        if (document.createEvent)
            HTMLElement.prototype.dispatchEvent(eventArgs);
    }
}

function fireKeyEvent(el: any, evtType: any, keyCode: any) {
    let evtObj: any;
    if (document.createEvent) {
        if ((window as any).KeyEvent) {//firefox 浏览器下模拟事件
            evtObj = document.createEvent('KeyEvents');
            evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
        } else {//chrome 浏览器下模拟事件
            evtObj = document.createEvent('UIEvents');
            (evtObj as UIEvent).initUIEvent(evtType, true, true, window, 1);

            delete evtObj.keyCode;
            if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                Object.defineProperty(evtObj, "keyCode", { value: keyCode });
            } else {
                evtObj.key = String.fromCharCode(keyCode);
            }

            if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                Object.defineProperty(evtObj, "ctrlKey", { value: false });
            } else {
                evtObj.ctrlKey = false;
            }
        }
        el.dispatchEvent(evtObj);

    } else if ((document as any).createEventObject) {//IE 浏览器下模拟事件
        evtObj = (document as any).createEventObject();
        evtObj.keyCode = keyCode
        el.fireEvent('on' + evtType, evtObj);
    }
}