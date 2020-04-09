'use strict'

class Grid {
    static resWidth = 600   // px

    constructor (container, n) {
        console.log(`Instanciated a grid in ${container} ${n}x${n}`)

        GridElement.grid = this

        this.selectionListeners = [];
        this.n = n
        this.elementSize = Grid.resWidth / this.n
        GridElement.width = this.elementSize
        
        // Populate grid elements
        this.gridElements = []
        for (let i = 0; i < n*n; i++) {
            let x = i%this.n
            let y = Math.floor(i/this.n)
            let element = new GridElement(x, y)
            element.color = "black"
            this.gridElements.push(element)
        }

        this.container = container

        // Setup canvas
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = Grid.resWidth
        this.canvas.height = Grid.resWidth
        document.getElementById(container).appendChild(this.canvas)

        GridElement.canvas = this.canvas
        GridElement.ctx = this.ctx

        // State parameters
        this.state = {
            mousedown: false,
            dragging: false
        }

        this.setupHandlers()
    }

    /**
     * Draws the grid lines
     */
    drawGrid () {
        // Draw grid
        this.ctx.strokeStyle = "whitesmoke";
        
        // Vertical lines
        let vLines = Grid.resWidth / this.elementSize
        for (let i = 0; i <= vLines; i++) {
            this.ctx.beginPath()
            this.ctx.moveTo(i*this.elementSize,0)
            this.ctx.lineTo(i*this.elementSize,Grid.resWidth)
            this.ctx.stroke()
        }

        // Horizontal lines
        let hLines = Grid.resWidth  / this.elementSize
        for (let i = 0; i <= hLines; i++) {
            this.ctx.beginPath()
            this.ctx.moveTo(0,i*this.elementSize)
            this.ctx.lineTo(Grid.resWidth,i*this.elementSize)
            this.ctx.stroke()
        }

        // Each individual grid element
        for (let i = 0; i < this.gridElements.length; i++) {
            this.gridElements[i].draw()
        }
    }

    /**
     * Sets up all interaction with the grid
     */
    setupHandlers () {
        this.canvas.onclick = (ev) => {
            if (this.state.dragging) {
                this.state.dragging = false
                return
            }
            let x = ev.offsetX
            let y = ev.offsetY
            console.log("CLICK: ("+x+ "," +y+")")

            this.triggerSelectionListeners(this.getGridElement(x, y))
        }

        this.canvas.onmousedown = (ev) => {
            this.state.mousedown = true
        }

        this.canvas.onmouseup = (ev) => {
            this.state.mousedown = false
        }

        this.canvas.onmouseleave = (ev) => {
            this.state.mousedown = false
        }

        this.canvas.onmousemove = (ev) => {
            if (!this.state.mousedown) return
            this.state.dragging = true
            let x = ev.offsetX
            let y = ev.offsetY
            this.triggerSelectionListeners(this.getGridElement(x, y))
        }
    }

    /**
     * Takes a x,y-coordinate and converts it into the targeted grid element
     * @param {Number} canvasX 
     * @param {Number} canvasY 
     */
    getGridElement(canvasX, canvasY) {
        let {x, y, index} = this.getGridElementCoordinates(canvasX, canvasY)
        return(this.gridElements[index])
    }

    /**
     * Takes a x,y-coordinate and converts it into a 2D-grid-coordinate, and the grid element 1D-index
     * @param {Number} canvasX 
     * @param {Number} canvasY 
     */
    getGridElementCoordinates(canvasX, canvasY) {
        let xn = Math.floor(canvasX / this.elementSize)
        let yn = Math.floor(canvasY / this.elementSize)
        let index = yn * (this.n) + xn 
        return {
            x: xn,
            y: yn,
            index: index
        }
    }

    getGridElementWithGridCoordinates(x, y) {
        return this.gridElements[(y * this.n + x)]
    }

    /**
     * Returns neighbours in an array ordered: TOP, RIGHT, BOT, LEFT
     * @param {Object[]} element 
     */
    getElementNeighbours(element) {
        let neighbours = []
        // Upper neighbour
        if (element.y == 0) {
            neighbours.push(null)
        }  else {
            neighbours.push(this.getGridElementWithGridCoordinates(element.x, element.y -1))
        }

        // Right
        if (element.x == grid.n - 1) {
            neighbours.push(null)
        } else {
            neighbours.push(this.getGridElementWithGridCoordinates(element.x + 1, element.y))
        }

        // Down
        if (element.y == grid.n - 1) {
            neighbours.push(null)
        }  else {
            neighbours.push(this.getGridElementWithGridCoordinates(element.x, element.y +1))
        }

        // Left
        if (element.x == 0) {
            neighbours.push(null)
        } else {
            neighbours.push(this.getGridElementWithGridCoordinates(element.x - 1, element.y))
        }
        
        return neighbours
    }

    /**
     * Adds a listener to element selection
     * @param {Function} callback 
     */
    addElementSelectionListener(callback) {
        this.selectionListeners.push(callback)
    }

    triggerSelectionListeners(element) {
        for (let i = 0; i < this.selectionListeners.length; i++) {
            let f = this.selectionListeners[i]
            f(element)
        }
    }

    /**
     * Draws the grid and everything inside it
     */
    draw () {
        this.ctx.fillStyle = "whitesmoke"
        this.ctx.fillRect(0,0,Grid.resWidth,Grid.resWidth)

        for (let i = 0; i < this.gridElements.length-1; i++) {
            let e = this.gridElements[i]
            e.draw()
        }

        this.drawGrid()
    }

    clear () {
        for (let i = 0; i < this.gridElements.length; i++) {
            let el = this.gridElements[i]
            el.reset()
        }
    }
}

class GridElement {

    static canvas = null
    static ctx = null
    static width = null
    static margin = 1   //px
    static grid = null

    /**
     * Define a grid element
     * @param {*} x 
     * @param {*} y 
     */
    constructor (x, y) {
        this.x = x
        this.y = y

        this.color = "black"
        this.attributes = {}
    }

    reset () {
        this.color = "black"
        this.attributes = {}
    }

    setAttribute(name, value) {
        this.attributes[name] = value
    }

    getAttribute(name) {
        return this.attributes[name]
    }

    /**
     * Draws this element on the grid
     */
    draw () {
        if (!GridElement.canvas || !GridElement.ctx || !GridElement.width) throw new Error("Grid element parameters unset")
        let w = GridElement.width
        let m = GridElement.margin
        GridElement.ctx.fillStyle = this.color
        GridElement.ctx.fillRect(this.x * w+m, this.y * w+m, w-2*m, w-2*m)
    }

    /**
     * Returns neighbours in an array ordered: TOP, RIGHT, BOT, LEFT
     * @param {Object[]} element 
     */
    getNeighbours () {
        let neighbours = GridElement.grid.getElementNeighbours(this)
        return neighbours
    }

    /**
     * Solid programming right here
     */
    getKey () {
        return `${this.x},${this.y}`
    }
}