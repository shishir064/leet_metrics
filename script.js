document.addEventListener("DOMContentLoaded", function (){
    const searchButton = document.getElementById("search_btn");
    const usernameInput = document.getElementById("user-input");
    const easyLabel = document.getElementById("easyLabel");
    const mediumLabel = document.getElementById("mediumLabel");
    const hardLabel = document.getElementById("hardLabel");
    const stats = document.querySelector(".stats");
    const statsContainer = document.querySelector(".stats-cards");

    function validateUsername (username){
        if(username.trim() === ""){
            alert("Username should not be empty!");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching){
            alert("Invalid username");
        }
        return isMatching;

    }

    async function fetchUserDetails(username){
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if (!response.ok){
                throw new Error("Unable to fetch a user details");
            }
            let usersData = await response.json();
            console.log(usersData);
            displayUserData(usersData);

        }
        catch(error){
            stats.innerHTML = `<p>Unable to found data </p>`;
            // stats.innerHTML = `<p>${error.message}</p>`;
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }

    }
    
    function updateProgress(solved,total,label){
        label.textContent = `${solved}/${total}`;

    }

    function displayUserData(usersData){
        const totalEasyQues = `${usersData.totalEasy}`;
        const totalMediumQues = `${usersData.totalMedium}`;
        const totalHardQues = `${usersData.totalHard}`;
        const solvedEasy = `${usersData.easySolved}`;
        const solvedMedium = `${usersData.mediumSolved}`;
        const solvedHard = `${usersData.hardSolved}`;

        console.log(totalEasyQues);

        updateProgress(totalEasyQues, solvedEasy, easyLabel);
        updateProgress(totalMediumQues, solvedMedium, mediumLabel);
        updateProgress(totalHardQues, solvedHard, hardLabel);
        const cardsData = [
            {label: "Ranking", value:usersData.ranking},
            {label: "acceptanceRate", value:usersData.acceptanceRate},
            {label: "contributionPoints", value:usersData.contributionPoints},
            {label: "reputation", value:usersData.reputation}
        ];
        console.log(cardsData);

        statsContainer.innerHTML = cardsData.map(
            data => {
                return `
                <div class="bg-white/10 rounded-xl p-4 text-center text-white border border-white/20 hover:scale-105 transition">
                <p class="text-md text-gray-300">${data.label}</p>
                <p class="text-xl font-semibold">${data.value}</p>
                </div>
                `
            }
        ).join("");

   

    }
    function cleanUi(){
        easyLabel.textContent = "";
        mediumLabel.textContent = "";
        hardLabel.textContent = "";
        statsContainer.innerHTML = "";
    }

    searchButton.addEventListener("click", function (){
        const username = usernameInput.value;
        console.log(username);
        if (validateUsername(username)){
            cleanUi();
            fetchUserDetails(username);
        }
       
    })
})