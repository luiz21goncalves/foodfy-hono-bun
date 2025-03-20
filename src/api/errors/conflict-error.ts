import type { ContentfulStatusCode } from 'hono/utils/http-status'

type ConflictErrorProps = {
  cause?: unknown
  message: string
}

export class ConflictError extends Error {
  private _statusCode: ContentfulStatusCode

  constructor({ message, cause }: ConflictErrorProps) {
    super(message, { cause })
    this._statusCode = 409
    this.name = 'ConflictError'
  }

  get statusCode() {
    return this._statusCode
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status_code: this._statusCode,
    }
  }
}
