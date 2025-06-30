import { Result } from '../Result'

export class GetResult<T> extends Result {
    entities: T[]

    constructor()
    constructor(entities: T[])

    constructor(entities?: T[]) {
        super()
        this.entities = entities as any
    }
}
