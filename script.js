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
const skeletonContainer = document.querySelector("#country_skeleton");

const searchInput = document.querySelector("#search_input");
const searchBtn = document.querySelector("#search_btn");

let countries = [];

// 1. Skeleton Loading
function showSkeleton() {
    skeletonContainer.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const div = document.createElement("div");

        div.className =
            "bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-6";

        div.innerHTML = `
            <div class="h-56 bg-slate-200 animate-pulse rounded-lg mb-6"></div>
            <div class="h-4 w-1/3 bg-slate-200 animate-pulse rounded mb-4"></div>
            <div class="h-7 w-3/4 bg-slate-200 animate-pulse rounded mb-4"></div>
            <div class="h-4 w-full bg-slate-200 animate-pulse rounded mb-3"></div>
            <div class="h-4 w-2/3 bg-slate-200 animate-pulse rounded mb-6"></div>
            <div class="h-12 w-full bg-slate-200 animate-pulse rounded-xl"></div>
        `;

        skeletonContainer.append(div);
    }
}

// 2. Country Cards Display
function displayCountries(countryList) {
    API_data.innerHTML = "";

    if (countryList.length === 0) {
        API_data.innerHTML = `
            <div class="col-span-3 text-center py-12">
                <h2 class="text-2xl font-bold text-[#071A2F]">
                    Country Not Found
                </h2>
                <p class="text-slate-500 mt-2">
                    Please try another country name.
                </p>
            </div>
        `;
        return;
    }

    for (const country of countryList) {
        const div = document.createElement("div");

        div.classList.add(
            "bg-white",
            "rounded-2xl",
            "overflow-hidden",
            "border",
            "border-slate-200",
            "shadow-sm",
            "hover:shadow-lg",
            "hover:-translate-y-1",
            "transition-all",
            "duration-300"
        );

        div.innerHTML = `
            <div class="h-56 overflow-hidden relative">
                <img
                    src="${country.flag?.url_svg || ""}"
                    alt="${country.names?.common || "Country"} Flag"
                    class="w-full h-full object-cover"
                >

                <button
                    type="button"
                    class="like_btn absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md text-xl text-slate-500 hover:text-rose-500 transition-colors duration-300"
                >
                    ♡
                </button>
            </div>

            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium text-sky-600">
                        ${country.region || "Not Available"}
                    </span>

                    <span class="text-sm text-slate-500">
                        ${country.capitals?.[0]?.name || "Not Available"}
                    </span>
                </div>

                <h3 class="text-2xl font-bold text-[#071A2F] mb-3">
                    ${country.names?.common || "Unknown Country"}
                </h3>

                <p class="text-base leading-7 text-slate-600 mb-5">
                    Population: ${
                        country.population != null
                            ? Number(country.population).toLocaleString("en-IN")
                            : "Not Available"
                    }
                </p>

                <button
                    type="button"
                    class="w-full py-3 px-5 rounded-xl bg-[#071A2F] text-white font-semibold hover:bg-sky-600 transition-colors duration-300"
                >
                    Explore More
                </button>
            </div>
        `;

        // Like Button
        const likeBtn = div.querySelector(".like_btn");

        likeBtn.addEventListener("click", function () {
            if (likeBtn.innerHTML.trim() === "♡") {
                likeBtn.innerHTML = "♥";
                likeBtn.classList.remove("text-slate-500");
                likeBtn.classList.add("text-rose-500");
            } else {
                likeBtn.innerHTML = "♡";
                likeBtn.classList.remove("text-rose-500");
                likeBtn.classList.add("text-slate-500");
            }
        });

        API_data.append(div);
    }
}

// 3. Fetch API
async function apiHandler() {
    showSkeleton();
    API_data.innerHTML = "";

    try {
        const response = await fetch(
            "https://api.restcountries.com/countries/v5?limit=100",
            {
                headers: {
                    // Apna valid API token yahan lagao.
                    "Authorization": "Bearer rc_live_cbafff3a94e448d0869bca1df9639ba7"
                }
            }
        );

        if (!response.ok) {
            throw new Error("API request failed: " + response.status);
        }

        const data = await response.json();

        console.log("API Response:", data);

        // API se countries save karna
        countries = data?.data?.objects;

        if (!Array.isArray(countries)) {
            throw new Error("Countries data array nahi mila. API response check karo.");
        }

        // Saare cards show karna
        displayCountries(countries);

    } catch (error) {
        console.error("Error:", error);

        API_data.innerHTML = `
            <div class="col-span-3 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl px-8 py-14 shadow-sm">
                <div class="w-20 h-20 flex items-center justify-center rounded-full bg-sky-50 border border-sky-100 mb-6">
                    <span class="text-4xl">🌍</span>
                </div>

                <h2 class="text-2xl font-bold text-[#071A2F] mb-3">
                    Oops! Lost Connection
                </h2>

                <p class="max-w-md text-base leading-7 text-slate-500 mb-7">
                    Countries load nahi ho paaye.
                    Internet, API token aur Console error check karo.
                </p>

                <button
                    id="retry_btn"
                    class="px-8 py-3 rounded-xl bg-[#071A2F] text-white font-semibold hover:bg-sky-600 transition-all duration-300 shadow-md"
                >
                    Try Again
                </button>
            </div>
        `;

        document
            .querySelector("#retry_btn")
            .addEventListener("click", function () {
                apiHandler();
            });

    } finally {
        skeletonContainer.innerHTML = "";
    }
}

// 4. Search Button

function searchCountries() {
    const searchValue = searchInput.value.trim().toLowerCase();

    const filteredCountries = countries.filter(function (country) {
        const countryName = country.names?.common || "";

        return countryName.toLowerCase().includes(searchValue);
    });

    displayCountries(filteredCountries);
}

searchBtn.addEventListener("click", searchCountries);


// 5. Enter press karne par search
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchCountries();
    }
});

// 6. API call
apiHandler();
