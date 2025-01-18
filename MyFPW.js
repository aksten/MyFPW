const FPSettings = {
  'username': 'amandakay10@me.com',
  'password': 'Benjamin@0310',
  'vin': '1FM5K7FW0MNA14120',
  'clientId': '9fb503e0-715b-47e8-adfd-ad4b7770f73b',
  'applicationId': '71A3AD0A-CF46-4CCF-B473-FC7FE5BC4592',
  'userAgent': 'FordPass/2 CFNetwork/1475 Darwin/23.0.0'
};
const textBlack = new Color('#000000');
const textWhite = new Color('#EDEDED');

const titleFont = Font.boldRoundedSystemFont(18);
const descFont = Font.mediumRoundedSystemFont(18);
  
const autoToken = await getAutonomicToken();
const vData = await getVehicleData();

let oilLife = vData.metrics.oilLifeRemaining.value + ' %';
let fuelLevel = Math.round(vData.metrics.fuelLevel.value) + ' %';
let odometer = Math.round(vData.metrics.odometer.value * 0.621371) + ' mi.';
let doorLock = vData.metrics.doorLockStatus[0].value;
let hood = vData.metrics.hoodStatus.value;
let battery = vData.metrics.batteryVoltage.value.toFixed(1) + ' V';
let locLat = vData.metrics.position.value.location.lat + ' LAT';
let locLon = vData.metrics.position.value.location.lon + ' LON';
let door1 = vData.metrics.doorStatus[0].vehicleDoor;
let door1stat = vData.metrics.doorStatus[0].value;
let door2 = vData.metrics.doorStatus[1].vehicleDoor;
let door2stat = vData.metrics.doorStatus[1].value;
let door3 = vData.metrics.doorStatus[2].vehicleDoor;
let door3stat = vData.metrics.doorStatus[2].value;
let door4 = vData.metrics.doorStatus[3].vehicleDoor;
let door4stat = vData.metrics.doorStatus[3].value;
let door5 = vData.metrics.doorStatus[4].vehicleDoor;
let door5stat = vData.metrics.doorStatus[4].value;
let door6 = vData.metrics.doorStatus[5].vehicleDoor;
let door6stat = vData.metrics.doorStatus[5].value;
let ignition = vData.metrics.ignitionStatus.value;
let remote = Object.keys(vData.events.remoteStartEvent.conditions)[0];
let remoteRunning = (remote != 'remoteStartEnded') ? 'On':'Off';
let running = (ignition != 'OFF') ? 'On':'Off';
let isRunning = (remoteRunning != 'Off' || running != 'Off') ? 'Running':'Not Running';
let window1 = vData.metrics.windowStatus[0].vehicleWindow + ' ' + vData.metrics.windowStatus[0].vehicleSide;
let window1name = window1.replace('UNSPECIFIED_', '')
let window1stat = (vData.metrics.windowStatus[0].value.doubleRange.upperBound != 100 || vData.metrics.windowStatus[0].value.doubleRange.lowerBound != 100) ? 'Window Closed':'Window Open';
let window2 = vData.metrics.windowStatus[1].vehicleWindow + ' ' + vData.metrics.windowStatus[1].vehicleSide;
let window2name = window2.replace('UNSPECIFIED_', '')
let window2stat = (vData.metrics.windowStatus[1].value.doubleRange.upperBound != 100 || vData.metrics.windowStatus[1].value.doubleRange.lowerBound != 100) ? 'Window Closed':'Window Open';
let fuelRange = Math.round(vData.metrics.fuelRange.value * 0.621371) + ' mi.';
let tire1_fl = vData.metrics.tirePressure[0].vehicleWheel;
let tire1_flp = Math.round(vData.metrics.tirePressure[0].value * 0.14503773773020923).toString();
let tire2_fr = vData.metrics.tirePressure[1].vehicleWheel;
let tire2_frp = Math.round(vData.metrics.tirePressure[1].value * 0.14503773773020923).toString();
let tire3_rl = vData.metrics.tirePressure[2].vehicleWheel;
let tire3_rlp = Math.round(vData.metrics.tirePressure[2].value * 0.14503773773020923).toString();
let tire4_rr = vData.metrics.tirePressure[3].vehicleWheel;
let tire4_rrp = Math.round(vData.metrics.tirePressure[3].value * 0.14503773773020923).toString();

