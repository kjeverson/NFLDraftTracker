function onload(data) {
    getDraftOrder(data["current_round"], data["current_pick"]);
}

function setCurrentRound(round) {
    console.log(round);
    var roundSelector = document.getElementById("roundSelection");
    for(const button of roundSelector.children){
        if (button.dataset.round == round){
            button.classList.remove("disabled", "btn-outline-secondary");
            button.classList.add("active", "btn-dark");
        }
        else {
            button.classList.remove("active", "btn-dark");
            button.classList.add("disabled", "btn-outline-secondary");
        }
    }
}

function getDraftOrder(currentRound, currentPick) {
    console.log(currentRound);
    $.ajax({
        url: "/getDraftOrder",
        type: "get",
        data: {
            current_pick: currentPick
        },
        success: function(data) {
            var object = document.getElementById("draftPickContainer");
            object.innerHTML=data;
            setCurrentRound(currentRound);
        },
        complete: function () {
            var card = document.getElementById("pick"+ currentPick);
            card.scrollIntoView({block:"nearest", behavior:"smooth", inline:"center"});
            card.classList.add("border-3", "border-light");
        }
    })
}

function assignPick(team_id) {
    round_btn = document.querySelector('.btn-group .active');
    round = round_btn.dataset.round;
    $.ajax({
        url: "/assignDraftPick",
        type: "post",
        data: {
            round: round,
            team_id: team_id,
        },
        success: function(data) {
            getDraftOrder(data['round'], data['pick']);
        }
    })
}

function finalizeRound() {
    round_btn = document.querySelector('.btn-group .active');
    round = parseInt(round_btn.dataset.round, 10) + 1;
    setCurrentRound(round);
}

function undoPick() {
    round_btn = document.querySelector('.btn-group .active');
    round = round_btn.dataset.round;
    $.ajax({
        url: "/undoDraftPick",
        type: "post",
        data: {
            round: round,
        },
        success: function(data) {
            getDraftOrder(data['round'], data['pick']-1);
        }
    })
}