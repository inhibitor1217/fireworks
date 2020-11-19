import Program from "./Program";

export default class Material {
    private _program: Program;
    get program(): Program {
        return this._program;
    }
    
    constructor(program: Program) {
        this._program = program;
    }

    start(): void {
        this._program.start();
    }

    stop(): void {
        this._program.stop();
    }
}