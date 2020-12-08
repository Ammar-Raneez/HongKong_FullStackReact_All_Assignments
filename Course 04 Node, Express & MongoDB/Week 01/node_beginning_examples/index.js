var rect = require("./rectangle")   //importing our rectangle node module (node modules are basically java classes)

function solveRectangle(l, b) {
    console.log(`Solving for rectangle with l = ${l} and b = ${b}`)

    // if(l <= 0 || b <= 0) {
    //     console.log("Rectangle Dimensions should be greater than 0")
    // } else {
    //     console.log(`The area of the rectangle is ${rect.area(l, b)}`)
    //     console.log(`The perimeter of the rectangle is ${rect.perimeter(l, b)}`)
    // } (x, y, callback) is (l, b, (err,r)), therefore callback is (err, r)
    rect(l, b, (err, r) => {
        if(err) console.log("ERROR: ", err.message)
        else {
            console.log(`The area of the rectangle is ${r.area(l, b)}`) //need not pass arguments due to "closure"
            console.log(`The perimeter of the rectangle is ${r.perimeter(l, b)}`)
        }
    })
}

solveRectangle(2, 4)
solveRectangle(3, 5)
solveRectangle(0, 5)
solveRectangle(-3, 5)