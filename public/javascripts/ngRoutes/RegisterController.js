app.controller('RegisterController', function(MenuTitle) {

    var register = this;

    // check that passwords match
    $(function() {
        var pass, pass2;
        $('.passwordSubmitButton').prop('disabled', true);

        function checkPassword() {
            pass = $('#password').val();
            pass2 = $('#password2').val();
            if(pass != pass2) {
                $("#passwordsMatch").text('Passwords do not match').css("color", "#F00");
                $('.passwordSubmitButton').prop('disabled', true);
            } else {
                $("#passwordsMatch").text('Passwords OK').css("color", "#090");
                $('.passwordSubmitButton').prop('disabled', false);
            }
        }

        $("#password").keyup(function()   { checkPassword(); });
        $('#password2').keyup(function()  { checkPassword(); });
        $("#password").change(function()  { checkPassword(); });
        $('#password2').change(function() { checkPassword(); });

    });

    MenuTitle.updateTitle('Register Account');

});