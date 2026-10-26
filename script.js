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


// fetch API data





const API_data = document.querySelector("#API_data");

async function apiHandler() {
    try {
        const response = await fetch(
            "https://api.restcountries.com/countries/v5?limit=100",
            {
                headers: {
                    "Authorization": "Bearer rc_live_cbafff3a94e448d0869bca1df9639ba7"
                }
            }
        );

        const data = await response.json();
        
        for (const country of data.data.objects) {
            const div = document.createElement("div");
            div.classList.add("bg-white", "rounded-2xl", "overflow-hidden", "border", "border-slate-200", "shadow-sm", "hover:shadow-lg", "hover:-translate-y-1", "transition-all", "duration-300"
            );
            
            div.innerHTML = `
            <div class="h-56 overflow-hidden">
            <img src="${country.flag.url_svg}" alt="${country.names} Flag" class="w-full h-full object-cover">
            </div>

                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-sky-600">
                            ${country.region}
                        </span>

                        <span class="text-sm text-slate-500">
                            ${country.capitals?.[0]?.name}
                        </span>
                    </div>

                    <h3 class="text-2xl font-bold text-[#071A2F] mb-3">
                        ${country.names?.common}
                    </h3>

                    <p class="text-base leading-7 text-slate-600 mb-5">
                        Population: ${
                            country.population != null
                                ? country.population.toLocaleString("en-IN")
                                : "Not Available"
                        }
                    </p>

                    <button class="w-full py-3 px-5 rounded-xl bg-[#071A2F] text-white font-semibold hover:bg-sky-600 transition-colors duration-300">
                        Explore More
                    </button>
                </div>
            `;

            API_data.append(div);
        }
    } catch (error) {
        console.log("Error:", error);
    }
}

apiHandler();
