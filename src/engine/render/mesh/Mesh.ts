export default class Mesh {
    private gl: WebGL2RenderingContext;
    private vao: WebGLVertexArrayObject;
    private vbo: WebGLBuffer;
    private ibo: WebGLBuffer;

    private _numVertices: number;
    get numVertices() {
        return this._numVertices;
    }
    set numVertices(value: number) {
        this._numVertices = value;
    }

    private disposed: boolean;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;

        const vao = this.gl.createVertexArray();
        if (!vao) {
            throw Error('Unable to create vertex array.');
        }

        const vbo = this.gl.createBuffer();
        if (!vbo) {
            throw Error('Unable to create buffer.');
        }

        const ibo = this.gl.createBuffer();
        if (!ibo) {
            throw Error('Unable to create buffer.');
        }

        this.vao = vao;
        this.vbo = vbo;
        this.ibo = ibo;

        this._numVertices = 0;

        this.disposed = false;
    }

    bindVertices(buffer: ArrayBuffer): void {
        if (this.disposed) {
            return;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);

        this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer, this.gl.STATIC_DRAW);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    bindVertexIndices(buffer: ArrayBuffer): void {
        if (this.disposed) {
            return;
        }

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);

        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, buffer, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    commit(attributes: { dataType: GLenum; dimension: number; }[]): void {
        if (this.disposed) {
            return;
        }

        if (attributes.length === 0) {
            return;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.gl.bindVertexArray(this.vao);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);

        const stride = attributes
            .map(({ dataType, dimension }) => this.dataTypeToSize(dataType) * dimension)
            .reduce((acc, size) => acc + size, 0);
        
        attributes.reduce((offset, { dataType, dimension }, index) => {
            this.gl.vertexAttribPointer(index, dimension, dataType, false, stride, offset);
            this.gl.enableVertexAttribArray(index);
            return offset + this.dataTypeToSize(dataType) * dimension;
        }, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    start(): void {
        if (this.disposed) {
            return;
        }
        this.gl.bindVertexArray(this.vao);
    }

    render(): void {
        if (this.disposed) {
            return;
        }
        this.gl.drawElements(this.gl.TRIANGLES, this._numVertices, this.gl.UNSIGNED_INT, 0);
    }

    stop(): void {
        if (this.disposed) {
            return;
        }
        this.gl.bindVertexArray(null);
    }

    dispose(): void {
        if (this.disposed) {
            return;
        }

        this.disposed = true;

        this.gl.deleteVertexArray(this.vao);
        this.gl.deleteBuffer(this.vbo);
        this.gl.deleteBuffer(this.ibo);
    }

    private dataTypeToSize(type: GLenum): GLsizei {
        switch (type) {
            case this.gl.BYTE:
            case this.gl.UNSIGNED_BYTE:
                return 1;
            case this.gl.SHORT:
            case this.gl.UNSIGNED_SHORT:
            case this.gl.HALF_FLOAT:
                return 2;
            case this.gl.INT:
            case this.gl.UNSIGNED_INT:
            case this.gl.FLOAT:
                return 4;
            default:
                throw Error(`Unsupported data type: ${type}`);
        }
    }
}