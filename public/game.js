var SERVER_ADDRESS = 'http://ec2-54-215-232-7.us-west-1.compute.amazonaws.com/';

var LOOP_START = 10;


var socket;
var descriptionBox;
var optionsBox;
var musicPlayer;
var currentOptions = [];

function start()
{
    descriptionBox = document.getElementById("gameDescription");
    optionsBox = document.getElementById("gameOptions");

    musicPlayer = document.getElementById('music1');
    playMusic();

    socket = io.connect(SERVER_ADDRESS);
    socket.on('newScene', function (data) {
        /* holds the components of the string: 0 = description, 1 = option 1, 2 = option2, etc*/
        var stringParts; 

        /* clear what we had before */
        clearText();

        stringParts = data[0].split("|");
        writeDescription(stringParts[0]);
        writeOptions(stringParts);
    });
}

function playMusic()
{
    /* from http://stackoverflow.com/questions/3273552/html-5-audio-looping */
    musicPlayer.addEventListener('ended', function() {
        this.currentTime = LOOP_START;
        this.play();
    }, false);
    musicPlayer.play();
}    

function toggleMusic()
{
    if (musicPlayer.paused)
    {
        musicPlayer.addEventListener('ended', function() {
            this.currentTime = LOOP_START;
            this.play();
        }, false);
        musicPlayer.play()
    }
    else
    {
        musicPlayer.pause();
    }
}

function clearText()
{
    while(descriptionBox.childNodes.length>=1)
    {
        descriptionBox.removeChild(descriptionBox.firstChild)
    } 
    while(optionsBox.childNodes.length>=1)
    {
        optionsBox.removeChild(optionsBox.firstChild)
    } 
}

function writeDescription(descriptionString)
{
    descriptionBox.appendChild(descriptionBox.ownerDocument.createTextNode(descriptionString));
    var linebreak = document.createElement('br');
    descriptionBox.appendChild(linebreak);
}

function writeOptions(stringParts)
{
    /* holds the user display text and resulting file of each option */
    var optionData;

    /* create divs with text for each option */
    for (var i=1; i<stringParts.length; i++)
    {
        /* split on ~ */
        optionData = stringParts[i].split("~");

        /* from http://stackoverflow.com/questions/19494339/creating-dynamic-div-using-javascript */
        var ele = document.createElement("div");
        ele.setAttribute("id","option"+i);
        ele.setAttribute("class","option");
        ele.innerHTML=optionData[0];
        currentOptions[i-1]=optionData[1];

        /* need to use closures for this to keep the current value of i */
        ele.onclick = (function() { 
                            var currentI = i; 
                            return function() {
                                selectOption(currentOptions[currentI-1]); 
                            }
                        })();

        /* add the finished object to the container */
        optionsBox.appendChild(ele);
    }
}

function selectOption(choice)
{
    socket.emit("newScene",[choice]);
}