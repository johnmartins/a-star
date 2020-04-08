'use strict'

const GlobalObserver = (function () {
    let listeners = {}
    let idEventMap = {}
    let counter = -1

    /**
     * Subscribe to an event
     * @param {String} event 
     * @param {Function} method 
     * @returns {Number} ID
     */
    let subscribe = function (event, method) {
        if (typeof event != 'string') {
            console.error('Event argument of global-observer needs to be a string')
            return
        }

        if (method instanceof Function === false) {
            console.error("Method argument of global-observer needs to be a function")
        }

        counter += 1
        let subscriberID = counter

        if (!listeners[event]) {
            listeners[event] = {}
        }

        listeners[event][subscriberID] = method

        idEventMap[subscriberID] = event

        return subscriberID
    }

    /**
     * Unsubscribe to an event
     * @param {Number} ID
     */
    let unsubscribe = function(id) {
        let event = idEventMap[id]
        delete listeners[event][id]
    }

    /**
     * Fire event
     * @param {String} event 
     * @param {Object} payload 
     */
    let fire = function (event, payload) {
        if (listeners[event]) {
            let subscriptionIDs = Object.keys(listeners[event])

            for (let i = 0; i < subscriptionIDs.length; i++) {
                let subscriptionID = subscriptionIDs[i]
                listeners[event][subscriptionID](payload)
            }
        }
    }

    return {
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        fire: fire
    }
})()