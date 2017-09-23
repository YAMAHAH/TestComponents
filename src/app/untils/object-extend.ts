export class ObjectExtentions {
    static defineProperty(o: any, propertyKey: PropertyKey, attributes: PropertyDescriptor): any {
        return Object.defineProperty(o, propertyKey, attributes);
    }
}