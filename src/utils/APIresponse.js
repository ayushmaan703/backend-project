class APIresponse {
    constructor(statusCode, message = "Sucess") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
export default APIresponse;
