'use strict'

class PriorityQueue {
    constructor () {
        this.stack = []
    }

    isEmpty () {
        if (this.stack.length > 0) return false
        return true
    }

    add (element) {
        this.stack.push(element)
        if (this.stack.length == 1) return 
        this.adjustHierarchyBottomUp(this.stack.length - 1)
    }

    pop () {
        let first = this.stack[0]
        let last = this.stack[this.stack.length - 1]

        // Put last value on top
        this.stack[0] = last
        // Remove duplicate last value
        this.stack.pop()
        if (!this.isEmpty()) this.adjustHierarchyTopDown(0)
        
        // Switch last and first and assert order
        return first
    }

    peek () {
        if (!this.isEmpty())
        return this.stack[0]
    }

    adjustHierarchyTopDown (index) {
        let topValue = this.stack[index]
        if (this.getLeftIndex(index)) {
            let leftValue = this.stack[this.getLeftIndex(index)]
            // If it also has a right child
            if (this.getRightIndex(index)) {
                let rightValue = this.stack[this.getRightIndex(index)]

                if (leftValue >= rightValue) {
                    if (rightValue >= topValue) return // Dont shift if top is lower
                    this.shiftRight(index)
                    this.adjustHierarchyTopDown(this.getRightIndex(index))
                } else {
                    if (leftValue >= topValue) return // Dont shift if top is lower
                    this.shiftLeft(index)
                    this.adjustHierarchyTopDown(this.getLeftIndex(index))
                }

                return
            } 
            // If it only has a left child
            if (leftValue < topValue) {
                this.shiftLeft(index)
                this.adjustHierarchyTopDown(this.getLeftIndex(index))
                return
            }
        }

        // No children -> No shifting.
        return
    }

    adjustHierarchyBottomUp (index) {
        if (index == 0) return

        let valueIndex = this.stack[index]
        let valueTop = this.stack[this.getTopIndex(index)]

        if (valueTop > valueIndex) {
            this.shiftUp(index)
            this.adjustHierarchyBottomUp(this.getTopIndex(index))
        }

        return
    }

    getLeftIndex (index) {
        return index * 2 + 1 < this.stack.length ? index * 2 + 1 : false
    }

    getRightIndex (index) {
        return index * 2 + 2 < this.stack.length ? index * 2 + 2 : false
    }

    getTopIndex (index) {
        if (index == 0) throw new Error("Why would you do that?")
        return Math.floor(index/2)
    }

    shiftLeft (index) {
        let indexLeft = this.getLeftIndex(index)
        let initialTop = this.stack[index]
        let initialLeft = this.stack[indexLeft]
        this.stack[indexLeft] = initialTop
        this.stack[index] = initialLeft
    }

    shiftRight (index) {
        let indexRight = this.getRightIndex(index)
        let initialTop = this.stack[index]
        let initialRight = this.stack[indexRight]
        this.stack[indexRight] = initialTop
        this.stack[index] = initialRight
    }

    shiftUp (index) {
        if (index == 0) return
        let valueTop = this.stack[this.getTopIndex(index)]
        let valueIndex = this.stack[index]

        if (valueTop > valueIndex) {
            this.stack[this.getTopIndex(index)] = valueIndex
            this.stack[index] = valueTop
        }

        return
    }

    toString () {
        let str = "["
        for (let i = 0; i < this.stack.length; i++) {
            str += this.stack[i]
            if (i != this.stack.length - 1) str += ", "
        }
        return str += "]"
    }
}

/*
let pq = new PriorityQueue()
pq.add(7)
pq.add(99)
pq.add(2)
pq.add(33)
pq.add(3)
pq.add(8)
pq.add(53)
pq.add(0)
pq.add(100)

console.log(pq.toString())

while (pq.isEmpty() == false) {
    console.log(pq.toString())
    console.log(pq.pop())
}

*/