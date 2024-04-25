$(document).ready(function() {
    $(".team-btn").on("click", e => {
        var ID = $(e.currentTarget).data("id");
        getTeam(ID);
    });
});

function getTeam(ID) {
    $.ajax({
        url: "/team",
        type: "get",
        data: {id: ID},
        success: function(data) {
            var object = document.getElementById("teamControl");
            object.innerHTML=data;
        }
    })
}