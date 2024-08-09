let key;

function keyPress(element) {
    element.addEventListener('keydown', event => {
        key = event.key
    })
}

export { keyPress, key }

// let keys = [];

// function keyDownUp(element){
//     element.addEventListener('keydown',addKey)
//     element.addEventListener('keyup',removeKey)
// }

// const hasKey = (searchKey)=>keys.find(key=>key===searchKey)

// function addKey(event){
//     !hasKey(event.key) && keys.push(event.key)
// }

// function removeKey(event){ 
//     keys = keys.filter(key=>key!=event.key)
// }

// const getKeys = ()=>keys

// export {keyDownUp, hasKey, getKeys}