// priority_inbox.js

/**
 * Priority Weights
 * Placement > Result > Event
 */
const WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

/**
 * Helper to compare two notifications.
 * Returns > 0 if A has higher priority than B.
 * Returns < 0 if A has lower priority than B.
 */
function comparePriority(a, b) {
    const weightA = WEIGHTS[a.Type] || 0;
    const weightB = WEIGHTS[b.Type] || 0;

    if (weightA !== weightB) {
        return weightA - weightB; // Higher weight wins
    }

    // If weights are equal, compare recency (newer timestamp wins)
    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();
    
    return timeA - timeB; // Higher timestamp (newer) wins
}

/**
 * MinHeap implementation to maintain the Top N elements efficiently.
 */
class MinHeap {
    constructor(maxSize) {
        this.heap = [];
        this.maxSize = maxSize;
    }

    push(item) {
        if (this.heap.length < this.maxSize) {
            this.heap.push(item);
            this._bubbleUp(this.heap.length - 1);
        } else {
            // If the heap is full, compare with the minimum element (root)
            // If the new item has a higher priority than the minimum element in our Top N,
            // we replace the root and sink it down.
            if (comparePriority(item, this.heap[0]) > 0) {
                this.heap[0] = item;
                this._sinkDown(0);
            }
        }
    }

    getSortedItems() {
        // Return a copy sorted from highest priority to lowest
        return [...this.heap].sort((a, b) => comparePriority(b, a));
    }

    _bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (comparePriority(this.heap[index], this.heap[parentIndex]) >= 0) break;
            
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    _sinkDown(index) {
        const length = this.heap.length;
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < length && comparePriority(this.heap[leftChild], this.heap[minIndex]) < 0) {
                minIndex = leftChild;
            }
            if (rightChild < length && comparePriority(this.heap[rightChild], this.heap[minIndex]) < 0) {
                minIndex = rightChild;
            }

            if (minIndex === index) break;

            [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
            index = minIndex;
        }
    }
}

/**
 * Main execution function
 */
async function runPriorityInbox() {
    const accessToken = process.env.ACCESS_TOKEN; // Read token from environment variable

    if (!accessToken) {
        console.error("❌ ERROR: Please provide your Access Token!");
        console.error("Usage (Windows): $env:ACCESS_TOKEN='your_token_here'; node priority_inbox.js");
        return;
    }

    console.log("Fetching notifications from API...\n");

    try {
        const response = await fetch("http://20.207.122.201/evaluation-service/notifications", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch notifications. Status: ${response.status}`);
            console.error(await response.text());
            return;
        }

        const data = await response.json();
        const notifications = data.notifications || [];

        console.log(`Successfully fetched ${notifications.length} total notifications.`);
        console.log("Processing through Min-Heap to extract Top 10 priority...\n");

        const topNHeap = new MinHeap(10); // Maintain Top 10

        // Process the stream
        for (const notif of notifications) {
            topNHeap.push(notif);
        }

        const top10 = topNHeap.getSortedItems();

        console.log("=========================================");
        console.log("             PRIORITY INBOX (Top 10)     ");
        console.log("=========================================\n");

        top10.forEach((notif, index) => {
            console.log(`${index + 1}. [${notif.Type}] ${notif.Message} (${notif.Timestamp})`);
        });

        console.log("\n=========================================");

    } catch (error) {
        console.error("An error occurred during fetch:", error);
    }
}

// Run the script
runPriorityInbox();
