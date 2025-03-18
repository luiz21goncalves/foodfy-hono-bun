import type { ContentfulStatusCode } from 'hono/utils/http-status'

type InternalServerErrorProps = {
  cause?: unknown
}

export class InternalServerError extends Error {
  private _statusCode: ContentfulStatusCode

  constructor(props?: InternalServerErrorProps) {
    super('An internal server error occurred.', { cause: props?.cause })
    this._statusCode = 500
    this.name = 'InternalServerError'
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
