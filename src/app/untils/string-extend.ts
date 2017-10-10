
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
    isNullOrEmpty() {
        return this.length == 0 || this == null || this == undefined;
    }
    isNotNullOrEmpty() {
        return !this.isNullOrEmpty();
    }
    isBlank() {
        let regEx = /^\s+$/g;
        return this.isNullOrEmpty() || this.search(regEx) > -1;
    }
    isNotBlank() {
        return !this.isBlank();
    }
}