//read in config vars from a json and put them in a global window variable
$.getJSON( "./js/config.json", function(config){
  window.config = config;
});

function defaultAddress(){
  $('#address').val('942 S Pearl St, Denver, CO');
  $('#results').html('<div class="text-center"><img src="img/loading.gif" /></div>');
  $('#submit').click();
}

function validEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// TODO: use google's library:
// https://code.google.com/p/libphonenumber/source/browse/#svn%2Ftrunk%2Fjavascript
function validPhone(phone) {
  var justNumbers = phone.replace(/[^0-9]/g, '');
  return justNumbers.length == 10;
}

function createReminders(reminderType) {
  $('#reminder-error').html('');
  var url = config.baseUrl + "/reminders/" + reminderType;
  var data = JSON.parse($('#results').attr('data-model'));
  var contact = $.trim($('#' + reminderType).val());
  var valid = reminderType == 'email'? validEmail(contact) : validPhone(contact)

  if(!valid)
  {
    //add an alert to the view  the address is not valid
    $('#reminder-alerts').removeClass()
                              .addClass('alert alert-danger')
                              .fadeIn(300)
                              .html('<h4>' + config.errors.reminder['invalid-' + reminderType] + '</h4>')
                              .fadeOut(5000);
  } else {
    //add an alert to the view  the address is not valid
    $('#reminder-alerts').removeClass()
                              .addClass('alert alert-success')
                              .fadeIn(300)
                              .html('<h4>' + config.errors.reminder['valid-' + reminderType] + '</h4>')
                              .fadeOut(5000);

    // TODO: Write an action that takes a collection of reminders
    $.each(data, function(index, street){
      var upcoming = street.upcoming;
      var firstDate = new Date(street.upcoming[0]);
      
      var readableDate = firstDate.getDayAbbrev() + ", " + firstDate.getMonthAbbrev() + " " + (firstDate.getDate() +1 );
      var message = config.reminders[reminderType+"1"] + readableDate + config.reminders[reminderType+"2"] + street.description + config.reminders[reminderType+"3"] + street.name + config.reminders[reminderType+"4"];

      $.each(upcoming, function(index, d){
        createReminder(contact, message, d, url);
      });
    });

    $('#reminder-error-alert').removeClass('hidden');
    $('#reminder-error').html("Reminders created for " + contact + ".");

    $('#' + reminderType).val('');
  }
}

function createReminder(contact, message, date, url) {
  var reminder = {
    "contact" : contact,
    "message" : message,
    "remindOn" : date,
    "address" : $('#address').val()
  };

  $.ajax({
    type: "POST",
    url: url,
    data: reminder,
    success: function(response){ reminderAdded(response) },
    error: function(reminder){ reminderNotAdded(response) }
  });
}

function reminderAdded(response) {
  console.log("Added reminder " + JSON.stringify(response));
}

function reminderNotAdded(reminder){
  // TODO: How does this app log errors?
  console.log("WARNING: Didn't add reminder " + JSON.stringify(reminder));
}