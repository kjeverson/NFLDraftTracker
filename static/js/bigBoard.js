
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
            var pickCard = document.getElementById("pick"+pick_id);
            pickCard.classList.remove("border-light", "border-3");

            var pickName = document.getElementById("pick"+pick_id+"CardPlayerName");
            pickName.innerText = data['sname'];

            var pickDetails = document.getElementById("pick"+pick_id+"CardPlayerInfo");
            pickDetails.innerText = data['position'] + " | " + data['college'];

            var draftStatus = document.getElementById("draftStatus");
            draftStatus.innerText = data['nextPickMsg'];

            var draftStatusContainer = document.getElementById("draftStatusContainer");
            draftStatusContainer.style = "background-color: #" + data['nextPickColor'] +";pointer-events: none; !important";
        },
        complete: function(data) {
            next_pick = parseInt(data.responseJSON["nextPick"])
            getPosition("ALL");

            if (viewingTeamId) {
                var team_id = viewingTeamId.getAttribute("data-team-id");
                getTeam(team_id);
            }

            var card = document.getElementById("pick"+next_pick);
            card.classList.add("border-light", "border-3");

            card.scrollIntoView({block:"nearest", behavior:"smooth", inline:"center"});
        }
    })
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