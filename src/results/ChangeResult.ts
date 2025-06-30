import { Result } from '../Result'
import { Change, Changes } from 'knight-change'

export class ChangeResult extends Result {
    changes!: Changes

    constructor()
    constructor(changes: Changes)
    constructor(changes: Change[])
    constructor(changes: Change)

    constructor(changes?: any) {
        super()

        if (changes instanceof Changes) {
            this.changes = changes
        } else if (changes instanceof Array) {
            this.changes = new Changes(...changes)
        } else if (changes instanceof Change) {
            this.changes = new Changes(changes)
        }
    }
}
