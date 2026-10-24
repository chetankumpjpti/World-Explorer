// Animated Counter
const Counters = document.querySelectorAll(".counter")
Counters.forEach((counter) =>{
    let target = Number(counter.dataset.target)
    let count = 0;

    let interval = setInterval(() =>{
        count++
        counter.textContent = count + " +"

        if(count === target){
            clearInterval(interval)
        }
    },100)
})
