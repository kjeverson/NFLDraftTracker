$(document).ready(function() {
    $('#addProspectsBtn').addClass('disabled').prop('disabled', true);

    $('#addProspectsClassInput').on('input', function() {
        if ($(this).val()) {
            $('#addProspectsBtn').removeClass("disabled").prop('disabled', false);
        } else {
            $('#addProspectsBtn').addClass("disabled").prop('disabled', true);
        }
    });
});

function dropProspectsConfirm() {
    $.ajax({
        url: "/getDropProspectsConfirm",
        type: "get",
        success: function(data) {
            var object = document.getElementById("modalContainer");
            object.innerHTML=data;
        },
        complete: function() {
            $('#confirmDropProspectsModal').modal("show");
        }
    })
}

function dropProspects() {
    $.ajax({
        url: "/dropProspects",
        type: "get",
        success: function() {
            $('#confirmDropProspectsModal').modal("hide");
        }
    })
}

function dropDraftPicksConfirm() {
    $.ajax({
        url: "/getDropDraftPicksConfirm",
        type: "get",
        success: function(data) {
            var object = document.getElementById("modalContainer");
            object.innerHTML=data;
        },
        complete: function() {
            $('#confirmDropDraftPicksModal').modal("show");
        }
    })
}

function dropDraftPicks() {
    $.ajax({
        url: "/dropDraftPicks",
        type: "get",
        success: function() {
            $('#confirmDropDraftPicksModal').modal("hide");
        }
    })
}

function addProspects() {
    let draftClass = $('#addProspectsClassInput')[0];
    if (!parseInt(draftClass.value)) {
        packNewToast("bg-danger", "bi bi-exclamation-diamond-fill", "Draft Class Error!", "Draft Class Must Be a Year.");
    } else {
        console.log("Before AJAX");
        $('#progressTitle').text("Adding Prospects...")
        $('#progressModal').modal({backdrop: 'static', keyboard: false})
        $('#progressModal').modal("show");
        $.ajax({
            url:"/addProspectsTable",
            type: "post",
            data: {
                year: draftClass.value
            },
            success: function() {
                packNewToast("bg-success", "bi bi-check-square-fill", "Success!", "Draft Class Added.");
                $('#progressModal').modal("hide");
            }
        });
    }
}


function getHeadshots() {

    $('#progressTitle').text("Getting Headshots...")
    $('#progressModal').modal({backdrop: 'static', keyboard: false})
    $('#progressModal').modal("show");

    $.ajax({
        url:"/getHeadshots",
        type: "get",
        success: function() {
            packNewToast("bg-success", "bi bi-check-square-fill", "Success!", "Headshots Added.");
            $('#progressModal').modal("hide");
        }
    });
}

function saveSnapshot() {
    const filename = $('#dbSnapshotInput')[0].value;

    $.ajax({
        url:"/backup",
        type: "post",
        data: {
            filename: filename
        },
        success: function() {
            packNewToast("bg-success", "bi bi-check-square-fill", "Success!", `Snapshot ${filename} saved.`);
        }
    });

}

function backupSelected(filename) {
    $('#backupFilename')[0].innerText = filename;
    const loadBtn = $('#restoreBackupBtn').first()
    loadBtn.prop("disabled", false);
    loadBtn.attr("data-filename", filename);
}

function restoreBackup(filename) {

    $.ajax({
        url: "/restore",
        type: "post",
        data: {
            filename: filename
        },
        success: function() {
            packNewToast("bg-success", "bi bi-check-square-fill", "Success!", `Restored ${filename} snapshot.`);
        }
    })
}
