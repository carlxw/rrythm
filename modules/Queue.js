class Queue {
    constructor() {
        this.items = [];
        this.tail = 0;
    }

    // Adds an element to the end
    add(element) {    
        this.items.push(element);
        this.tail++;
    }

    // Adds an element to the first in queue
    unshift(element) {
        this.items.unshift(element);
        this.tail++;
    }

    // Removes and returns element at front
    pop() {
        if(this.isEmpty()) return "Underflow";
        this.tail--;
        this.recentPopped = this.peek();
        return this.items.shift();
    }

    // Gets the element at the front
    peek() {
        if(this.isEmpty()) return "No elements in Queue";
        return this.items[0];
    }

    // Gets the last element of the queue
    look() {
        if(this.isEmpty()) return "No elements in Queue";
        return this.items[this.tail-1];
    }

    // Gets length of queue
    length() {
        return this.tail - 0;
    }

    // Is queue empty?
    isEmpty() {
        return this.items.length == 0;
    }

    // Removes an item from queue
    remove(num) {
        const removedIndex = this.items[num-1];
        this.items.splice(num-1, 1);
        this.tail--;
        return removedIndex;
    }

    // Print queue
    printQueue() {
        for(var i = 0; i < this.items.length; i++) {
            console.log(this.items[i]);
        }
    }

    // Gets the array used BY VALUE (Does  not affect original object)
    getArray() {
        return this.items.slice();
    }


    // Gets the array used BY REFERENCE (Affects original object)
    getArrayReference() {
        return this.items;
    }

    // Gets most recent popped item
    getRecentPopped(){
        return this.recentPopped;
    }

    // Reset array
    clear() {
        this.items = [];
        this.tail = 0;
    }
}

module.exports = Queue;