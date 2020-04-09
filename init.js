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
        el.color = "lime"
        origin = el
    } else if (interactionType == "target") {
        el.color = "red"
        target = el
    }

    if (interactionType == "obstacle") {
        el.color = "gainsboro"
        el.setAttribute("isObstacle", true)
    } else {
        // If the type is anything other than obstacle, then dont allow the user to drag
        GlobalObserver.fire("selection-type", null)
    }
})

GlobalObserver.subscribe("clear-grid", () => {
    grid.clear()
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