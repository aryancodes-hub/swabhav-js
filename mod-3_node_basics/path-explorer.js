import path from 'node:path';

// Task 1: Break a Path into Its Components
let filename = "notes.txt";
let fullpath = path.join(process.cwd(), 'data', filename);
console.log("\nTask 1: Break a Path into Its Components")
console.log(path.parse(fullpath));


// Task 2: Create a Path from Separate Details

let path1 = path.format({
    dir: "backups",
    name: "employee-data",
    ext: ".json"
})
console.log("\nTask 2: Create a Path from Separate Details")
console.log(path1);


// task 3

let path2 = path.format({
    dir: "data",
    name: "users",
    base:"users.json"
})
console.log("\nTask 3: Generate an Absolute Path")
console.log(path.resolve(path2));

// task 4
let path3 = path.format({
    dir:"project-folder/documents",
    base:"reports"
})

let path4 = path.format({
    dir:"project-folder/documents",
    base:"bakcups"
})
console.log("\nTask 4: Find the Relative Path Between Two Folders")
console.log(path.relative(path3, path4));


// task 5

let path5 = path.format({
    dir:"documents",
    base:"notes.txt"
})

let abspath5 = path.resolve(path5)
console.log("\nTask 5: Check Whether Paths Are Absolute")
console.log(path5 + ": " + path.isAbsolute(path5))
console.log(abspath5 + ": " + path.isAbsolute(abspath5));
