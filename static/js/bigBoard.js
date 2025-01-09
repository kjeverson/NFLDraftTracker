
function onload(data) {
    getPosition("ALL");
    getDraftPicks(data["current_pick"]);
}

function showDrafted(checkbox) {
    var pos = $(".pos-btn:disabled")[0].getAttribute("data-pos");
    getPosition(pos);
}

function getPosition(pos) {
    var showDraftedCheck = document.getElementById("showDraftedCheckBox")
    var showDrafted = (showDraftedCheck)? showDraftedCheck.checked: false;

    $.ajax({
        url: "/prospectPosition",
        type: "GET",
        data: {
            pos: pos,
            show_drafted: showDrafted
        },
        success: function(data) {
            var object = document.getElementById("bigBoard");
            object.innerHTML=data;
            var button = document.getElementById(pos)
            button.disabled = true;
            button.classList.add("btn-dark");
            var search = document.getElementById("playerSearchBar");
            search.addEventListener("input", (e) => {
                var table = document.getElementById("prospectTable");
                let searchValue = e.target.value.toLowerCase();
                for (let row of table.rows) {
                    let name = row.getAttribute("data-prospect-name");
                    if (row.getAttribute("hidden")) {
                        row.removeAttribute("hidden");
                    }
                    if (!name.includes(searchValue)) {
                        row.setAttribute("hidden", "hidden");
                    }
                }
            })
        }
    })
}

function getProspect(id) {
    $.ajax({
        url: "/prospectModal",
        type: "get",
        data: {id: id},
        success: function(data) {
            var object = document.getElementById("modalContainer");
            object.innerHTML=data;
        },
        complete: function() {
            $('#prospectModal').modal('show');
        }
    })
}

function editProspect(id) {
    $.ajax({
        url: "/editProspectModal",
        type: "get",
        data: {id: id},
        success: function(data) {
            $('#prospectModal').modal("hide");
            var object = document.getElementById("modalContainer");
            object.innerHTML=data;
        },
        complete: function() {
            $('#editProspectModal').modal("show");
        }
    })
}

function addProspectModal() {
    $.ajax({
        url: "/addProspectModal",
        type: "get",
        success: function(data) {
            var object = document.getElementById("modalContainer");
            object.innerHTML=data;
        },
        complete: function() {
            $('#addProspectModal').modal("show");
        }
    })
}

function addProspect() {

    var fname = document.getElementById("addProspectFname");
    var lname = document.getElementById("addProspectLname");
    var position = document.getElementById("addProspectPosition");
    var college = document.getElementById("addProspectCollege");

    $.ajax({
        url: "/addProspect",
        type: "post",
        data: {
            fname: fname.value,
            lname: lname.value,
            position: position.value,
            college: college.options[college.selectedIndex].getAttribute('data-college-id')
        },
        complete: function() {
            $('#addProspectModal').modal("hide");
            getPosition("ALL");
        }
    })
}

function saveProspect(id) {
    var overview = document.getElementById("overviewForm");
    var strengths = document.getElementById("strengthsForm");
    var weaknesses = document.getElementById("weaknessesForm");
    var rank = document.getElementById("rankForm");
    var comparison = document.getElementById("comparisonForm");

    var position = document.getElementById("positionForm");

    var height = document.getElementById("heightForm");
    var weight = document.getElementById("weightForm");

    var forty = document.getElementById("prospectCardForty");
    var vertical = document.getElementById("prospectCardVertical");
    var broad = document.getElementById("prospectCardBroad");
    var three_cone = document.getElementById("prospectCardThreeCone");
    var twenty_shuttle = document.getElementById("prospectCardTwentyShuttle");
    var bench = document.getElementById("prospectCardBench");
    var ras = document.getElementById("prospectCardRAS");

    var favorite = document.getElementById("favoriteProspect");

    $.ajax({
        url: "/saveProspect",
        type: "post",
        data: {
            id: id,
            overview: overview.value,
            strengths: strengths.value,
            weaknesses: weaknesses.value,
            rank: rank.value,
            comparison: comparison.value,
            position: position.value,
            height: height.value,
            weight: weight.value,
            forty: forty.value,
            vertical: vertical.value,
            broad: broad.value,
            three_cone: three_cone.value,
            twenty_shuttle: twenty_shuttle.value,
            bench: bench.value,
            ras: ras.value,
            favorite: favorite.checked
        },
        success: function() {
            $('#editProspectModal').modal("hide");
        }
    })
}

function deleteProspect(id) {
    console.log(id);

    $.ajax({
        url: "/deleteProspect",
        type: "post",
        data: {
            id: id,
        },
        success: function() {
            $('#editProspectModal').modal("hide");
            getPosition("ALL");
        }
    })
}

