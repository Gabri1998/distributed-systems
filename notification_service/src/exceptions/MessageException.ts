export class MessageException extends Error {
  code: number
  constructor({ message, code }: { message: string; code: number }) {
    super(message)
    this.name = 'MessageException'
    this.code = code
  }
}
