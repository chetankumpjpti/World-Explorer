// Animated Counter

const Counters = document.querySelectorAll(".counter");

Counters.forEach((counter) => {

    let target = Number(counter.dataset.target.replace(",", ""));
    let count = 0;

    let interval = setInterval(() => {

        count++;
        counter.textContent = count.toLocaleString("en-IN") + " +";

        if (count >= target) {
            clearInterval(interval);
        }

    }, 100);

});


// Select Elements

const API_data = document.querySelector("#API_data");
const skeletonContainer = document.querySelector("#country_skeleton");

const searchInput = document.querySelector("#search_input");
const searchBtn = document.querySelector("#search_btn");

const detailsContainer = document.querySelector("#country_details");
const favoritesData = document.querySelector("#favorites_data");

let countries = [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


// Show Skeleton Loading

function showSkeleton() {

    if (!skeletonContainer) return;

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


// Display Country Cards

function displayCountries(countryList, container = API_data) {

    if (!container) return;

    container.innerHTML = "";

    if (countryList.length === 0) {

        container.innerHTML = `
            <div class="col-span-3 text-center py-12">

                <h2 class="text-2xl font-bold text-[#071A2F]">
                    ${container === favoritesData
                        ? "No Favorite Countries Yet"
                        : "Country Not Found"}
                </h2>

                <p class="text-slate-500 mt-2">
                    ${container === favoritesData
                        ? "Like a country to add it to your favorites."
                        : "Please try another country name."
                    }
                </p>

            </div>
        `;

        return;
    }

    for (const country of countryList) {

        const countryId = country.cca2 || country.code || country.names?.common;

        const isFavorite = favorites.includes(countryId);

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
                    class="like_btn absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md text-xl ${isFavorite ? "text-rose-500" : "text-slate-500"} hover:text-rose-500 transition-colors duration-300"
                >
                    ${isFavorite ? "♥" : "♡"}
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
                    Population:
                    ${
                        country.population != null
                            ? Number(country.population).toLocaleString("en-IN")
                            : "Not Available"
                    }
                </p>

                <button
                    type="button"
                    class="explore_btn w-full py-3 px-5 rounded-xl bg-[#071A2F] text-white font-semibold hover:bg-sky-600 transition-colors duration-300"
                >
                    Explore More →
                </button>

            </div>

        `;


        // Like Button

        const likeBtn = div.querySelector(".like_btn");

        likeBtn.addEventListener("click", function () {

            if (favorites.includes(countryId)) {

                favorites = favorites.filter(id => id !== countryId);

            } else {

                favorites.push(countryId);

            }

            localStorage.setItem("favorites", JSON.stringify(favorites));

            if (favorites.includes(countryId)) {

                likeBtn.innerHTML = "♥";

                likeBtn.classList.remove("text-slate-500");
                likeBtn.classList.add("text-rose-500");

            } else {

                likeBtn.innerHTML = "♡";

                likeBtn.classList.remove("text-rose-500");
                likeBtn.classList.add("text-slate-500");

            }

            // Refresh Favorites Page

            if (container === favoritesData) {

                displayFavorites();

            }

        });


        // Explore More Button

        const exploreBtn = div.querySelector(".explore_btn");

        exploreBtn.addEventListener("click", function () {

            showCountryDetails(country);

        });

        container.append(div);

    }

}


// Display Favorite Countries

function displayFavorites() {

    if (!favoritesData) return;

    const favoriteCountries = countries.filter(country => {

        const countryId = country.cca2 || country.code || country.names?.common;

        return favorites.includes(countryId);

    });

    displayCountries(favoriteCountries, favoritesData);

}


// Show Country Details

function showCountryDetails(country) {

    if (!detailsContainer) return;

    // Hide Main Page

    document.querySelectorAll("body > header, body > section").forEach((element) => {

        element.classList.add("hidden");

    });


    // Show Details Container

    detailsContainer.classList.remove("hidden");


    // Get Country Information

    const countryName = country.names?.common || "Not Available";

    const officialName = country.names?.official || "Not Available";

    const capital = country.capitals?.[0]?.name || "Not Available";

    const population = country.population != null
        ? Number(country.population).toLocaleString("en-IN")
        : "Not Available";

    const area = country.area != null
        ? Number(country.area).toLocaleString("en-IN") + " km²"
        : "Not Available";

    const flag = country.flag?.url_svg || "";


    // Native Name

    const nativeName = country.names?.native
        ? Object.values(country.names.native)
            .map(name => name.common || name.official)
            .join(", ")
        : "Not Available";


    // Languages

    const languages = country.languages
        ? Object.values(country.languages).map(lang =>
            typeof lang === "string" ? lang : lang.name || "Unknown"
        ).join(", ")
        : "Not Available";


    // Currencies

    const currencies = country.currencies
        ? Object.values(country.currencies).map(currency =>
            typeof currency === "string"
                ? currency
                : `${currency.name || "Unknown"} (${currency.symbol || ""})`
        ).join(", ")
        : "Not Available";


    const borders = country.borders || [];

    const coordinates = country.latlng || [];


    // Get Border Countries

    const borderHTML = borders.length

        ? borders.map(border => `

            <span class="bg-[#12304A] text-[#38BDF8] px-4 py-2 rounded-lg font-medium">
                ${typeof border === "string" ? border : border.name || "Unknown"}
            </span>

        `).join("")

        : `
            <p class="text-gray-500">
                No border countries available.
            </p>
        `;


    // Create Country Details HTML

    detailsContainer.innerHTML = `

        <section class="w-full min-h-screen bg-[#F1F7FC] py-8">

            <div class="max-w-6xl mx-auto px-6">

                <!-- Back Button -->

                <button id="back_btn"
                    class="mb-6 bg-[#071A2F] text-white px-5 py-2.5 rounded-lg hover:bg-sky-600 transition duration-300">

                    <i class="fa-solid fa-arrow-left mr-2"></i>

                    Back to Explore

                </button>


                <!-- Country Header -->

                <div class="bg-[#071A2F] rounded-2xl p-6 flex items-center gap-8 mb-7">

                    <img
                        src="${flag}"
                        alt="${countryName} Flag"
                        class="w-56 h-36 object-cover rounded-xl"
                    >

                    <div>

                        <p class="text-[#38BDF8] tracking-[4px] text-xs font-semibold mb-3">
                            COUNTRY PROFILE
                        </p>

                        <h1 class="text-4xl font-bold text-white font-['Poppins'] mb-2">
                            ${countryName}
                        </h1>

                        <p class="text-gray-400 text-base mb-4">
                            ${officialName}
                        </p>

                        <span class="bg-[#12304A] text-[#38BDF8] px-4 py-2 rounded-full text-sm">
                            ${country.region || "Not Available"}
                        </span>

                    </div>

                </div>


                <!-- Basic Information -->

                <div class="mb-8">

                    <p class="text-[#0284C7] text-xs tracking-[4px] font-semibold mb-2">
                        COUNTRY OVERVIEW
                    </p>

                    <h2 class="text-2xl font-bold text-[#071A2F] mb-5 font-['Poppins']">
                        Basic Information
                    </h2>


                    <div class="grid grid-cols-3 gap-4">


                        <div class="bg-white p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-landmark text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Capital</p>

                            <h3 class="text-lg font-bold text-[#071A2F]">
                                ${capital}
                            </h3>

                        </div>


                        <div class="bg-white p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-users text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Population</p>

                            <h3 class="text-lg font-bold text-[#071A2F]">
                                ${population}
                            </h3>

                        </div>


                        <div class="bg-white p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-ruler-combined text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Area</p>

                            <h3 class="text-lg font-bold text-[#071A2F]">
                                ${area}
                            </h3>

                        </div>


                        <div class="bg-white p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-globe text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Region</p>

                            <h3 class="text-lg font-bold text-[#071A2F]">
                                ${country.region || "Not Available"}
                            </h3>

                        </div>


                        <div class="bg-white p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-map-location-dot text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Subregion</p>

                            <h3 class="text-lg font-bold text-[#071A2F]">
                                ${country.subregion || "Not Available"}
                            </h3>

                        </div>


                        <div class="bg-white p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-code text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Country Code</p>

                            <h3 class="text-lg font-bold text-[#071A2F]">
                                ${country.cca2 || country.code || "Not Available"}
                            </h3>

                        </div>


                    </div>

                </div>


                <!-- General Details and Geography -->

                <div class="grid grid-cols-2 gap-5 mb-8">


                    <!-- General Details -->

                    <div class="bg-white border border-[#D6E3EF] rounded-2xl p-6">

                        <h2 class="text-xl font-bold text-[#071A2F] mb-5">

                            <i class="fa-solid fa-circle-info text-[#0284C7] mr-2"></i>

                            General Details

                        </h2>


                        <div class="space-y-4">


                            <div class="flex justify-between border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Native Name</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${nativeName}
                                </span>

                            </div>


                            <div class="flex justify-between border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Languages</span>

                                <span class="font-semibold text-[#071A2F] text-sm text-right">
                                    ${languages}
                                </span>

                            </div>


                            <div class="flex justify-between border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Currency</span>

                                <span class="font-semibold text-[#071A2F] text-sm text-right">
                                    ${currencies}
                                </span>

                            </div>


                            <div class="flex justify-between border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Driving Side</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${country.drivingSide || country.car?.side || "Not Available"}
                                </span>

                            </div>


                            <div class="flex justify-between">

                                <span class="text-gray-500 text-sm">Start of Week</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${country.startOfWeek || "Not Available"}
                                </span>

                            </div>


                        </div>

                    </div>



                    <!-- Geography -->

                    <div class="bg-white border border-[#D6E3EF] rounded-2xl p-6">

                        <h2 class="text-xl font-bold text-[#071A2F] mb-5">

                            <i class="fa-solid fa-earth-asia text-[#0284C7] mr-2"></i>

                            Geography

                        </h2>


                        <div class="space-y-4">


                            <div class="flex justify-between border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Continent</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${country.continents?.join(", ") || "Not Available"}
                                </span>

                            </div>


                            <div class="flex justify-between border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Latitude</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${coordinates[0] ?? "Not Available"}
                                </span>

                            </div>


                            <div class="flex justify-between border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Longitude</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${coordinates[1] ?? "Not Available"}
                                </span>

                            </div>


                            <div class="flex justify-between">

                                <span class="text-gray-500 text-sm">Timezones</span>

                                <span class="font-semibold text-[#071A2F] text-sm text-right">
                                    ${country.timezones?.join(", ") || "Not Available"}
                                </span>

                            </div>


                        </div>

                    </div>


                </div>



                <!-- Border Countries -->

                <div class="bg-white border border-[#D6E3EF] rounded-2xl p-6">

                    <p class="text-[#0284C7] text-xs tracking-[4px] font-semibold mb-2">
                        NEIGHBORING NATIONS
                    </p>

                    <h2 class="text-2xl font-bold text-[#071A2F] mb-5">
                        Border Countries
                    </h2>

                    <div class="flex flex-wrap gap-3">

                        ${borderHTML}

                    </div>

                </div>



                <!-- Footer -->

                <footer class="text-center py-7">

                    <h2 class="text-lg font-bold text-[#0284C7] mb-2">
                        🌍 World Explorer
                    </h2>

                    <p class="text-sm text-gray-500">
                        Explore the world, one country at a time.
                    </p>

                </footer>


            </div>

        </section>

    `;


    // Back Button

    const backBtn = document.querySelector("#back_btn");

    backBtn.addEventListener("click", function () {

        detailsContainer.classList.add("hidden");

        document.querySelectorAll("body > header, body > section").forEach((element) => {

            element.classList.remove("hidden");

        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Fetch Country Data

async function apiHandler() {

    showSkeleton();

    if (API_data) {
        API_data.innerHTML = "";
    }

    try {

        const response = await fetch(
            "https://api.restcountries.com/countries/v5?limit=100",
            {
                headers: {

                     "Authorization": "Bearer rc_live_cbafff3a94e448d0869bca1df9639ba7"

                }
            }
        );


        if (!response.ok) {

            throw new Error("API request failed: " + response.status);

        }


        const data = await response.json();

        console.log("API Response:", data);


        countries = data?.data?.objects;


        if (!Array.isArray(countries)) {

            throw new Error("Countries data array nahi mila. API response check karo.");

        }


        if (API_data) {

            displayCountries(countries);

        }

        displayFavorites();


    } catch (error) {

        console.error("Error:", error);


        if (API_data) {

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

            document.querySelector("#retry_btn").addEventListener("click", function () {

                apiHandler();

            });

        }


    } finally {

        if (skeletonContainer) {

            skeletonContainer.innerHTML = "";

        }

    }

}


// Search Countries

function searchCountries() {

    if (!searchInput || !API_data) return;

    const searchValue = searchInput.value.trim().toLowerCase();


    const filteredCountries = countries.filter(function (country) {

        const countryName = country.names?.common || "";

        return countryName.toLowerCase().includes(searchValue);

    });


    displayCountries(filteredCountries);

}


if (searchBtn && searchInput) {

    searchBtn.addEventListener("click", searchCountries);


    // Search on Enter Key

    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            searchCountries();

        }

    });

}


// Call API

apiHandler();