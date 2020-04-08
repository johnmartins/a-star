'use strict'
// Define GUI controls
let btnObstacle = document.getElementById("btn-obstacle")
btnObstacle.onclick = () => {
    GlobalObserver.fire("selection-type", "obstacle")
}

let btnPathfinder = document.getElementById("btn-pathfinder")
btnPathfinder.onclick = () => {
    GlobalObserver.fire("selection-type", "pathfinder")
}

let btnTarget = document.getElementById("btn-target")
btnTarget.onclick = () => {
    GlobalObserver.fire("selection-type", "target")
}

let btnClear = document.getElementById("btn-clear")
btnClear.onclick = () => {
    GlobalObserver.fire("clear-grid")
}

let btnRun = document.getElementById("btn-run")
btnRun.onclick = () => {
    GlobalObserver.fire("run")
}