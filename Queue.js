class Queue
{
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
    dequeue()
    {
        if(this.isEmpty()) return "Underflow";
        this.tail--;
        return this.items.shift();
    }

    // Gets the element at the front
    peek()
    {
        if(this.isEmpty()) return "No elements in Queue";
        return this.items[0];
    }

    // Gets length of queue
    length() {
        return tail - 0;
    }

    // Is queue empty?
    isEmpty()
    {
        return this.items.length == 0;
    }

    // Print queue
    printQueue()
    {
        var str = "";
        for(var i = 0; i < this.items.length; i++) {
            str += this.items[i] +" ";
        }
        console.log(str);
    }
}

module.exports = Queue;