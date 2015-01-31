define(['hbs!templates/ssWelcomeModal', 'jquery'], function(ssWelcomeModalTemplate, $){
    var welcomeModal = function (targetDiv) {
        var welcomeModalDiv = document.createElement('div');
        welcomeModalDiv.innerHTML = ssWelcomeModalTemplate();
        targetDiv.appendChild(welcomeModalDiv);
        this.initForm();
    };

    welcomeModal.prototype = {
        initForm: function(){
            document.getElementById('signUpLink').addEventListener('click', function(){
                $('#updatesModal').modal('show');
            });
        }
    };

    return welcomeModal;
});