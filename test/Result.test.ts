import { expect } from 'chai'
import { Misfit } from 'knight-validation'
import 'mocha'
import { Result } from '../src'

describe('Result', function() {
  describe('constructor', function() {
    it('should assign the given properties', function() {
      let result = new Result({ a: 1, b: 2 })
      expect((result as any).a).to.equal(1)
      expect((result as any).b).to.equal(2)
    })
  })

  describe('misfits', function() {
    it('should create an instance of the calling class', function() {
      let testResult1: TestResult = TestResult.misfits(new Misfit)
      expect(testResult1).to.be.instanceOf(TestResult)

      let testResult2: TestResult = TestResult.misfits([ new Misfit ])
      expect(testResult2).to.be.instanceOf(TestResult)
    })
  })
})

class TestResult extends Result {
  testValue: number

  constructor(testValue: number) {
    super()
    this.testValue = testValue
  }
}