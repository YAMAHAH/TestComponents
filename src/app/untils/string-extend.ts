
// String.prototype.like = function (value: string) {
//     return (new RegExp(value, 'i')).test(this);
// }

export class stringExtend extends String {
    like(value: string) {
        return (new RegExp(value, 'i')).test(this.valueOf());
    }
}

// String.bar = function () {
//     return "";
// }