class Queue
{
    /**
     * [0] - Link
     * [1] - Title
     * [2] - Channel name 
     * [3] - Song duration
     * [4] - Thumbnail link
     * [5] - ytdl stream
     * [6] - Live - boolean
     * [7] - Requested by...
     */
    constructor()
    {
        this.items = [];
        this.tail = 0;
    }

    // Adds an element to the end
    add(element)
    {    
        this.items.push(element);
        this.tail++;
    }

    // Removes and returns element at front
    pop()
    {
        if(this.isEmpty()) return "Underflow";
        this.tail--;
        this.recentPopped = this.peek();
        return this.items.shift();
    }

    // Gets the element at the front
    peek()
    {
        if(this.isEmpty()) return "No elements in Queue";
        return this.items[0];
    }

    // Gets the last element of the queue
    look() 
    {
        if(this.isEmpty()) return "No elements in Queue";
        return this.items[this.tail-1];
    }

    // Gets length of queue
    length() {
        return this.tail - 0;
    }

    // Is queue empty?
    isEmpty()
    {
        return this.items.length == 0;
    }

    // Print queue
    printQueue()
    {
        for(var i = 0; i < this.items.length; i++) {
            console.log(this.items[i]);
        }
    }

    // Gets the array used BY VALUE
    getArray() 
    {
        return this.items.slice();
    }


    // Gets the array used BY REFERENCE
    getArrayReference() 
    {
        return this.items;
    }

    // Gets most recent popped item
    getRecentPopped()
    {
        return this.recentPopped;
    }
}

module.exports = Queue;