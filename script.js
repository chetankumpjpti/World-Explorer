
// Animated Counter

const Counters = document.querySelectorAll(".counter");

Counters.forEach((counter) => {

    const target = Number(counter.dataset.target.replace(/,/g, ""));
    let count = 0;

    const interval = setInterval(() => {

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

const favoriteCount = document.querySelector("#favorite_count");

const regionFilter = document.querySelector("#region_filter");
const sortFilter = document.querySelector("#sort_filter");


// Compare Page Elements

const countryOne = document.querySelector("#country_one");
const countryTwo = document.querySelector("#country_two");
const compareDetails = document.querySelector("#compare_details");


// Global Data

let countries = [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let compareCountries = JSON.parse(
    localStorage.getItem("compareCountries")
) || [];


// Country Name

function getCountryName(country) {

    return country.name || country.names?.common || "Unknown Country";

}


// Country ID

function getCountryId(country) {

    return country.name || country.names?.common || "Unknown Country";

}


// Country Capital

function getCountryCapital(country) {

    return country.capital || "Not Available";

}


// Country Flag

function getCountryFlag(country) {

    return country.flags?.svg || country.flags?.png || "";

}


// Show Skeleton Loading

function showSkeleton() {

    if (!skeletonContainer) return;

    skeletonContainer.innerHTML = "";

    for (let i = 0; i < 6; i++) {

        const div = document.createElement("div");

        div.className =
            "bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-4 sm:p-6";

        div.innerHTML = `
            <div class="h-40 sm:h-56 bg-slate-200 animate-pulse rounded-lg mb-5"></div>
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
            <div class="col-span-full text-center py-10 sm:py-12 px-4">

                <h2 class="text-2xl font-bold text-[#071A2F]">
                    ${container === favoritesData
                        ? "No Favorite Countries Yet"
                        : "Country Not Found"}
                </h2>

                <p class="text-slate-500 mt-2">
                    ${container === favoritesData
                        ? "Like a country to add it to your favorites."
                        : "Please try another country name."}
                </p>

            </div>
        `;

        return;

    }


    for (const country of countryList) {

        const countryId = getCountryId(country);

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

            <div class="h-44 sm:h-56 overflow-hidden relative">

                <img
                    src="${getCountryFlag(country)}"
                    alt="${getCountryName(country)} Flag"
                    class="w-full h-full object-cover"
                >

                <button
                    type="button"
                    class="like_btn absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md text-xl ${isFavorite ? "text-rose-500" : "text-slate-500"} hover:text-rose-500 transition-colors duration-300"
                >
                    ${isFavorite ? "♥" : "♡"}
                </button>

            </div>


            <div class="p-4 sm:p-6">

                <div class="flex items-center justify-between mb-3">

                    <span class="text-sm font-medium text-sky-600">
                        ${country.region || "Not Available"}
                    </span>

                    <span class="text-sm text-slate-500">
                        ${getCountryCapital(country)}
                    </span>

                </div>


                <h3 class="text-xl sm:text-2xl font-bold text-[#071A2F] mb-3 break-words">
                    ${getCountryName(country)}
                </h3>


                <p class="text-sm sm:text-base leading-7 text-slate-600 mb-5">

                    Population:

                    ${country.population != null
                        ? Number(country.population).toLocaleString("en-IN")
                        : "Not Available"}

                </p>


                <button
                    type="button"
                    class="explore_btn w-full py-3 px-5 rounded-xl bg-[#071A2F] text-white font-semibold hover:bg-sky-600 transition-colors duration-300"
                >
                    Explore More →
                </button>


                <button
                    type="button"
                    class="compare_btn w-full py-3 px-5 mt-3 rounded-xl border-2 border-sky-600 text-sky-600 font-semibold hover:bg-sky-600 hover:text-white transition-colors duration-300"
                >
                    Compare Country
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


            localStorage.setItem(
                "favorites",
                JSON.stringify(favorites)
            );


            if (favoriteCount) {
                favoriteCount.textContent = favorites.length;
            }


            if (favorites.includes(countryId)) {

                likeBtn.innerHTML = "♥";

                likeBtn.classList.remove("text-slate-500");
                likeBtn.classList.add("text-rose-500");

            } else {

                likeBtn.innerHTML = "♡";

                likeBtn.classList.remove("text-rose-500");
                likeBtn.classList.add("text-slate-500");

            }


            if (container === favoritesData) {

                displayFavorites();

            }

        });


        // Explore More Button

        const exploreBtn = div.querySelector(".explore_btn");

        exploreBtn.addEventListener("click", function () {

            showCountryDetails(country);

        });


        // Compare Button

        const compareBtn = div.querySelector(".compare_btn");

        compareBtn.addEventListener("click", function () {

            addToCompare(country);

        });


        container.append(div);

    }

}


// Add Country to Compare

function addToCompare(country) {

    const countryId = getCountryId(country);

    const alreadyAdded = compareCountries.some(item => {

        return getCountryId(item) === countryId;

    });


    if (alreadyAdded) {

        alert("This country is already selected!");

        return;

    }


    if (compareCountries.length >= 2) {

        alert("You can compare only 2 countries!");

        return;

    }


    compareCountries.push(country);

    localStorage.setItem(
        "compareCountries",
        JSON.stringify(compareCountries)
    );


    alert(getCountryName(country) + " added to comparison!");

}


// Display Favorite Countries

function displayFavorites() {

    if (!favoritesData) return;

    const favoriteCountries = countries.filter(country => {

        const countryId = getCountryId(country);

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

    const mainFooter = document.querySelector("body > footer");

    if (mainFooter) {
        mainFooter.classList.add("hidden");
    }


    // Country Information

    const countryName = getCountryName(country);

    const officialName = "Not Available";

    const capital = getCountryCapital(country);

    const population = country.population != null
        ? Number(country.population).toLocaleString("en-IN")
        : "Not Available";

    const flag = getCountryFlag(country);


    // Details Not Included in Current API

    const area = "Not Available";

    const nativeName = "Not Available";

    const languages = "Not Available";

    const currencies = "Not Available";

    const borders = "Not Available";

    const coordinates = "Not Available";


    // Country Details HTML

    detailsContainer.innerHTML = `

        <section class="w-full min-h-screen bg-[#F1F7FC] py-6 sm:py-8">

            <div class="max-w-6xl mx-auto px-4 sm:px-6">


                <!-- Back Button -->

                <button id="back_btn"
                    class="mb-6 bg-[#071A2F] text-white px-5 py-2.5 rounded-lg hover:bg-sky-600 transition duration-300">

                    <i class="fa-solid fa-arrow-left mr-2"></i>

                    Back to Explore

                </button>


                <!-- Country Header -->

                <div class="bg-[#071A2F] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 mb-7">

                    <img
                        src="${flag}"
                        alt="${countryName} Flag"
                        class="w-full sm:w-56 h-48 sm:h-36 object-cover rounded-xl"
                    >

                    <div class="w-full min-w-0 text-center sm:text-left">

                        <p class="text-[#38BDF8] tracking-[4px] text-xs font-semibold mb-3">
                            COUNTRY PROFILE
                        </p>

                        <h1 class="text-2xl sm:text-4xl font-bold text-white mb-2 break-words">
                            ${countryName}
                        </h1>

                        <p class="text-gray-400 text-sm sm:text-base mb-4 break-words">
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

                    <h2 class="text-2xl font-bold text-[#071A2F] mb-5">
                        Basic Information
                    </h2>


                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


                        <div class="bg-white p-4 sm:p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-landmark text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Capital</p>

                            <h3 class="text-base sm:text-lg font-bold text-[#071A2F] break-words">
                                ${capital}
                            </h3>

                        </div>


                        <div class="bg-white p-4 sm:p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-users text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Population</p>

                            <h3 class="text-base sm:text-lg font-bold text-[#071A2F] break-words">
                                ${population}
                            </h3>

                        </div>


                        <div class="bg-white p-4 sm:p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-ruler-combined text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Area</p>

                            <h3 class="text-base sm:text-lg font-bold text-[#071A2F]">
                                ${area}
                            </h3>

                        </div>


                        <div class="bg-white p-4 sm:p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-globe text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Region</p>

                            <h3 class="text-base sm:text-lg font-bold text-[#071A2F]">
                                ${country.region || "Not Available"}
                            </h3>

                        </div>


                        <div class="bg-white p-4 sm:p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-language text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Languages</p>

                            <h3 class="text-base sm:text-lg font-bold text-[#071A2F]">
                                ${languages}
                            </h3>

                        </div>


                        <div class="bg-white p-4 sm:p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-money-bill-wave text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Currencies</p>

                            <h3 class="text-base sm:text-lg font-bold text-[#071A2F]">
                                ${currencies}
                            </h3>

                        </div>


                        <div class="bg-white p-4 sm:p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-map-location-dot text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Subregion</p>

                            <h3 class="text-base sm:text-lg font-bold text-[#071A2F]">
                                Not Available
                            </h3>

                        </div>


                        <div class="bg-white p-4 sm:p-5 rounded-xl border border-[#D6E3EF]">

                            <i class="fa-solid fa-code text-[#0284C7] text-lg mb-3"></i>

                            <p class="text-gray-500 text-sm mb-2">Country Code</p>

                            <h3 class="text-base sm:text-lg font-bold text-[#071A2F]">
                                Not Available
                            </h3>

                        </div>


                    </div>

                </div>


                <!-- General Details and Geography -->

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">


                    <!-- General Details -->

                    <div class="bg-white border border-[#D6E3EF] rounded-2xl p-4 sm:p-6">

                        <h2 class="text-xl font-bold text-[#071A2F] mb-5">

                            <i class="fa-solid fa-circle-info text-[#0284C7] mr-2"></i>

                            General Details

                        </h2>


                        <div class="space-y-4">

                            <div class="flex justify-between gap-4 border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Native Name</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${nativeName}
                                </span>

                            </div>


                            <div class="flex justify-between gap-4 border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Languages</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${languages}
                                </span>

                            </div>


                            <div class="flex justify-between gap-4 border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Currency</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${currencies}
                                </span>

                            </div>


                            <div class="flex justify-between gap-4 border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Driving Side</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    Not Available
                                </span>

                            </div>


                            <div class="flex justify-between gap-4">

                                <span class="text-gray-500 text-sm">Start of Week</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    Not Available
                                </span>

                            </div>

                        </div>

                    </div>


                    <!-- Geography -->

                    <div class="bg-white border border-[#D6E3EF] rounded-2xl p-4 sm:p-6">

                        <h2 class="text-xl font-bold text-[#071A2F] mb-5">

                            <i class="fa-solid fa-earth-asia text-[#0284C7] mr-2"></i>

                            Geography

                        </h2>


                        <div class="space-y-4">


                            <div class="flex justify-between gap-4 border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Continent</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${country.region || "Not Available"}
                                </span>

                            </div>


                            <div class="flex justify-between gap-4 border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Latitude</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${coordinates}
                                </span>

                            </div>


                            <div class="flex justify-between gap-4 border-b border-slate-200 pb-3">

                                <span class="text-gray-500 text-sm">Longitude</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    ${coordinates}
                                </span>

                            </div>


                            <div class="flex justify-between gap-4">

                                <span class="text-gray-500 text-sm">Timezones</span>

                                <span class="font-semibold text-[#071A2F] text-sm">
                                    Not Available
                                </span>

                            </div>


                        </div>

                    </div>


                </div>


                <!-- Border Countries -->

                <div class="bg-white border border-[#D6E3EF] rounded-2xl p-4 sm:p-6">

                    <p class="text-[#0284C7] text-xs tracking-[4px] font-semibold mb-2">
                        NEIGHBORING NATIONS
                    </p>

                    <h2 class="text-2xl font-bold text-[#071A2F] mb-5">
                        Border Countries
                    </h2>

                    <div class="flex flex-wrap gap-3">

                        <p class="text-gray-500">
                            ${borders}
                        </p>

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

        const mainFooter = document.querySelector("body > footer");

        if (mainFooter) {
            mainFooter.classList.remove("hidden");
        }


        document.querySelectorAll("body > header, body > section").forEach((element) => {

            element.classList.remove("hidden");

        });


        document.documentElement.scrollTop = 0;

    });


    document.documentElement.scrollTop = 0;

}


// COMPARE COUNTRIES FUNCTIONALITY


// Get Compare Capital

function getCompareCapital(country) {

    return country.capital || "Not Available";

}


// Display Country Card on Compare Page

function displayCompareCountry(country, container, index) {

    if (!country) {

        container.innerHTML = `

            <div class="h-40 bg-slate-100 rounded-xl flex items-center justify-center mb-5">

                <span class="text-slate-400 text-lg">
                    Select a Country
                </span>

            </div>


            <h2 class="text-2xl font-bold text-[#071A2F] mb-2">
                No Country Selected
            </h2>


            <p class="text-slate-500 mb-5">
                Choose a country to compare.
            </p>


            <button type="button" class="change_country w-full py-3 rounded-xl bg-[#071A2F] text-white font-semibold hover:bg-sky-600 transition">
                Change Country
            </button>

        `;

    } else {

        container.innerHTML = `

            <div class="h-40 bg-slate-100 rounded-xl flex items-center justify-center mb-5 overflow-hidden">

                <img
                    src="${getCountryFlag(country)}"
                    alt="${getCountryName(country)} Flag"
                    class="w-full h-full object-contain p-4"
                >

            </div>


            <h2 class="text-2xl font-bold text-[#071A2F] mb-2">
                ${getCountryName(country)}
            </h2>


            <p class="text-slate-500 mb-5">
                ${country.region || "Not Available"}
            </p>


            <button type="button" class="change_country w-full py-3 rounded-xl bg-[#071A2F] text-white font-semibold hover:bg-sky-600 transition">
                Change Country
            </button>

        `;

    }


    // Change Country Button

    const changeButton = container.querySelector(".change_country");

    changeButton.addEventListener("click", function () {

        changeCompareCountry(index);

    });

}


// Display Comparison Details

function displayComparisonDetails() {

    if (!compareDetails) return;


    if (compareCountries.length < 2) {

        compareDetails.innerHTML = `

            <p class="text-center text-slate-500 py-5">

                Please select two countries to compare.

                Select countries from the Explore page.

            </p>

        `;

        return;

    }


    const firstCountry = compareCountries[0];

    const secondCountry = compareCountries[1];


    const comparisonData = [

        {
            label: "Population",

            first: firstCountry.population != null
                ? Number(firstCountry.population).toLocaleString("en-IN")
                : "Not Available",

            second: secondCountry.population != null
                ? Number(secondCountry.population).toLocaleString("en-IN")
                : "Not Available"
        },


        {
            label: "Capital",

            first: getCompareCapital(firstCountry),

            second: getCompareCapital(secondCountry)
        },


        {
            label: "Region",

            first: firstCountry.region || "Not Available",

            second: secondCountry.region || "Not Available"
        },


        {
            label: "Area",

            first: "Not Available",

            second: "Not Available"
        },


        {
            label: "Currency",

            first: "Not Available",

            second: "Not Available"
        },


        {
            label: "Languages",

            first: "Not Available",

            second: "Not Available"
        }

    ];


    compareDetails.innerHTML = comparisonData.map(item => `

        <div class="grid grid-cols-3 gap-4 items-center border-b border-slate-200 pb-5">

            <div class="font-semibold text-[#071A2F]">
                ${item.label}
            </div>


            <div class="text-slate-600 text-center break-words">
                ${item.first}
            </div>


            <div class="text-slate-600 text-center break-words">
                ${item.second}
            </div>

        </div>

    `).join("");

}


// Change Country

function changeCompareCountry(index) {

    if (!countries.length) {

        alert("Countries are still loading. Please try again.");

        return;

    }


    const countryName = prompt("Enter country name:");

    if (!countryName) return;


    const selectedCountry = countries.find(country => {

        return getCountryName(country).toLowerCase() ===
            countryName.trim().toLowerCase();

    });


    if (!selectedCountry) {

        alert("Country not found. Please enter the correct country name.");

        return;

    }


    const alreadySelected = compareCountries.some((country, i) => {

        return i !== index &&
            getCountryId(country) === getCountryId(selectedCountry);

    });


    if (alreadySelected) {

        alert("This country is already selected!");

        return;

    }


    compareCountries[index] = selectedCountry;


    localStorage.setItem(
        "compareCountries",
        JSON.stringify(compareCountries)
    );


    displayComparePage();

}


// Display Complete Compare Page

function displayComparePage() {

    if (!countryOne || !countryTwo || !compareDetails) return;


    displayCompareCountry(compareCountries[0], countryOne, 0);

    displayCompareCountry(compareCountries[1], countryTwo, 1);

    displayComparisonDetails();

}


// END COMPARE COUNTRIES FUNCTIONALITY


// Fetch Country Data

async function apiHandler() {

    showSkeleton();

    if (API_data) {
        API_data.innerHTML = "";
    }


    try {

        const response = await fetch(
            "https://countries.dev/countries?fields=name,capital,region,population,flags"
        );


        if (!response.ok) {

            throw new Error("API request failed: " + response.status);

        }


        const data = await response.json();

        console.log("API Response:", data);


        // API returns a direct array

        countries = data;


        if (!Array.isArray(countries)) {

            throw new Error("Countries data array not found. Please check the API response.");

        }


        // Display Countries

        if (API_data) {

            displayCountries(countries);

        }


        // Display Favorites

        displayFavorites();


        // Display Compare Page

        if (compareDetails) {

            displayComparePage();

        }


        // Favorite Count

        if (favoriteCount) {

            favoriteCount.textContent = favorites.length;

        }


        // Console Check

        console.log("First Country:", countries[0]);

        console.log("Compare Countries:", compareCountries);

        console.log("Country Flag:", countries[0]?.flags);

        console.log("All Country Keys:", Object.keys(countries[0] || {}));


    } catch (error) {

        console.error("Error:", error);


        if (API_data) {

            API_data.innerHTML = `

                <div class="col-span-full flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl px-4 sm:px-8 py-10 sm:py-14 shadow-sm">

                    <div class="w-20 h-20 flex items-center justify-center rounded-full bg-sky-50 border border-sky-100 mb-6">

                        <span class="text-4xl">🌍</span>

                    </div>


                    <h2 class="text-xl sm:text-2xl font-bold text-[#071A2F] mb-3">
                        Oops! Lost Connection
                    </h2>


                    <p class="max-w-md text-base leading-7 text-slate-500 mb-7">

                        Countries load nahi ho paaye.

                        Internet aur Console error check karo.

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


// Search, Filter and Sort Countries

function searchCountries() {

    if (!searchInput || !regionFilter || !sortFilter || !API_data) return;


    let filteredCountries = [...countries];


    // Search Country

    const searchValue = searchInput.value.toLowerCase().trim();

    filteredCountries = filteredCountries.filter((country) => {

        return (country.name || "")
            .toLowerCase()
            .includes(searchValue);

    });


    // Filter by Region

    const selectedRegion = regionFilter.value;

    if (selectedRegion !== "all") {

        filteredCountries = filteredCountries.filter((country) => {

            return country.region === selectedRegion;

        });

    }


    // Sort Countries

    const selectedSort = sortFilter.value;


    if (selectedSort === "population-high") {

        filteredCountries.sort((a, b) => b.population - a.population);

    }

    else if (selectedSort === "population-low") {

        filteredCountries.sort((a, b) => a.population - b.population);

    }


    // Display Countries

    displayCountries(filteredCountries);

}


// Search Button

if (searchBtn) {

    searchBtn.addEventListener("click", searchCountries);

}


// Search Enter Key

if (searchInput) {

    searchInput.addEventListener("keyup", function (event) {

        if (event.key === "Enter") {

            searchCountries();

        }

    });

}


// Region Filter

if (regionFilter) {

    regionFilter.addEventListener("change", searchCountries);

}


// Sort Filter

if (sortFilter) {

    sortFilter.addEventListener("change", searchCountries);

}


// Mobile Navigation

const menuBtn = document.querySelector("#menu_btn");

const mobileNav = document.querySelector("#mobile_nav");


if (menuBtn && mobileNav) {

    menuBtn.addEventListener("click", function () {

        mobileNav.classList.toggle("hidden");

    });

}


// Call API

apiHandler();
