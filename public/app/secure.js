$("#deposit-form").off('submit').on("submit", (e) => {
    e.preventDefault();
    process_form('deposit-form');
});
$("#depositing-form").off('submit').on("submit", (e) => {
    e.preventDefault();
    process_form('depositing-form');
});

function start_new_trade(fid){
    process_form(fid);
}