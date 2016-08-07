
const g_ticketGivingMinute = 15;
const g_maxTicket = 5;
const g_levelUpdateCondition = 100;

Parse.Cloud.define("finishGame", function(request, response)
{
	var user = request.user; // request.user replaces Parse.User.current()
	var token = user.getSessionToken(); // get session token from request.user
	var map = request.params;
	var score = map["score"];
	
	console.log("parse query user");
	var query = new Parse.Query(Parse.User);
	
	console.log("user id " + user.id);
	query.equalTo('_id', user.id);
	query.first().then(function(result)
	{
		console.log("id" + result.id);
		var highScore = result.get("highScore");
		var highScoreWeek = result.get("highScoreWeek") ;
		
		if(highScore == null || highScore < score)
		{
			console.log("set high score to " + score);
			result.set("highScore", score);
		}
		
		if(highScoreWeek == null || highScoreWeek < score)
		{
			console.log("set weekly high score to " + score);
			result.set("highScoreWeek", score);
		}
		console.log("before save ");
		result.save();
		console.log("after save ");
		
		response.success("success");
	});
});

Parse.Cloud.beforeSave(Parse.User, function(request, response)
{
	var user = request.object;
	
	console.log("request.object" + request.object);
	
	for(key in user)
	{
		console.log("user key " + key + "user value " + user[key]);
	}
	
	if (params == null)
	{
		console.log("params is null");
	}
 
	
	var score = params["score"];
	
	console.log("parse query user");
	var query = new Parse.Query(Parse.User);
	
	console.log("user id " + user.id);
	query.equalTo('_id', user.id);
	query.first().then(function(result)
	{
		console.log("id" + result.id);
		var highScore = result.get("highScore");
		var highScoreWeek = result.get("highScoreWeek") ;
		
		if(highScore == null || highScore < score)
		{
			console.log("set high score to " + score);
			result.set("highScore", score);
		}
		
		if(highScoreWeek == null || highScoreWeek < score)
		{
			console.log("set weekly high score to " + score);
			result.set("highScoreWeek", score);
		}
		console.log("before save ");
		result.save();
		console.log("after save ");
		
		response.success("success");
	});
});


