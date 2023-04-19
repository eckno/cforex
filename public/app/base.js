
function process_form(form_id, btn_id = ""){

    const form_data = $(`#${form_id}`).serializeArray();
    const form_action = $(`#${form_id}`).attr("action");

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
                hide_spinner();
                if (typeof res.data !== "undefined" && typeof res.data.redirect_url === "string") {
                    redirect_url = (res.data.redirect_url) ? res.data.redirect_url : "";
                    msg = res.data.msg ? res.data.msg : "";
                }

                display_success(msg, redirect_url);
            },
            error: function (responseError) {
                let redirect_url = "", error = "";
                hide_spinner();
                if (responseError.hasOwnProperty('responseJSON') && responseError.responseJSON.hasOwnProperty('errors')) {
                    redirect_url = (responseError.responseJSON && responseError.responseJSON.errors.redirect_url) ? responseError.responseJSON.errors.redirect_url : "";
                    let errors = (responseError.responseJSON && responseError.responseJSON.errors) ? responseError.responseJSON.errors : "";
                    if(errors !== "" && typeof(errors) == 'object'){
                        let error_mock = "";
                        for(var error_ in errors){
                            if(error_ === 'redirect_url'){ continue; }
                            const error_temp = `<div class='error_list'><i class="fa fa-info-circle" style='color:red; padding-right:5px;'></i>${errors[error_]}</div>`;

                            error_mock += error_temp;
                        }
                        error = error_mock;
                    }
                    else{
                        error = `<div class='error_list'><i class="fa fa-info-circle" style='color:red; padding-right:5px;'></i>${(responseError.responseJSON && responseError.responseJSON.errors) ? responseError.responseJSON.errors : ""}</div>`;
                    }
                }

                display_error(error, redirect_url);
            }
        });
}