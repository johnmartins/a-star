'use strict'

function djikstra (nodes, origin, target) {

    let visitedNodesMap = {}
    let weightMap = {}
    let distanceMap = {}

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]

        let weight = Math.sqrt(Math.pow(target.x - node.x, 2) + Math.pow(target.y - node.y, 2)) // The least distance formula is bad here since it can only move in 4 predefined directions
        //let weight = Math.abs(target.x - node.x) + Math.abs(target.y - node.y) // Does not look as good, but is actually better
        weightMap[node.getKey()] = weight
        distanceMap[node.getKey()] = 0
        // node.color = `rgb(${distance*8},0,0)`
    }

    let pq = new PriorityQueue()
    pq.setValueFunction( (gridElement) => {
        return weightMap[gridElement.getKey()]
    })

    // Setup starting conditions
    pq.add(origin)
    visitedNodesMap[origin.getKey()] = origin
    let pathFound = false

    let cycles = 0
    while (pq.isEmpty() === false) {
        
        let currentNode = pq.pop()

        // Are we there yet?
        if (currentNode === target) {
            console.log("FOUND THE TARGET")
            pathFound = true
            break
        }

        if (cycles !== 0) {
            currentNode.color = "DarkSlateGray"
            currentNode.setAttribute("visited", true)
        } 

        // Add neighbours
        let neighbourArray = currentNode.getNeighbours()
        for (let i = 0; i < neighbourArray.length; i++) {
            let neighbour = neighbourArray[i]

            // neighbours are set to null if edge of domain. Skip.
            if (!neighbour) continue 
            // obstacles can't be visited. Skip.
            if (neighbour.getAttribute("isObstacle") === true) continue
            // element has already been explored. Skip.
            if (visitedNodesMap[neighbour.getKey()]) continue
            // Disregard the distance to the of the current node. 
            // Only take into account the distance to the goal of the next

            distanceMap[neighbour.getKey()] = distanceMap[currentNode.getKey()] + 1
            weightMap[neighbour.getKey()] = weightMap[neighbour.getKey()] + distanceMap[neighbour.getKey()]
            // If neighbour does not exist in map, then the current node is the fastest way to get there.
            visitedNodesMap[neighbour.getKey()] = currentNode
            pq.add(neighbour)
        }
        
        cycles++
    }
    console.log(`Problem solved in ${cycles} cycles`)
    
    if (!pathFound) return
    
    let traceBackNode = target
    while(traceBackNode.getKey() !== origin.getKey()) {
        if (traceBackNode.getKey() !== target.getKey()) {
            traceBackNode.color = "magenta"
        }
        traceBackNode = visitedNodesMap[traceBackNode.getKey()]
    }
}