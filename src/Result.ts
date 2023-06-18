import { Misfit } from './Misfit'

export class Result {

    misfits?: Misfit[]
    error?: string

    constructor(result?: any) {
        Object.assign(this, result)
    }

    static misfits<T extends Result>(misfit: Misfit): T
    static misfits<T extends Result>(misfit: Misfit[]): T

    static misfits<T extends Result>(misfits: Misfit | Misfit[]): T {
        let result = new Result

        if (misfits instanceof Array) {
            result.misfits = misfits
        }
        else {
            result.misfits = [ misfits ]
        }

        return result as T
    }

    static error<T extends Result>(error: string): T {
        return new Result({ error: error }) as T
    }
}