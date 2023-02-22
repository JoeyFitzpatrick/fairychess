export function switchColor(currentColor) {
    if (currentColor === 1) {
        return -1
    }
    else if (currentColor === -1) {
        return 1
    }
    else {
        console.log(`Parameter is ${currentColor}, but it can only be 1 or -1.`)
        return null
    }
}