Websites = new Mongo.Collection("websites");

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('website_list', {
    to:"main"
  });
});

Router.route('/link/:_id', function () {
  this.render('website_link', {
    to: "main",
    data: function() {
      return Websites.findOne({_id: this.params._id});
    }
  });
});

if (Meteor.isClient) {

  Comments.ui.config({
    template: 'bootstrap'
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });

  /////
  // template helpers
  /////

  // helper function that returns all available websites
  Template.website_list.helpers({
    websites:function(){
      return Websites.find({}, {sort: {upvotes: -1}});
    }
  });

  Template.registerHelper("prettifyDate", function(timestamp) {
    return moment(timestamp).format('MM-DD-YYYY');
  });

  /////
  // template events
  /////

  Template.website_item.events({
    "click .js-upvote":function(event){
      // example of how you can access the id for the website in the database
      // (this is the data context for the template)
      var website_id = this._id;
      console.log("Up voting website with id "+website_id);
      // put the code in here to add a vote to a website!
      Websites.update(
        {_id: website_id},
        {$inc: {upvotes: +1}}
      );

      return false;// prevent the button from reloading the page
    },
    "click .js-downvote":function(event){

      // example of how you can access the id for the website in the database
      // (this is the data context for the template)
      var website_id = this._id;
      console.log("Down voting website with id "+website_id);

      // put the code in here to remove a vote from a website!
      Websites.update(
        {_id: website_id},
        {$inc: {downvotes: -1}}
      );

      return false;// prevent the button from reloading the page
    }
  });

  Template.website_form.events({
    "click .js-toggle-website-form":function(event) {
      $("#website_form").toggle('slow');
    },
    "submit .js-save-website-form":function(event, template) {

      var title = event.target.title.value;
      var url = event.target.url.value;
      var description = event.target.url.value;

      if (Meteor.user()) {
        Websites.insert({
          title: title,
          url: url,
          description: description,
          createdOn: new Date(),
          upvotes: 0,
          downvotes: 0
        });
      }

      $("#website_form").toggle('slow');

      // Clean up form after send a link
      template.find("form").reset();

      return false;
    }
  });
}


if (Meteor.isServer) {
  // start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
      console.log("No websites yet. Creating starter data.");
      Websites.insert({
    	title:"Goldsmiths Computing Department",
    	url:"http://www.gold.ac.uk/computing/",
    	description:"This is where this course was developed.",
    	createdOn:new Date()
      });
      Websites.insert({
    	title:"University of London",
    	url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    	description:"University of London International Programme.",
    	createdOn:new Date()
      });
      Websites.insert({
    	title:"Coursera",
    	url:"http://www.coursera.org",
    	description:"Universal access to the world’s best education.",
    	createdOn:new Date()
      });
      Websites.insert({
    	title:"Google",
    	url:"http://www.google.com",
    	description:"Popular search engine.",
    	createdOn:new Date()
      });
    }
  });
}
