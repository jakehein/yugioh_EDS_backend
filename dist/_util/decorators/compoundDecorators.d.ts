export declare function ObjectArrayOfTypeDecorator(type: Function, isOptional?: boolean): PropertyDecorator;
export declare function StringApiDecorator(isOptional?: boolean): PropertyDecorator;
export declare function BoosterPackStringArrayApiDecorator(isOptional?: boolean): PropertyDecorator;
export declare function StringArrayApiDecorator(isOptional?: boolean): PropertyDecorator;
export declare function NumberApiDecorator(isOptional?: boolean): PropertyDecorator;
export declare function EnumApiDecorator(enumtype: Object, isOptional?: boolean): PropertyDecorator;
export declare function IntApiDecorator(isOptional?: boolean): PropertyDecorator;
export declare function ApiControllerHeader(swaggerTag: string, controllerPath?: string): ClassDecorator & MethodDecorator;
export declare function CommonGuardedControllerDecorator(swaggerTag: string, controllerPath?: string): ClassDecorator & MethodDecorator;
