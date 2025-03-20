import type { ContentfulStatusCode } from 'hono/utils/http-status'

type ValidationErrorProps = {
  details: unknown
  cause?: unknown
}

export class ValidationError extends Error {
  private _statusCode: ContentfulStatusCode
  private details: unknown

  constructor({ details, cause }: ValidationErrorProps) {
    super('A validation error occurred.', { cause })
    this._statusCode = 400
    this.name = 'ValidationError'
    this.details = details
  }

  get statusCode() {
    return this._statusCode
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      details: this.details,
      status_code: this._statusCode,
    }
  }
}
