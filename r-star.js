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

    pq.add(origin)
    let cycles = 0
    while (pq.isEmpty() === false) {
        cycles++
        let currentNode = pq.pop()
        currentNode.color = "cyan"
        console.log(`cycles: ${cycles}. Currently at: (${currentNode.x}, ${currentNode.y})`)

        // Are we there yet?
        if (currentNode === target) {
            console.log("FOUND THE TARGET")
            break
        }

        // Add neighbours
        let neighbourArray = currentNode.getNeighbours()
        for (let i = 0; i < neighbourArray.length; i++) {
            let neighbour = neighbourArray[i]
            if (!neighbour) continue // neighbours are set to null if outside domain
            if (neighbour.getAttribute("isObstacle") === true) continue

            if (visitedNodesMap[neighbour.getKey()]) {
                console.log(`Neighbour (${neighbour.x}, ${neighbour.y}) already logged`)
                console.log(visitedNodesMap[neighbour.getKey()])
                continue
            }

            // If neighbour does not exist in map, then the current node is the fastest way to get there.
            visitedNodesMap[neighbour.getKey()] = currentNode
            pq.add(neighbour)
        }
        
    }
    

    let distance = []

    
}