const widgetss = await CreateWidget();
Script.setWidget(widgetss);
Script.complete();

async function getAutonomicToken() {
 let fpToken = await getFordPassToken();
	let req = new Request('https://accounts.autonomic.ai/v1/auth/oidc/token');
  req.method = 'POST';
  req.headers = {
    'Accept': '*/*',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const params = {
  subject_token: fpToken,
  subject_issuer: 'fordpass',
  client_id: 'fordpass-prod',
  grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
  subject_token_type: 'urn:ietf:params:oauth:token-type:jwt'
};
const paramsArray = [];
for (key in params) {
  paramsArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
}
  req.body = paramsArray.join("&");
  const data = await req.loadJSON();
  return data.access_token
  //console.log(data.access_token);
}

async function getFordPassToken() {
		let req = new Request('https://shortcuts.henrylink.app/auth');
    req.method = 'POST';
    req.headers = {
            'Accept': '*/*',
            'Accept-Language': 'en-US',
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
        };
    req.body = JSON.stringify(FPSettings);
    const data = await req.loadJSON();
    return data.access_token;
    //console.log(data.access_token);
}

async function ExecuteCommand(commandIs) {
  if(!commandIs == 'status')
  getVehicleCommand()
  else
  getVehicleData()
}

async function getVehicleStatus() {
  let vin = FPSettings.vin;
  let token = await getAutonomicToken();
  let url = 'https://api.autonomic.ai/v1/command/vehicles/' + vin + '/commands';
  let req = new Request(url);
  req.method = 'GET';
  req.headers = {
    'auth-token': token,
    'Accept': '*/*',
    'Accept-Language': 'en-US',
    'Content-Type': 'application/json',
    'User-Agent': 'fordpass-na/353 CFNetwork/1121.2.2 Darwin/19.3.0',
    'Accept-Encoding': 'gzip, deflate, br',
    'Application-Id': FPSettings.applicationId
  }
  try {
    await req.loadJSON();
    const resp = req.response;
    console.log(resp);
    return resp;
  } catch (err) {
    console.log('getVehicleStatus Error: ' + err.message);
  }
}

async function getVehicleData(jsonPath) {
  let url = 'https://api.autonomic.ai/v1beta/telemetry/sources/fordpass/vehicles/' + FPSettings.vin;
  //console.log('getVehicleData.url: ' + url);
  //console.log('userAgent: ' + FPSettings.userAgent);
  //console.log('appId: ' + FPSettings.applicationId);
  let req = new Request(url);
  req.method = 'GET';
  req.headers = {
    'Accept': '*/*',
    'Accept-Language': 'en-US',
    'User-Agent': FPSettings.userAgent,
    'Accept-Encoding': 'gzip, deflate, br',
    'Application-Id': FPSettings.applicationId,
    'authorization': 'Bearer ' + autoToken
  };
  try {
    //await req.loadJSON();
    const resp = await req.loadJSON();
    return resp;
    
  } catch (err) {
    console.log('getVehicleData Error: ' + err.message);
  }
}


async function getVehicleCommand() {
  let vin = FPSettings.vin;
  let url = 'https://api.autonomic.ai/v1beta/command/vehicles/' + vin + '/commands';
  let req = new Request(url);
  req.method = 'POST';
  req.headers = {
    'Accept': '*/*',
    'Accept-Language': 'en-US',
    'User=Agent': this.FPSettings.userAgent,
    'Accept-Encoding': 'gzip, deflate, br',
    'Application-Id': this.FPSettings.applicationId,
    'authorization': 'Bearer ' + autoToken,
    'Content-Type': 'application/json'
  };
  req.body = JSON.stringify({'type':commandIs,'wakeUp':'True'});
  const data = await req.loadJSON();
    return data;
}

function CreateWidget() {
  let widget = new ListWidget();
  let image = Image.fromFile(getVehicleImageFilePath());
  let batteryIcon = Image.fromFile(getIconFilePath('Battery.png'));
  //set gradient background
let endColorDark = new Color("141414");
let startColorDark = new Color("13235F");
let endColorLight = new Color("DDDDDD");
let startColorLight = new Color("BCBBBB")
let gradient = new LinearGradient();
gradient.colors = [startColorDark, endColorDark];
gradient.locations = [0.0, 1];
widget.backgroundGradient = gradient;
  //widget.backgroundColor = Color.blue();
  
  let c1r1 = widget.addStack();
  c1r1.layoutVertically();
  c1r1.addImage(image);
  
  let c2 = widget.addStack();
  c2.layoutVertically();
  let c2r1 = c2.addStack();
  c2r1.layoutHorizontally();
  
  let title1 = c2r1.addText('Fuel Level');
  title1.font = titleFont;
  title1.textColor = textWhite;
  c2r1.addSpacer();
  let c3r1 = c2r1.addStack();
  c3r1.layoutVertically();
  let desc1 = c3r1.addText(fuelLevel);
  desc1.font = descFont;
  desc1.textColor = Color.white();
  
  let c2r2 = c2.addStack();
  c2r2.layoutHorizontally();
  let title2 = c2r2.addText('Fuel Range');
  title2.font = titleFont;
  title2.textColor = textWhite;
  c2r2.addSpacer();
  let c3r2 = c2r2.addStack();
  c3r2.layoutVertically();
  let desc2 = c3r2.addText(fuelRange);
  desc2.font = descFont;
  desc2.textColor = textWhite;
  
  let c2r3 = c2.addStack();
  c2r3.layoutHorizontally();
  let title3 = c2r3.addText('Odometer');
  title3.font = titleFont;
  title3.textColor = textWhite;
  c2r3.addSpacer();
  let c3r3 = c2r3.addStack();
  c3r3.layoutVertically();
  let desc3 = c3r3.addText(odometer);
  desc3.font = descFont;
  desc3.textColor = textWhite;
  
  let c2r4 = c2.addStack();
  c2r4.layoutHorizontally();
  let title4 = c2r4.addText('Miles To Empty');
  title4.font = titleFont;
  title4.textColor = textWhite;
  c2r4.addSpacer();
  let c3r4 = c2r4.addStack();
  c3r4.layoutVertically();
  let desc4 = c3r4.addText(fuelRange);
  desc4.font = descFont;
  desc4.textColor = textWhite;
  
  let c2r5 = c2.addStack();
  c2r5.layoutHorizontally();
  let title5 = c2r5.addText('Doors Locked?')
  title5.font = titleFont;
  title5.textColor = textWhite;
  c2r5.addSpacer();
  let c3r5 = c2r5.addStack();
  c3r5.layoutVertically();
  let desc5 = (doorLock == "LOCKED") ? c3r5.addText('Yes'):c3r5.addtext('No');
  desc5.font = descFont;
  desc5.textColor = textWhite;
  
  
  if (config.runsInApp)
  	return widget.presentLarge()
  else if (config.runsInWidget)
  	return widget
}

function getVehicleImageFilePath() {
  let fm = FileManager.iCloud()
  let dir = fm.documentsDirectory()
  let p1 = fm.joinPath(dir, 'MyFPW')
  let p2 = fm.joinPath(p1, 'VehicleImages')
  return fm.joinPath(p2, 'vehicle_1.png')
}

function getIconFilePath(imageName) {
  let fm = FileManager.iCloud()
  let dir = fm.documentsDirectory()
  let p1 = fm.joinPath(dir, 'MyFPW')
  let p2 = fm.joinPath(p1, 'Icons')
  return fm.joinPath(p2, imageName)
}
