import { Misfit } from 'knight-validation'

export class Result {

  type: string = 'value'
  misfits!: Misfit[]
  error!: string

  constructor(values?: any) {
    Object.assign(this, values)
  }

  isValue(): boolean {
    return this.type == 'value'
  }

  isMisfits(): boolean {
    return this.type == 'misfits'
  }

  isError(): boolean {
    return this.type == 'error'
  }

  static misfits<T extends Result>(misfit: Misfit): T
  static misfits<T extends Result>(misfit: Misfit[]): T

  static misfits<T extends Result>(misfits: Misfit|Misfit[]): T {
    let result = new this()
    result.type = 'misfits'

    if (misfits instanceof Array) {
      result.misfits = misfits
    }
    else if (misfits != undefined) {
      result.misfits = [ misfits ]
    }

    return <T> result
  }

  static error<T extends Result>(error: string): T {
    let result = new this()
    result.type = 'error'
    result.error = error
    return <T> result
  }
}