function createPlaceholder(team_name, team_key, team_color, status) {
    // Add placeholder
    const placeholder = document.createElement("div");
    placeholder.className = "row placeholder";
    //placeholder.style.padding = "20px";
    //placeholder.style.borderRadius = "10px";
    //placeholder.style.backgroundColor = "#" + team_color;
    placeholder.style.transition = "opacity 1s ease"; // Add transition effect

    // Left Column (Team Logo)
    const leftCol = document.createElement("div");
    leftCol.className = "d-flex align-items-center justify-content-center"; // Center-align the logo

    const teamImg = document.createElement("img");
    teamImg.src = `/static/img/NFL/${team_key}.png`;
    teamImg.alt = "Team Logo";
    teamImg.height = 60;
    leftCol.appendChild(teamImg);

    // Right Column (Team Name and "The Pick is In!" Message)
    const rightCol = document.createElement("div");
    rightCol.className = "d-flex flex-column align-items-center justify-content-center";

    // Team Name
    const teamName = document.createElement("small");
    teamName.textContent = team_name;
    teamName.style.color = "#fff";
    teamName.style.fontWeight = "light";
    teamName.style.fontStyle = "italic";

    // Status Message
    const placeholderText = document.createElement("h5");
    placeholderText.textContent = status;
    placeholderText.style.color = "#fff";
    placeholderText.style.fontWeight = "bold";
    placeholderText.style.fontStyle = "italic";


    // Append team name and message to right column
    rightCol.appendChild(teamName);
    rightCol.appendChild(placeholderText);

    // Append both columns to the placeholder
    placeholder.appendChild(leftCol);
    placeholder.appendChild(rightCol);

    return placeholder;

}

function createDraftPickRow(pick) {
    const row = document.createElement("div");
    row.className = "row";

    // Left Column
    const leftCol = document.createElement("div");
    leftCol.className = "col-6";

    const teamImg = document.createElement("img");
    teamImg.src = `/static/img/NFL/${pick['team_key']}.png`; // Adjust path as necessary
    teamImg.height = 60;
    leftCol.appendChild(teamImg);

    const playerNameRow = document.createElement("div");
    playerNameRow.className = "row";

    const playerName = document.createElement("h6");
    playerName.innerHTML = `<strong><span id="pick${pick.ID}CardPlayerName">${pick['sname']}</span></strong>`;
    playerNameRow.appendChild(playerName);
    leftCol.appendChild(playerNameRow);

    const playerInfoRow = document.createElement("div");
    playerInfoRow.className = "row";

    const playerInfo = document.createElement("small");
    const collegeTeam = pick['college']
        ? pick['college']
        : "--";
    playerInfo.innerHTML = `<small><span id="pick${pick.ID}CardPlayerInfo">${pick['position']} | ${collegeTeam}</span></small>`;
    playerInfoRow.appendChild(playerInfo);
    leftCol.appendChild(playerInfoRow);

    // Right Column
    const rightCol = document.createElement("div");
    rightCol.className = "col-6";

    const playerImg = document.createElement("img");
    playerImg.src = `/static/img/headshots/${pick['year']}/${pick['id']}.png`; // Adjust path as necessary
    playerImg.onerror = function () {
        this.src = `/static/img/headshots/default.png`; // Default image
    };
    playerImg.style.width = "100%";
    playerImg.style.height = "100%";
    playerImg.style.objectFit = "cover";
    playerImg.style.borderRadius = "10px";
    rightCol.appendChild(playerImg);

    // Append columns to row
    row.appendChild(leftCol);
    row.appendChild(rightCol);

    return row;
}

function draftProspect(pick_id, prospect_id) {
    var viewingTeamId = document.getElementById("teamCard");

    $.ajax({
        url: "/draftProspect",
        type: "post",
        data: {
            prospect_id: prospect_id,
            pick_id: pick_id
        },
        success: function(data) {
            const audio = document.getElementById('draftChime');
            audio.play();

            var pickCard = document.getElementById("pick" + pick_id);
            pickCard.classList.remove("border-light", "border-3");

            var pickContainer = document.getElementById("pick" + pick_id + "Container");
            pickContainer.classList.remove("col-2");
            pickContainer.classList.add("col-3");

            var pickCardBody = document.getElementById("pick" + pick_id + "CardBody");
            pickCardBody.innerHTML = "";
            pickCardBody.style.height = "140px";

            var placeholder = createPlaceholder(data["team_name"], data["team_key"], data["team_color"], "Pick is In!");
            pickCardBody.appendChild(placeholder);

            // Update the draft status message
            var draftStatus = document.getElementById("draftStatus");
            draftStatus.innerText = data["team_full_name"] + " Pick Is In!"; // Update the draft status text
            draftStatus.style.transition = "opacity 1s ease"; // Ensure smooth transition

            // After 5 seconds, replace the placeholder with the draft pick row
            setTimeout(() => {
                placeholder.style.opacity = "0"; // Fade out

                setTimeout(() => {
                    pickCardBody.innerHTML = ""; // Remove placeholder
                    const draftPickRow = createDraftPickRow(data);
                    draftPickRow.style.opacity = "0"; // Start hidden
                    draftPickRow.style.transition = "opacity 1s ease"; // Add transition effect
                    pickCardBody.appendChild(draftPickRow);

                    draftStatus.innerText = data['nextPickMsg'];
                    draftStatus.style.opacity = "0";
                    draftStatusContainer.style = "background-color: #" + data['nextPickColor'] + ";pointer-events: none; !important";

                    // Fade in the new draft pick row
                    setTimeout(() => {
                        draftPickRow.style.opacity = "1";
                        draftStatus.style.opacity = "1"; // Ensure draft status fades in smoothly
                    }, 10);
                }, 500); // Wait for fade-out to complete
            }, 5000); // 5 seconds before switching
        },
        complete: function(data) {
            next_pick = parseInt(data.responseJSON["nextPick"]);
            getPosition("ALL");

            if (viewingTeamId) {
                var team_id = viewingTeamId.getAttribute("data-team-id");
                getTeam(team_id);
            }

            var card = document.getElementById("pick" + next_pick);
            card.classList.add("border-light", "border-3");

            var pickCardBody = document.getElementById(`pick${next_pick}CardBody`);
            pickCardBody.innerHTML = "";
            pickCardBody.style.height = "140px";
            pickCardBody.appendChild(createPlaceholder(data.responseJSON["next_pick_team_name"], data.responseJSON["next_pick_team_key"], data.responseJSON["next_pick_team_color"], "On the Clock!"));

            card.scrollIntoView({ block: "nearest", behavior: "smooth", inline: "center" });
        }
    });
}


