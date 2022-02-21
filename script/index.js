$(document).ready(() => {
    $("#dashboard-menu-collapse").on("click",() => {
        $("#dashboard > menu").toggleClass("collapsed");
    });
});