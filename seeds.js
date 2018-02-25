var mongoose = require("mongoose");
var Restaurant = require("./models/restaurant");
var Comment = require("./models/comment");

var data = [
    {
        restaurantName: "四川麻辣烫", 
        restaurantImage: "https://tabelog.com/imgview/original?id=r1568448456758",
        description: "可以加的东西很多，还有很多国内的饮料，比如冰红茶，但是价格小贵，人均1500-2000円左右。"
    },
    {
        restaurantName: "海底捞池袋店", 
        restaurantImage: "https://uds.gnst.jp/rest/img/ba11tssh0000/s_0n5c.jpg?t=1500467047",
        description: "节假日周末人非常多，做好排队1小时以上的心理准备，味道很好吃，还有无限的橘子可以吃，推荐七上八下（牛肚的吃法）"
    }
];

function seedDB() {
    // Remove all restaurants
    Restaurant.remove({}, function(err){
        if(err){
            console.log("Error: " + err);
        }
        console.log("Removed restaurants.");
        // add a few restaurants
        data.forEach(function(seed){
            Restaurant.create(seed, function(err, restaurant){
                if(err){
                    console.log(err);
                }else{
                    console.log("add a restaurant");
                    // create a comment
                    Comment.create(
                        {
                            text: "价格蛮贵的，6个人吃了三万，大概是因为男生多吧。",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log("Error: " + err);
                            }else{
                                restaurant.comments.push(comment._id);
                                restaurant.save();
                                cnosole.log("Created new comment.");
                            }
                        });
                }
            });
        });
    });
    // add a few comments
}

module.exports = seedDB;