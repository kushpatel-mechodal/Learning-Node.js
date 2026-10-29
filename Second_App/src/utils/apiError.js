//use Error class for handle api error
class apiError extends Error {
  // use constructor for automatically call
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message); //super call parent class constructor
    this.statusCode = statusCode;
    this.data = null; //inital data is empty
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

  }
}

export default apiError;
