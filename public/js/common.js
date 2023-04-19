var _custom_alert_instance;
var staticModal;
var modalAlert;

function display_spinner(text) {
    hide_spinner();
    text = typeof text === "string" ? text : "Please wait while your request is being processed.";
    $("body").waitMe({
      effect: "ios",
      text: text,
      color: "#fff"
    });
}
  
function hide_spinner() {
    $("body").waitMe("hide");
}

/**
 * Remove form field inline errors
 */
var removeInlineErrors = function() {
    if($('.error_text')[0]) $('.error_text').remove();
    if($('.error_message')[0]) $('.error_message').removeClass("error_message");
    if($('.input_field_container.error')[0]) $('.input_field_container.error').removeClass("error");
    if($('.removable-field')[0]) $('.removable-field').remove();
}

function display_error(errors, redirect_url = ""){
    Swal.fire({
        title: '<div class="error_s"><strong>ERROR !!</strong></div>',
        html: errors,
        showCloseButton: false,
        showCancelButton: false,
        focusConfirm: false
    })
    .then(() => {
        if(redirect_url !== ""){
            window.location.href = redirect_url;
        }
    })

}

function display_success(msg, redirect_url = ""){
    Swal.fire({
        title: '<div class="success_"><strong>SUCCESS <i class="fa fa-check"></i></strong></div>',
        html: `<div class='error_block'>${msg}</div>`,
        showCloseButton: false,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
    })
    .then(() => {
        if(redirect_url !== ""){
            window.location.href = redirect_url;
        }
    })

}

function capitalizeString (string) {
    if (typeof string === "string") {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return string;
    }
}