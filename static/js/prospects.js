function onload() {
    getPosition("ALL");
}

function showDrafted(checkbox) {
    var pos = $(".pos-btn:disabled")[0].getAttribute("data-pos");
    getPosition(pos);
}

function getPositionBtn() {
    return $(".pos-btn:disabled")[0].getAttribute("data-pos")
}

function getPosition(pos) {
    var showDraftedCheck = document.getElementById("showDraftedCheckBox")
    var showDrafted = (showDraftedCheck)? showDraftedCheck.checked: false;

    $.ajax({
        url: "/prospectPosition",
        type: "GET",
        data: {
            pos: pos,
            show_drafted: showDrafted,
            editPage: true,
        },
        success: function(data) {
            var object = document.getElementById("mainContainer");
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
            getPosition(getPositionBtn());
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

function saveProspect(id) {
    var fname = document.getElementById("fnameForm");
    var lname = document.getElementById("lnameForm");

    var overview = document.getElementById("overviewForm");
    var strengths = document.getElementById("strengthsForm");
    var weaknesses = document.getElementById("weaknessesForm");
    var rank = document.getElementById("rankForm");
    var comparison = document.getElementById("comparisonForm");
    var projection = document.getElementById("projectionForm");
    var role = document.getElementById("roleForm");

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
    var concern = document.getElementById("concernProspect");

    $.ajax({
        url: "/saveProspect",
        type: "post",
        data: {
            id: id,
            fname: fname.value,
            lname: lname.value,
            overview: overview.value,
            strengths: strengths.value,
            weaknesses: weaknesses.value,
            rank: rank.value,
            comparison: comparison.value,
            projection: projection.value,
            role: role.value,
            role: role.value,
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
            favorite: favorite.checked,
            concern: concern.checked
        },
        success: function() {
            $('#editProspectModal').modal("hide");
        }
    })
}

function deleteProspect(id) {
    $.ajax({
        url: "/deleteProspect",
        type: "post",
        data: {
            id: id,
        },
        success: function() {
            $('#editProspectModal').modal("hide");
            getPosition(getPositionBtn());
        }
    })
}

