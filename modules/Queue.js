class Queue {
    constructor() {
        this.items = [];
        this.tail = 0;
    }

    add(element, toTop) {
        this.recentAdded = element;
        // Add an element to the top
        if (toTop) {
            this.items.unshift(element);
            this.tail++;
        } 
        // Add an element to the back of the queue
        else {
            this.items.push(element);
            this.tail++;
        }
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
        return this.tail;
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
    getRecentPopped() {
        return this.recentPopped;
    }

    // Gets the recent added item (from either start or end of queue)
    getRecentAdded() {
        return this.getRecentAdded;
    }

    // Searches for an element in the queue, returns -1 if not found. Title is case sensitive 
    search(title) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].title === title) return i+1;
        }
        return -1;
    }

    // Reset array
    clear() {
        this.items = [];
        this.tail = 0;
    }
}

module.exports = Queue;