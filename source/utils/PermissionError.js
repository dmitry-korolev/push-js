class PermissionError extends Error {
    constructor(message) {
        super(message);

        this.name = 'PermissionError';
        this.message = message || this.name;
        this.stack = (new Error()).stack;
    }
}

export default PermissionError;
