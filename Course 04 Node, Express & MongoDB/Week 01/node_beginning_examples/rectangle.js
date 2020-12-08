//a node module of our own, we use commonJS import and export functionality cuz node doesnt support es6 import exports
//*First class Functions - A callback is when you pass around functions as parameters etc... basically a function acts as a variable
//*Closures - defining a function within a function makes that function have access to all the outer functions variables, even after the outer functions finishes running
// exports.perimeter = (x, y) => (2*(x+y))
// exports.area = (x, y) => x*y

//using callbacks   callback holds (error, r)
module.exports = (x, y, callback) => {
    if(x <= 0 || y <= 0) {
        setTimeout(() => 
            //when we return an error the second parameter of callback will be ignored
            callback(new Error("Rectangle Dimensions should be greater than 0"), null)
        , 2000)
    } else {
        setTimeout(() => 
            //error is null
            callback(null, {
                area: (x, y) => x*y,
                perimeter: (x, y) => (2*(x+y))  //callback returns an error or a function
            })
        , 2000)
    }
}