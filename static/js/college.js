function onload() {
    getColleges();
}

function getColleges() {
    $.ajax({
        url: "/collegesList",
        type: "GET",
        success: function(data) {
            var object = document.getElementById("mainContainer");
            object.innerHTML=data;
            var search = document.getElementById("collegeSearchBar");
            search.addEventListener("input", (e) => {
                var table = document.getElementById("collegeTable");
                let searchValue = e.target.value.toLowerCase();
                for (let row of table.rows) {
                    let name = row.getAttribute("data-college-name");
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

function addCollegeModal() {
    $.ajax({
        url: "/addCollegeModal",
        type: "get",
        success: function(data) {
            var object = document.getElementById("modalContainer");
            object.innerHTML=data;
        },
        complete: function() {
            $('#addCollegeModal').modal("show");
        }
    })
}

function addCollege() {

    var name = document.getElementById("addCollegeName");
    var mascot = document.getElementById("addCollegeMascot");
    var key = document.getElementById("addCollegeKey");
    var color = document.getElementById("addCollegeColor");

    $.ajax({
        url: "/addCollege",
        type: "post",
        data: {
            name: name.value,
            mascot: mascot.value,
            key: key.value,
            color: color.value
        },
        complete: function() {
            $('#addCollegeModal').modal("hide");
            getColleges();
        }
    })
}

function editCollegeModal(id) {
    $.ajax({
        url: "/editCollegeModal",
        type: "get",
        data: {"ID": id},
        success: function(data) {
            var object = document.getElementById("modalContainer");
            object.innerHTML=data;
        },
        complete: function() {
            $('#editCollegeModal').modal("show");
        }
    })

}

function editCollege(id) {

    var name = document.getElementById("editCollegeName");
    var mascot = document.getElementById("editCollegeMascot");
    var key = document.getElementById("editCollegeKey");
    var color = document.getElementById("editCollegeColor");

    $.ajax({
        url: "/editCollege",
        type: "post",
        data: {
            "ID": id,
            "name": name.value,
            "mascot": mascot.value,
            "key": key.value,
            "color": color.value
        },
        success: function() {
            $('#editCollegeModal').modal("hide");
            getColleges();
        }
    })

}