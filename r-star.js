'use strict'

function djikstra (nodes, origin, target) {

    let visitedNodesMap = {}
    let weightMap = {}

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]

        if (node === origin) {
            weightMap[node.getKey()] = 0
            continue
        }

        let distance = Math.sqrt(Math.pow(target.x - node.x, 2) + Math.pow(target.y - node.y, 2))
        weightMap[node.getKey()] = distance
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

        if (cycles !== 0) currentNode.color = "cyan"

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
            weightMap[neighbour.getKey()] = weightMap[neighbour.getKey()] + weightMap[currentNode.getKey()] 
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
            traceBackNode.color = "purple"
        }
        traceBackNode = visitedNodesMap[traceBackNode.getKey()]
    }
}