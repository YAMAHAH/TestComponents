/**
* IterationValues<T>
*/
abstract class IterationValues<T> {
    abstract next(): {
        value: T,
        done: boolean
    }
}

export function forOf<T>(t: IterationValues<T>, fn: (data: T) => (boolean | void)) {
    let v: { value: T, done: boolean };
    while (true) {
        v = t.next();
        if (!v.done) {
            if (fn(v.value)) {
                break;
            }
        } else {
            break;
        }
    }
}