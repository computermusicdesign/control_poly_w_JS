autowatch = 1;

/*******************************************************
Poly control
March 19, 2017
Ian Hattwick
computermusicdesign.com
Main post describing this file:
http://www.computermusicdesign.com/controlling-poly-parameters-using-dict-and-javascript/

v2 is an archive

This js file allows you to use a single set of parameter controls to set values for
multiple poly~ instances individually. 

Things you need to set manually:
-the name of the dict you want to use
-the name of all of the parameters you want to control

functions:
instance(number of instance) - sets the number of the poly~ instance you want to control
setValue(name of parameter, value) - set a parameter value for the current instance,
	both in the dict and in the poly~ subpatch
getValue(name of parameter) - retrieve the value of the parameter from the dict

*******************************************************/

//First, set the name of the dict you are going to use here:
var curDict = new Dict("poly_parameters");

//initial voice to control
var voice = "/voice/1";

//the names of all of our synth parameters
var param_names = [
	"/pitch/center", 
	"/pitch/lfo/rate", 
	"/pitch/lfo/depth", 
	"/filter/freq", 
	"/filter/resonance", 
	"/filter/lfo/rate", 
	"/filter/lfo/depth", 
	"/env/attack", 
	"/env/gain", 
	"/env/decay"
	];

/****************************************
*SETTERS AND GETTERS
*
* get and set parameter values from the dict
****************************************/
function setValue(name, val){
	//set value in dict
	var address = voice.concat("::");
	address = address.concat(name);
	curDict.set(address, val);
	
	sendOSCmessage(name, val);
	//debug("set",address,val);
} 

function getValue(name){
	//get value from dict
	var address = voice.concat("::");
	address = address.concat(name);
	var val = curDict.get(address);
	
	//debug("get",address,val);
	return val;
}

function sendOSCmessage(name, val){
	//send value to poly
	var address = voice.concat(name);
	messnamed("polyOSCmsgs", address, val);
}

/****************************************
*instance
*
* set the number of the current instance, 
* retrieves the parameter values for that instance,
* and uses those value to update UI to reflect current settings
****************************************/
function instance(name){
	var newVoice = "/voice/";
	voice = newVoice.concat(name);
	//debug("voice",voice,name);
	
	for(var i = 0; i < param_names.length; i++){
		//retrieve the current value of this register
		val = getValue(param_names[i]);

		//sets the number box with the scripting name of the current parameter
		this.patcher.getnamed(param_names[i]).message('set',val); 
		//update the dict with the current 
		sendOSCmessage(param_names[i], val);
	}
}

//simple function for debugging to Max console
function debug(name, val1, val2){
	post(name, val1, val2);
	post();	
}