import { Result } from '../Result'

export class CountResult extends Result {
    count: number

    constructor()
    constructor(count?: number)

    constructor(count?: number) {
        super()
        this.count = count as any
    }
}
