export class CustomError extends Error {
  status?: number;

  // Konstruktorn tar ett meddelande och en valfri statuskod (default 400)
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
