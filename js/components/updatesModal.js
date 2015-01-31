define(['hbs!templates/ssUpdatesModal', 'mailchimp', 'jquery'], function(ssUpdatesModal, mailchimp, $){
   var updatesModal = function(targetDiv){
       var updatesModalDiv = document.createElement('div');
       updatesModalDiv.innerHTML = ssUpdatesModal();
       targetDiv.appendChild(updatesModalDiv);
       this.initForm();
   };

   updatesModal.prototype = {
       initForm: function(){
           $('#mc-embedded-subscribe').bind('click', this.onSubscribeClick.bind(this));
       },
       onSubscribeClick: function(){
           if ( event ) event.preventDefault();
           $('#subscribe-form').hide();
           $('#popup-content').hide();
           $('#mc-embedded-subscribe').hide();
           $('email-result').html('<div class="text-center"><img src="img/loading.gif" /></div>');
           this.register($('#signup-form'));
       },
       register: function($form) {
            $.ajax({
                type: 'post',
                url: 'http://codeforamerica.us2.list-manage.com/subscribe/post-json?u=d9acf2a4c694efbd76a48936f&amp;id=02a49cc1ef&c=?',
                data: $form.serialize(),
                cache       : false,
                dataType    : 'json',
                contentType: "application/json; charset=utf-8",
                error       : function(err) { alert("Could not connect to the registration server. Please try again later."); },
                success     : function(data) {
                    if (data.result != "success") {
                        $('#email-result').html('<div class="alert alert-danger"><h3>Error!</h3><p>'+ data.msg+ '</p></div>');
                        // Something went wrong, do something to notify the user. maybe alert(data.msg);
                    } else {
                        $('#email-result').html('<div class="alert alert-success"><h3>Success!</h3><p>'+ data.msg+ '</p></div>');

                        // It worked, carry on...
                    }
                    $('#email-result').append('<button type="button" class="btn btn-primary btn-xlarge" data-dismiss="modal" aria-hidden="true">Close</button>');
                }
            });
       }
};

   return updatesModal;
});