
function editTeamNeeds(btn){
    btn.innerText = "Save";
    btn.onclick = function() {
        saveTeamNeeds(btn);
    }

    let btns = []
    for (let i = 1; i < 6; i++) {
        btns.push(`#${btn.dataset.id}Need${i}`)
    }
    btns.forEach(function (item) {
        let button = $(item)
        button.prop('disabled', false);

        button = button[0];

        const input = document.createElement('input');
        input.id = button.id;
        input.value = button.innerText;
        input.classList.add("w-100");

        button.replaceWith(input);
    });
}

function saveTeamNeeds(btn) {
    btn.innerText = "Edit";
    btn.onclick = function() {
        editTeamNeeds(btn);
    }

    let btns = []
    for (let i = 1; i < 6; i++) {
        btns.push(`#${btn.dataset.id}Need${i}`)
    }

    let needs = []
    btns.forEach(function (item) {
        let input = $(item)

        input = input[0];

        const button = document.createElement('button');
        button.id = input.id;
        button.innerText = input.value;
        needs.push(input.value);
        button.classList.add("btn");
        button.classList.add("w-100");
        button.classList.add("btn-secondary");
        button.disabled = true;

        input.replaceWith(button);
    });

     $.ajax({
        url: "/setTeamNeeds",
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({
                        id: btn.dataset.id,
                        needs: needs
                    }),
        success: function(data) {
            //Do Nothing for Now!!
        }
    })

}