function convertToUpperCase(obj, visited = new Set()) {
    // Check if the input is an object and not null
    if (typeof obj === "object" && obj !== null) {
        // Check for circular references
        if (visited.has(obj)) {
            return obj; // Return the object to stop infinite recursion
        }
        visited.add(obj);

        // Iterate over the object's properties
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];
                // If the value is a string, capitalize the first letter
                if (typeof value === 'string') {
                    obj[key] = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                }
                // If the value is an object or array, recursively call the function
                else if (typeof value === 'object') {
                    convertToUpperCase(value, visited);
                }
            }
        }
    }

    return obj; // Return the modified object
}


export { convertToUpperCase }