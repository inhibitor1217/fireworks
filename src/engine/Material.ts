import Program from "./Program";

export default class Material {
    protected program: Program;
    
    constructor(program: Program) {
        this.program = program;
    }

    start(): void {
        this.program.start();
    }

    stop(): void {
        this.program.stop();
    }
}