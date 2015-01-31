define(['hbs!templates/ssRouteTemplate', 'hbs!templates/ssNavBar', 'hbs!templates/ssBody', 'hbs!templates/ssFooter', 'welcomeModal', 'updatesModal', 'typeFonts', 'jquery', 'legacyScraps'],
    function(ssRouteTemplate, ssNavBarTemplate, ssBodyTemplate, ssFooterTemplate, ssWelcomeModal, ssUpdatesModal, typeFonts, $){
        var StreetSweepingApp = function(targetElementId){

            //Bad, but typekit is not AMD compliant...
            Typekit.load();

            console.log('StreetSweepingApp starting...');
            var appRootDiv = document.getElementById(targetElementId);

            var navDiv = document.createElement('div');
            navDiv.innerHTML = ssNavBarTemplate();
            appRootDiv.appendChild(navDiv);

            var bodyDiv = document.createElement('div');
            bodyDiv.innerHTML = ssBodyTemplate();
            appRootDiv.appendChild(bodyDiv);

            var footerDiv = document.createElement('div');
            footerDiv.innerHTML = ssFooterTemplate();
            appRootDiv.appendChild(footerDiv);

            new ssUpdatesModal(appRootDiv);

            new ssWelcomeModal(appRootDiv);

            this.attachJQueryHandlers();
        };

        StreetSweepingApp.prototype = {

            getGeocode: function(){
                var address = encodeURIComponent($("#address").val());
                var geocoder = this.geocoders['openstreetmap'],
                    url = geocoder.query(address, '');
                $.ajax({
                    url: url,
                    success: this.onGeocodeLoadSuccess.bind(this),
                    error: function(error){
                        console.log(JSON.stringify(error));
                    }
                });
            },

            onGeocodeLoadSuccess: function(data) {
                // Only get street sweeping data if we have a street address
                var geocoder = this.geocoders['openstreetmap'];
                console.log('geocode: ' + JSON.stringify(data));
                if( data.length > 0 && data[0].address.road) {
                    //address is valid
                    this.loadData(geocoder.parse(data));
                }
                else {
                    //address is not valid
                    this.loadData([]);
                }
            },

            loadData: function(address){
                var routeTemplate = ssRouteTemplate;

                // check if we have a valid lat/long combo before hitting our endpoint
                if (this.validGeo(address)) {
                    $.ajax({
                        url: config.baseUrl + "/schedules/streetsweeping",
                        data: address,
                        success: function(schedules){
                            console.log("Success getting data from server: " + JSON.stringify(schedules));
                            // Add a method used as a conditional in mustache
                            $.each(schedules, function(index, schedule){
                                schedule.hasUpcoming = function(){
                                    return schedule.upcoming.length > 0;
                                }
                            });

                            //this checks if an address has street sweeping data

                            if (schedules && schedules.length > 0 && typeof schedules !== 'undefined') {
                                schedules.validAddress = true;
                            } else {
                                schedules.validAddress = false;
                                schedules.error = config.errors.address['no-data-on-address'];
                            }

                            //sort dates in ascending order based on the first date in the upcoming list
                            schedules.sort(function(x, y){
                                return new Date(x.upcoming[0]) - new Date(y.upcoming[0]);
                            });

                            //set next sweeping date and pass it to the view
                            if (schedules.validAddress) {
                                schedules.nightly = schedules[0].error == 'Nightly';

                                schedules.nextSweeping = {
                                    "date" : schedules[0].upcoming[0],
                                    "name": schedules[0].name,
                                    "description": schedules[0].description
                                };

                            }
                            $('#results').html(routeTemplate(schedules));
                            $('#results').attr('data-model', JSON.stringify(schedules));
                            // $('#notes').html(notesTemplate(schedules));
                        }.bind(this),
                        error: function(schedules){
                            console.log('WARNING Error: ' + JSON.stringify(schedules));
                            schedules.validAddress = false;
                            schedules.error = config.errors.address['invalid-address']
                            $('#results').html(routeTemplate(schedules));
                            // $('#notes').html(notesTemplate(schedules));
                        }
                    });
                } else {

                    var schedules = {};
                    schedules.error = config.errors.address['invalid-address'];
                    $('#results').html(routeTemplate(schedules));
                }

            },

            nullGeocoder: { longitude: null, latitude: null, accuracy: null },

            geocoders: {
                yahoo: {
                    query: function(query, key) {
                        return 'http://where.yahooapis.com/geocode?appid=' +
                            key + '&flags=JC&q=' + query;
                    },
                    parse: function(r) {
                        try {
                            return {
                                longitude: r.ResultSet.Results[0].longitude,
                                latitude: r.ResultSet.Results[0].latitude,
                                accuracy: r.ResultSet.Results[0].quality
                            }
                        } catch(e) {
                            return nullGeocoder;
                        }
                    }
                },
                mapquest: {
                    query: function(query, key) {
                        return 'http://open.mapquestapi.com/nominatim/v1/search?format=json&limit=1&q=' + query;
                    },
                    parse: function(r) {
                        try {
                            return {
                                longitude: r[0].lon,
                                latitude: r[0].lat,
                                accuracy: r[0].type
                            }
                        } catch(e) {
                            return nullGeocoder;
                        }
                    }
                },
                cicero: {
                    query: function(query, key) {
                        return 'https://cicero.azavea.com/v3.1/legislative_district?format=json&key=' +
                            key + '&search_loc=' + query;
                    },
                    parse: function(r) {
                        try {
                            return {
                                longitude: r.response.results.candidates[0].x,
                                latitude: r.response.results.candidates[0].y,
                                accuracy: r.response.results.candidates[0].score
                            }
                        } catch(e) {
                            return nullGeocoder;
                        }
                    }
                },
                openstreetmap: {
                    query: function(query, key) {
                        return  'http://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=' + query;
                    },
                    parse: function(r) {
                        try {
                            return {
                                longitude: r[0].lon,
                                latitude: r[0].lat,
                                accuracy: r[0].importance
                            }
                        } catch(e) {
                            return nullGeocoder;
                        }
                    }
                }
            },

            attachJQueryHandlers: function(){

                $('#submit').click(function (){
                    this.getGeocode();
                }.bind(this));

                $( "#address" ).keypress(function( event ) {
                    //if user presses enter, click on the submit button:
                    if (event.charCode == 13) {
                        $('#submit').click();
                        $('#results').html('<div class="text-center"><img src="img/loading.gif" /></div>');
                    }
                });
                //This code is for pressing enter on the email sign up box

                $( "#mce-EMAIL" ).keypress(function( event ) {
                    //if user presses enter, click on the submit button:
                    if (event.charCode == 13) {
                        $('#mc-embedded-subscribe').click();
                    }
                });

                $('#welcomeModal').modal('show');

                $(".slidingDiv").hide();
                $(".show_hide").show();

                $('.show_hide').click(function(){
                    $(".slidingDiv").slideToggle();
                    var currentClass = $("#filter-chev").attr('class');
                    if(currentClass === "glyphicon glyphicon-chevron-down") {
                        $("#filter-chev").attr("class", "glyphicon glyphicon-chevron-up");
                    }
                    else {
                        $("#filter-chev").attr('class', "glyphicon glyphicon-chevron-down");
                    }
                });
            },
            validGeo: function(address) {
                return (address && address.longitude && address.latitude);
            }
        };

        return StreetSweepingApp;
});