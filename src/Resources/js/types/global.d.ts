export {};
declare global {
    var route: {
        (name: string, params?: any, absolute?: boolean, config?: any): string;
        (): { 
            current(name?: string, params?: any): boolean;
            has(name: string): boolean;
        };
    };
}