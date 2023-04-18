
function process_form(form_id, btn_id = ""){

    const form_data = $(`#${form_id}`).serializeArray();
    const form_action = $(`#${form_id}`).attr("action");
console.log(form_data);
    if(form_action == "" || form_data == ""){
        return;
    }
    
    display_spinner();
    $.ajax({
            type: "POST",
            url: form_action,
            dataType: "JSON",
            data: form_data,
            success: function (res) {
                console.log(res);
                $(`#${form_id}`).trigger('reset');
                let redirect_url = "", msg = "";
                
                if (typeof res.data !== "undefined" && typeof res.data.redirect_url === "string") {
                    redirect_url = (res.data.redirect_url) ? res.data.redirect_url : "";
                    msg = res.data.msg ? res.data.msg : "";
                }

                display_success(msg, redirect_url);
            },
            error: function (responseError) {
                let redirect_url = "", errors = "";
                console.log(responseError);
                hide_spinner();
                if (responseError.hasOwnProperty('responseJSON') && responseError.responseJSON.hasOwnProperty('errors')) {
                    redirect_url = (responseError.responseJSON && responseError.responseJSON.redirect_url) ? responseError.responseJSON.redirect_url : "";
                    errors = (responseError.responseJSON && responseError.responseJSON.errors) ? responseError.responseJSON.errors : "";
                }

                display_error(errors, redirect_url);
            }
        });
}