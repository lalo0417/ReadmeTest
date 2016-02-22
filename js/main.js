//MyWidget Script
/**************************
Add a link for a CSS file that styles .mywidget
Add a script tag that points to CDN version of jQuery 1.*
Add a script tag that loads your script file from http://m.edumedia.ca/
**************************/
var scriptsLoaded = 0;


document.addEventListener("DOMContentLoaded", init());

function init()
{
  var css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("href", "css/main.css");	
  //loads the CSS file and applies it to the page
  css.addEventListener("load", loadCount);
  document.querySelector("head").appendChild(css);

  var jq = document.createElement("script");
  jq.addEventListener("load", loadCount);
  jq.setAttribute("src","http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
  document.querySelector("head").appendChild(jq);
}

function buildWidget(cls){
    console.log(cls)
    $.get('https://api.forecast.io/forecast/7df76a051dec8422cbabe4c8d7c0f8d6/45.348391,-75.757045?units=ca&exclude=summary,currently,minutely,daily,ozone,flags,pressure', onSuccess, "jsonp");
}

function loadCount(){
  scriptsLoaded++;
    if(scriptsLoaded === 2){
      //call the function in My widget script to load the JSON and build the widget
      buildWidget(".mywidget");
      console.log("both scripts loaded");
    }
}

function onSuccess(data){
    console.log(data); 
    useData(data);
}

function useData(data){
    
    var today = new Date(1000*data.hourly.data[0].time);
    var currentTemp = data.hourly.data[0].temperature;
    var currentIcon = data.hourly.data[0].icon;
    
    $weather = $('.weather-forecast');
    
    var daysArray = ["Sunday"];
    //these 2 variables get the numerical value for the day and month (ie: 11/09)
    var numDay = today.getDate(); 
    var numMonth = today.getMonth() +1;
    var todayIcon = getIcon(data.hourly.data[0].icon);
    
    
    $(".mywidget").append("<h4 id='today'>Current conditions for today, "  + numDay + "/" + numMonth );
    $(".mywidget").append("<h4 class='todaysIcon' id='today'> <i class='wi "+todayIcon+"'></i>");
    $(".mywidget").append("<h4 id='today'>Temperature "  + currentTemp + "°C" );
    
    $(".mywidget").append("<table>");
    
    
    for (var i = 0; i < 24; i++)
    {
        var time = new Date(1000*data.hourly.data[i].time);
        

            var x = getIcon(data.hourly.data[i].icon);
            
            var y = $("<tr>");
            y.append("<td>" + Math.floor(time.getHours()) + ":00");
            y.append("<td>" + Math.floor(data.hourly.data[i].humidity*100)+ "%"); 
            y.append("<td>" + Math.floor(data.hourly.data[i].cloudCover*100) + "%"); 
            y.append("<td>" + Math.floor(data.hourly.data[i].temperature) + "°C"); 
            y.append("<td>" + Math.floor(data.hourly.data[i].windSpeed) + "km/h");
            y.append("<td>" + "<i class='wi "+x+"'></i>"); 
            y.append("<td>" + data.hourly.data[i].summary);
            $("table").append(y);
        
        if (time.getHours() === 23)
        {   
            break;
        }
    }
    $(".mywidget").append("</table>");
    
    cssChanges();
}

function cssChanges()
{
    $(".mywidget .todaysIcon").css("font-size","5em");
    $(".mywidget #today").css("text-align","center");
    $(".mywidget #today").css("padding","10px 10px 10px 10px");
    $(".mywidget #today").css("color","#B8CC94");
    
    $("h1").css("text-align","center");
    $("h1").css("color","#8F9E73");
    
    $(".mywidget table tr:nth-child( odd )").css("background-color", "#E6FFB9");
    $(".mywidget table tr td").css("padding","10px 20px 10px 20px");
    $(".mywidget table").css("margin","0 auto");
    $(".mywidget table").css("color","#8F9E73");
}

function getIcon(icon)
{
    var weatherIcon = {
        "clear-day":"wi-forecast-io-clear-day",
        "partly-cloudy-day":"wi-forecast-io-partly-cloudy-day",
        "clear-night":"wi-forecast-io-clear-night",
        "partly-cloudy-night":"wi-forecast-io-partly-cloudy-night",
        "fog":"wi-forecast-io-fog",
        "rain":"wi-forecast-io-rain",
        "sleet":"wi-forecast-io-sleet",
        "hail":"wi-forecast-io-hail",
        "wind":"wi-forecast-io-wind",
        "snow":"wi-forecast-io-snow",
        "thunderstorm":"wi-forecast-io-thunderstorm",
        "tornado":"wi-forecast-io-tornado"
    }
    return weatherIcon[icon];
}