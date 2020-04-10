'use strict'

let grid = new Grid("grid-container", 30)

let interactionType = "obstacle"
GlobalObserver.subscribe("selection-type", (type) => {
    interactionType = type
})

let target = null
let origin = null

grid.addElementSelectionListener((el) => {
    // Handle interaction types
    if (!interactionType) return // No type -> do nothing

    el.getNeighbours()

    if (interactionType == "pathfinder") {
        if (origin) origin.reset()

        el.color = "lime"
        origin = el
    } else if (interactionType == "target") {
        if (target) target.reset()
        el.color = "red"
        target = el
    } else if (interactionType == "obstacle") {
        el.color = "white"
        el.setAttribute("isObstacle", true)
    } else if (interactionType == "erasor") {
        el.reset()
    }
})

GlobalObserver.subscribe("clear-grid", () => {
    grid.clear()
})

GlobalObserver.subscribe("clear-traces", () => {
    for (let i = 0; i < grid.gridElements.length; i++) {
        let el = grid.gridElements[i]
        if (el.getAttribute("visited")) {
            el.setAttribute("visited", false)
            el.color = "black"
        }
        
    }
})

// GUI draw loop
let drawGUI = () => {
    grid.draw()
    window.requestAnimationFrame(drawGUI)
}

drawGUI();

GlobalObserver.subscribe("run", () => {
    console.log("RUN")
    djikstra(grid.gridElements, origin, target)
})