/**
 * stringExtend
 */
export class stringExtend {
    constructor(){
        console.log("我执行了方法");
    }
    like(value: string) {
        return (new RegExp(value, 'i')).test(arguments[0]);
    }
}