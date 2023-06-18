import { expect } from 'chai'
import 'mocha'
import { Result } from '../src'

describe('Result', function () {
    describe('constructor', function () {
        it('should assign the given properties', function () {
            let result = new Result({ a: 1, b: 2 })
            expect((result as any).a).to.equal(1)
            expect((result as any).b).to.equal(2)
        })
    })
})
