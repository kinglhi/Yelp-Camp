var mongoose = require("mongoose"),
    Comment = require("./models/comment"),
    Campground = require("./models/campground");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Spicy jalapeno bacon ipsum dolor amet ham hock burgdoggen cupim, exercitation cupidatat est enim. Labore aliquip officia minim shankle pork loin. Occaecat tail in, porchetta chuck filet mignon nostrud sunt bacon corned beef brisket commodo. Fatback ipsum dolore, cupim bacon landjaeger ad salami aliquip t-bone adipisicing prosciutto et chuck. Beef ribs elit brisket, bresaola picanha tempor minim. Lorem tenderloin landjaeger elit consectetur voluptate prosciutto. Doner fatback ex, ribeye est ham tongue."
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Turducken dolore kielbasa salami in rump. Aliquip rump strip steak, excepteur officia prosciutto t-bone reprehenderit. Eu venison prosciutto, bresaola ad ut lorem flank. Eiusmod ground round short loin mollit, non laborum velit laboris bacon cupidatat. In tenderloin elit pastrami irure chuck, dolore ball tip brisket alcatra cow ipsum."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Sausage alcatra excepteur enim, sirloin jerky tempor pork loin cupidatat adipisicing capicola salami fugiat sed. Boudin tri-tip sint, magna consequat et drumstick. Consequat venison sirloin, deserunt pancetta ham hock enim exercitation lorem adipisicing filet mignon proident. Deserunt exercitation ex alcatra pork belly cillum beef, meatloaf kielbasa drumstick. Shankle strip steak buffalo, voluptate brisket tri-tip ham hock exercitation duis."
    },
    {
        name: "Kembu Farm",
        image: "https://mumsvillage.com/wp-content/uploads/2017/07/KembuCampsite10-640x250.jpg",
        description: "Short ribs ad biltong, lorem andouille et incididunt do pork loin nostrud dolore. Turducken voluptate alcatra tenderloin, ullamco commodo pork loin eu ea drumstick nulla. Lorem landjaeger proident veniam pork chop, dolore turkey porchetta est culpa spare ribs velit sint drumstick. Id fatback fugiat labore nisi quis mollit t-bone occaecat consectetur bresaola laboris. Salami drumstick sint anim. Pig salami adipisicing shankle bresaola culpa cow cillum laboris meatball ut elit. Ham cillum enim flank venison nulla."
    }
]

function seedDB() {
    // Remove all campgrounds
   Campground.remove({}, function(err, removed) {
        if(err) {
            console.log(err);
        } else {
            console.log("Campgrounds removed!");
            // Create new campgrounds
            data.forEach(function(seed){
              Campground.create(seed, function(err, campground) {
                  if(err) {
                      console.log(err);
                  } else {
                      console.log("Added new campground");
                    // Create a comment for each campground
                    Comment.create({
                        text: "Awesome campground. The sunset views are breathtaking.",
                        author: "Macintosh"
                    }, function(err, comment){
                        if(err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save(function(err, saved) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log("Created new comment");
                                }
                            }); // campground.save
                        }
                    }); // comment.create
                     }
                 }); // campground.create 
                
             }); // forEach loop
        }
    }); //campground.remove
    
} // function

module.exports = seedDB;
