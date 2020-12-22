import { PipeTransform, Type } from '@nestjs/common';
export declare const ArrayValidationPipe: <T>(itemType: Type<T>) => Type<PipeTransform>;
