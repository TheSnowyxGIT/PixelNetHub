/// <reference types="node" />
import { EventEmitter } from 'events';
import { TypesManager } from 'pixel-nethub-options';
import { IFontService } from './interfaces';
import { IScreenService } from './interfaces/iScreenService';
export interface AppStartParams {
    options: any;
    screenService: IScreenService;
    fontsService: IFontService;
}
export interface AppInterface {
    start(context: AppStartParams): void;
    stop(): Promise<void>;
}
export declare class APP extends EventEmitter {
    private readonly appPath;
    private appImported?;
    constructor(appPath: string);
    validateStructureApp(): Promise<void>;
    validateOptionsApp(option: any, typeManager: TypesManager): Promise<void>;
    getOptionSchema(): Promise<any>;
    loadApp(): Promise<void>;
    private running;
    start(context: AppStartParams): void;
    stop(): void;
}
