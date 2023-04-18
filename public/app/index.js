
$('#registration-form').off('submit').on('submit', (e) => {
    e.preventDefault();
    process_form('registration-form');
})