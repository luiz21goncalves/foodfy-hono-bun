import { password } from 'bun'

type VerifyData = {
  plain: string
  hash: string
}

export const hashService = {
  hash(plain: string) {
    return password.hash(plain)
  },
  verify({ hash, plain }: VerifyData) {
    return password.verify(plain, hash)
  },
}
