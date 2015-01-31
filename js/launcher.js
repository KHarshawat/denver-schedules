require.config({
    baseUrl: 'js',
    paths: {
        hbs: 'lib/require-handlebars-plugin/hbs',
        streetSweepingApp: 'streetSweepingApp',
        mailchimp: 'lib/mailchimp',
        jquery: 'lib/jquery.min',
        typeFonts: 'lib/sne3psa',
        legacyScraps: 'lib/streetsweeping_old',
        welcomeModal: 'components/welcomeModal',
        updatesModal: 'components/updatesModal'
    },
    hbs: { // optional
        helpers: true,            // default: true
        i18n: false,              // default: false
        templateExtension: 'hbs', // default: 'hbs'
        partialsUrl: ''           // default: ''
    }
});

require(['streetSweepingApp'], function(StreetSweepingApp){
    new StreetSweepingApp('appRoot');
});