function getDraftPicks(currentPick) {
    $.ajax({
        url: "/getDraftPicks",
        type: "get",
        success: function(data) {
            var object = document.getElementById("draftPickContainer");
            object.innerHTML=data;
        },
        complete: function () {
            var card = document.getElementById("pick"+currentPick);
            card.scrollIntoView({block:"nearest", behavior:"smooth", inline:"center"});
        }
    })
}

function draftPickModal(draft_pick_id) {
    $.ajax({
        url: "/draftPickModal",
        type: "get",
        data: {"ID": draft_pick_id},
        success: function(data) {
            var object = document.getElementById("modalContainer");
            object.innerHTML=data;
        },
        complete: function() {
            $('#draftPickModal').modal("show");
        }
    })
}

function undoSelection(draft_pick_id) {
    var viewingTeamId = document.getElementById("teamCard");

    $.ajax({
        url: "/undoDraftSelection",
        type: "post",
        data: {"ID": draft_pick_id},
        complete: function(data) {
            $('#draftPickModal').modal("hide");
            getDraftPicks(data.responseJSON["current_pick"]);
            getPosition("ALL");
            if (viewingTeamId) {
                var team_id = viewingTeamId.getAttribute("data-team-id");
                getTeam(team_id);
            }
        }
    })
}

function tradeModal() {
    $.ajax({
        url: "/getTradeModal",
        type: "get",
        success: function(data) {
            var object = document.getElementById("modalContainer");
            object.innerHTML=data;
        },
        complete: function() {
            $('#tradeModal').modal("show");
        }
    })
}

function submitTrade(send, rec) {

    var viewingTeamId = document.getElementById("teamCard");

    var recPickList = document.getElementById("team"+rec+"Rec").querySelectorAll('input[type="checkbox"]:checked');
    var sendPickList = document.getElementById("team"+send+"Send").querySelectorAll('input[type="checkbox"]:checked');

    var sendPickIDs = [];
    var recPickIDs = [];

    sendPickList.forEach(function(input) {
        sendPickIDs.push(input.id);
    });

    recPickList.forEach(function(input) {
        recPickIDs.push(input.id);
    });

    $.ajax({
        url: "/submitTrade",
        type: "post",
        data: {
            sendTeam: send,
            recTeam: rec,
            sendPickIDs: sendPickIDs,
            recPickIDs: recPickIDs
        },
        success: function() {
            $('#tradeModal').modal("hide");
        },
        complete: function(data) {
            getDraftPicks(data.responseJSON["current_pick"]);

            const audio = document.getElementById('tradeChime');
            audio.play();

            if (viewingTeamId) {
                var team_id = viewingTeamId.getAttribute("data-team-id");
                getTeam(team_id);
            }
        }
    })
}

function showTeamPicks(id, string) {
    if (string == "Send") {
        var teamTitleListSend = document.getElementsByClassName("team-title-send");
        Array.prototype.forEach.call(teamTitleListSend, function(title) {
            title.setAttribute("hidden", true);
        });
        var teamPicksListSend = document.getElementsByClassName("team-picks-send");
        Array.prototype.forEach.call(teamPicksListSend, function(pickList) {
            pickList.setAttribute("hidden", true);
        });
    };
    
    if (string == "Rec") {
        var teamTitleListRec = document.getElementsByClassName("team-title-rec");
        Array.prototype.forEach.call(teamTitleListRec, function(title) {
            title.setAttribute("hidden", true);
        });
        var teamPicksListRec = document.getElementsByClassName("team-picks-rec");
        Array.prototype.forEach.call(teamPicksListRec, function(pickList) {
            pickList.setAttribute("hidden", true);
        });
    };

    var title = document.getElementById("team"+id+"Title"+string);
    var pickList = document.getElementById("team"+id+string);
    var submitBtn = document.getElementById("submitBtn");

    submitBtn.setAttribute("data-"+string, id);

    title.removeAttribute("hidden");
    pickList.removeAttribute("hidden");
}