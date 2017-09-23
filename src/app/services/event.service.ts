import { Injectable } from '@angular/core';
@Injectable()
export class EventService {
    handlers = {};
    addEvent(type: string, handler: Function) {
        //判断事件处理数组是否有该类型事件
        if (typeof this.handlers[type] == 'undefined') {
            this.handlers[type] = [];
        }
        //将处理事件push到事件处理数组里面
        this.handlers[type].push(handler);
    }
    fireEvent(event: any) {
        //模拟真实事件的event
        if (!event.target) {
            event.target = this;
        }
        //判断是否存在该事件类型
        if (this.handlers[event.type] instanceof Array) {
            let handlers = this.handlers[event.type];
            //在同一个事件类型下的可能存在多种处理事件，找出本次需要处理的事件
            for (let i = 0; i < handlers.length; i++) {
                //执行触发
                handlers[i](event);
            }
        }
    }
    removeEvent(type: string, handler: Function) {
        //判断是否存在该事件类型
        if (this.handlers[type] instanceof Array) {
            let handlers = this.handlers[type];
            let idx = -1;
            //在同一个事件类型下的可能存在多种处理事件
            for (let i = 0; i < handlers.length; i++) {
                //找出本次需要处理的事件下标
                if (handlers[i] == handler) {
                    idx = i;
                    break;
                }
            }
            //从事件处理数组里面删除
            handlers.splice(idx, 1);
        }
    }
}