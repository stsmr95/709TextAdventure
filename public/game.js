var SERVER_ADDRESS = 'http://ec2-54-215-232-7.us-west-1.compute.amazonaws.com/';

var socket;
var descriptionBox;
var optionsBox;

function start()
{
    descriptionBox = document.getElementById("gameDescription");
    optionsBox = document.getElementById("gameOptions");

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
    descriptionBox.appendChild(descriptionBreak);
}

function writeOptions(stringParts)
{
    var optionData;
    for (var i=1; i<stringParts.length; i++)
    {
        optionData = stringParts[i].split("~");

        /* from http://stackoverflow.com/questions/19494339/creating-dynamic-div-using-javascript */
        var ele = document.createElement("div");
        ele.setAttribute("id","option"+i);
        ele.setAttribute("class","inner");
        ele.innerHTML=optionData[0];
        ele.setAttribute("onClick","selectOption("+optionData[1]+")");
        optionsBox.appendChild(ele);
    }
}

function selectionOption(choice)
{
    socket.emit("newScene",[choice]);
}