/*
function updateTicketCount()
{
	const ticketGivingSecond = 60 * g_ticketGivingMinute;
    
    var user = Parse.User.current();
    var ticket = user.get("ticket");
    // recalcurate from time count
    var prevTimeStr = user.get("ticketRecoverDate");
    var date = new Date();
    console.log("previous ticket check date " + prevTimeStr);
    console.log("current date " + date.toISOString());
    console.log("ticket " + ticket);
    
    if (ticket < g_maxTicket)
    {
        if(prevTimeStr == "")
        {
            console.log("warning ticketRecoverDate must be set ticket < g_maxTicket !!");
            user.set("ticketRecoverDate",data.toISOString());
        }
        else
        {
            var prevTime = new Date(prevTimeStr);
            console.log("prevtime " + prevTime);
            
            var passedSecond = (date.getTime() - prevTime.getTime())/1000; //to second
            var getTicket = parseInt(passedSecond / ticketGivingSecond);
            console.log("passed second " + passedSecond);
            console.log("getTicket " + getTicket);
            
            if(getTicket > 0)
            {
                // add ticket
                ticket += getTicket;
                if(ticket > g_maxTicket)
                {
                    ticket = g_maxTicket;
                    user.set("ticketRecoverDate","");
                    console.log("ticket is full");
                }
                else
                {
                    // don't update ticket Recover date
                }
                
                console.log("ticket count is updated to " + ticket);
                // set ticket
                user.set("ticket", ticket);
            }
            else
            {
                // do nothing
                console.log("ticket count is not increased gab = " + (date - prevTime));
            }
        }
        
        if(user.ticket == g_maxTicket)
        {
            user.ticketRecoverDate = "";
            console.log("ticket recoverDate to null in ticket < g_maxTicket");
        }
    }
    else
    {
        console.log("ticket is full and prevTimeStr is " + prevTimeStr);
        user.ticketRecoverDate = "";
        console.log("ticket recoverDate to null");
    }
    
    return user;
}

function setObject(key, map)
{
    var objTable = Parse.Object.extend(key);
    var query = new Parse.Query(objTable);
    var user =  Parse.User.current();
    
    query.equalTo("user", user);
    return query.first().then(function(object)
	{
		console.log("object " + object);
		return object;
	},
	function(error)
	{
		console.log("error " + error);
		return null;
	}).then(function(object)
	{
		if(object == null)
		{
			object = new objTable();
		}
		
		var objMap = map[key];
		for(objKey in objMap)
		{
			object.set(objKey, objMap[objKey]);
			console.log("key " + objKey + " value " + object[objKey]);
		}
		
		object.set("user", user);
		
		console.log("object saved in promise" + object);
		return  object.save();
	});
}

function defineMapIfNull(map, key, value)
{
    if(map[key] == null)
    {
        map.set(key, value);
    }
}

function updateRelatedUserValues(key, value)
{
    var user = Parse.User.current();
    
    if(key == "vanishCount")
    {
        defineMapIfNull(user, key, 0);
        defineMapIfNull(user, "level", 0);
        defineMapIfNull(user, "totalVanishCount", 0);
        
        var totalVanishCount = user.get(key) + value;
        var level = parseInt( totalVanishCount / g_levelUpdateCondition);
        
        user.set("level", level);
        user.set("totalVanishCount", totalVanishCount);
    }
    else if(key == "score")
    {
        if(user.get("highScore") < value)
        {
            console.log("set high score to " + value);
            user.set("highScore", value);
        }
        
        if(user.get("highScoreWeek") < value)
        {
            console.log("set weekly high score to " + value);
            user.set("highScoreWeek", value);
        }
    }
}

function updateData(map)
{
    var promises = [];
    for(key in map)
    {
        console.log("key " + key + "value " + map[key]);
        
        if(key == "User")
        {
            var isUpdated = false;
            var user = Parse.User.current();
            var userMap = map[key];
            for(userKey in userMap)
            {
                console.log("userkey " + userKey + " uservalue " +  userMap[userKey]);
                updateRelatedUserValues(userKey, userMap[userKey]);
                user.set(userKey, userMap[userKey]);
            }
            
            user.save();
        }
        else
        {
            var promise = setObject(key, map);
            promises.push(promise);
        }
    }
    
    console.log("return end updateData");
    return Parse.Promise.when(promises);
}

Parse.Cloud.define("startGame", function(request, response)
{
    console.log("startGame " + request.params);

    updateData(request.params).then(function(result)
    {
        console.log("success promise return " + result);
        var user = updateTicketCount();
        var ticket = user.get("ticket");
        var date = new Date();

        if(ticket <= 0)
        {
            response.error("don't have ticket");
            return;
        }

        user.increment("ticket", -1);
        console.log("decrease ticket -1 rest ticket" + user.get("ticket"));

        if(user.get("ticket") == g_maxTicket - 1)
        {
            console.log("reset ticketRecoverDate " + date.toISOString());
            user.set("ticketRecoverDate",date.toISOString());
        }

        user.save();

        var result = {};
        result.date = date.toISOString();
        result.ticketRecoverDate = user.get("ticketRecoverDate");
        result.ticket = user.get("ticket");
        console.log(result);

        response.success(result);
    });
});

Parse.Cloud.define("getGameInfo", function(request, response)
{
	console.log("getGameInfo called");
	Parse.Config.get().then(function(config)
	{
		var user = updateTicketCount();
		user.save();
		
		var result = {};
		var date = new Date();
		result.date = date.toISOString();
		result.ticketGivingMinute = g_ticketGivingMinute;
		result.maxTicket = g_maxTicket;
		console.log("getGameInfo return " + result);
		response.success(result);
		console.log("success to response getGameInfo");
	},
	function(error)
	{
		console.log("Failed to fetch. Using Cached Config.");
		response.error();
	});
});



//---------------- schedule job -------------------------------//

Parse.Cloud.job("resetWeeklyScore", function(request, status)
{
	// Set up to modify user data
	// dont call Parse.initialize to use master key
	// Parse.Cloud.useMasterKey();
	
	weekday = {};
	weekday["Sunday"] = 0;
	weekday["Monday"] = 1;
	weekday["Tuesday"] = 2;
	weekday["Wednesday"] = 3;
	weekday["Thursday"] = 4;
	weekday["Friday"] = 5;
	weekday["Saturday"] = 6;
	
	
	//this function is called every specific time
	var targetDay = "Sunday";
	var d = new Date();
	if(weekday[targetDay] != d.getDay())
	{
		status.success("today is not " + targetDay);
		return;
	}
	
	var query = new Parse.Query(Parse.User);
	query.find(
	{
		success: function(results)
		{
			for (var i = 0; i < results.length; i++)
			{
				var object = results[i];
				console.log("update user " + object.get("id"));
				object.set("highScoreWeek", 0);
				object.save();
			}
			
			status.success("week high score reset");
		},
		error: function(error)
		{
			status.error("week high score reset failed : " + error.message);
		}
	});
});
 */



