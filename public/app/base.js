
function process_form(form_id, btn_id = ""){

    const form_data = $(`#${form_id}`).serializeArray();
    const form_action = $(`#${form_id}`).attr("action");

    if(form_action == "" || form_data == ""){
        return;
    }

    $.ajax({
            type: "POST",
            url: form_action,
            dataType: "JSON",
            data: form_data,
            success: function (res) {
                console.log(res);
                $("#login-form").trigger('reset');
                
                if (typeof res.data !== "undefined" && typeof res.data.redirect_url === "string") {
                    window.location.href = res.data.redirect_url;
                }
            },
            error: function (responseError) {
                hide_spinner();
                if (responseError.hasOwnProperty('responseJSON') && responseError.responseJSON.hasOwnProperty('errors')) {
                    BuildAndDisplayErrors(responseError.responseJSON.errors, "#login-form")
                }
            }
        });
}