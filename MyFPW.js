
//ENTER YOUR FORDPASS EMAIL, PASSWORD AND THE VIN NUMBER TO THE CAR BELOW.
//IF YOU HAVE AN IMAGE OF YOUR CAR YOU'D LIKE TO USE, MAKE A FOLDER IN ICLOUD UNDER SCRIPTABLE CALLED MyFPW, a subfolder named VehicleImages and name the photo vehicle_1.png, otherwise just comment out the lines for the photo 
const FPSettings = {
  'username': 'YOUR FORDPASS EMAIL HERE',
  'password': 'YOUR FORDPASS PASSWORD HERE',
  'vin': 'VIN HERE',
  'clientId': '9fb503e0-715b-47e8-adfd-ad4b7770f73b',
  'applicationId': '71A3AD0A-CF46-4CCF-B473-FC7FE5BC4592',
  'userAgent': 'FordPass/2 CFNetwork/1475 Darwin/23.0.0'
};

//ENTER THE NAME OF THE SHORTCUTS FOR EACH COMMAND, IF IT HAS SPACES, ENTER IT WITH THE SPACES EXACTLY, FOR EXAMPLE, 'Lock My Car'. IF YOU GET 'SHORTCUT CANNOT BE FOUND ERRORS, MAKE SURE YOUR SHORTCUT DOESN'T HAVE ANY LEADING OR TRAILING SPACES IN THE ACTUAL SHORTCUT NAME IN THE SHORTCUTS APP
const ShortcutLockName = 'NAME OF YOUR LOCK CAR SHORCUT, SPACES ARE OK';
const ShortcutUnlockName = 'Unlock My Car';
const ShortcutStartName = 'Start My Car';
const ShortcutStopName = 'Stop My Car';



const lockCommand = 'shortcuts://x-callback-url/run-shortcut?name=' + urlify(ShortcutLockName);
const unlockCommand = 'shortcuts://x-callback-url/run-shortcut?name=' + urlify(ShortcutUnlockName);
const startCommand = 'shortcuts://x-callback-url/run-shortcut?name=' + urlify(ShortcutStartName);
const stopCommand = 'shortcuts://x-callback-url/run-shortcut?name=' + urlify(ShortcutStopName);

const SPACING = 5;
const textBlack = new Color('#000000');
const textWhite = new Color('#EDEDED');

const titleFont = Font.boldRoundedSystemFont(14);
const descFont = Font.mediumRoundedSystemFont(14);
const hdrFont = Font.boldSystemFont(18);  
const autoToken = await getAutonomicToken();
const vData = await getVehicleData();

const oilLife = vData.metrics.oilLifeRemaining.value + ' %';
const fuelLevel = Math.round(vData.metrics.fuelLevel.value) + ' %';
const odometer = Math.round(vData.metrics.odometer.value * 0.621371) + ' mi.';
const doorLock = vData.metrics.doorLockStatus[0].value;
const hood = vData.metrics.hoodStatus.value;
const battery = vData.metrics.batteryVoltage.value.toFixed(1) + ' V';
const locLat = vData.metrics.position.value.location.lat;
const locLon = vData.metrics.position.value.location.lon;
const door1 = vData.metrics.doorStatus[0].vehicleDoor;
const door1stat = vData.metrics.doorStatus[0].value;
const door2 = vData.metrics.doorStatus[1].vehicleDoor;
const door2stat = vData.metrics.doorStatus[1].value;
const door3 = vData.metrics.doorStatus[2].vehicleDoor;
const door3stat = vData.metrics.doorStatus[2].value;
const door4 = vData.metrics.doorStatus[3].vehicleDoor;
const door4stat = vData.metrics.doorStatus[3].value;
const door5 = vData.metrics.doorStatus[4].vehicleDoor;
const door5stat = vData.metrics.doorStatus[4].value;
const door6 = vData.metrics.doorStatus[5].vehicleDoor;
const door6stat = vData.metrics.doorStatus[5].value;
const ignition = vData.metrics.ignitionStatus.value;
const remote = Object.keys(vData.events.remoteStartEvent.conditions)[0];
const remoteRunning = (remote != 'remoteStartEnded') ? 'On':'Off';
const running = (ignition != 'OFF') ? 'On':'Off';
const isRunning = (remoteRunning != 'Off' || running != 'Off') ? 'ON!':'Off';
const window1 = vData.metrics.windowStatus[0].vehicleWindow + ' ' + vData.metrics.windowStatus[0].vehicleSide;
const window1name = window1.replace('UNSPECIFIED_', '')
const window1stat = (vData.metrics.windowStatus[0].value.doubleRange.upperBound != 100 || vData.metrics.windowStatus[0].value.doubleRange.lowerBound != 100) ? 'Window Closed':'Window Open';
const window2 = vData.metrics.windowStatus[1].vehicleWindow + ' ' + vData.metrics.windowStatus[1].vehicleSide;
const window2name = window2.replace('UNSPECIFIED_', '')
const window2stat = (vData.metrics.windowStatus[1].value.doubleRange.upperBound != 100 || vData.metrics.windowStatus[1].value.doubleRange.lowerBound != 100) ? 'Window Closed':'Window Open';
const windowStat = (window1stat == 'Window Closed' && window2stat == 'Window Closed') ? 'All Closed':'OPEN!';
const fuelRange = Math.round(vData.metrics.fuelRange.value * 0.621371) + ' miles to empty';
const tire_fl = vData.metrics.tirePressure[0].vehicleWheel;
const tire_flp = Math.round(vData.metrics.tirePressure[0].value * 0.14503773773020923).toString();
const tire_fr = vData.metrics.tirePressure[1].vehicleWheel;
const tire_frp = Math.round(vData.metrics.tirePressure[1].value * 0.14503773773020923).toString();
const tire_rl = vData.metrics.tirePressure[2].vehicleWheel;
const tire_rlp = Math.round(vData.metrics.tirePressure[2].value * 0.14503773773020923).toString();
const tire_rr = vData.metrics.tirePressure[3].vehicleWheel;
const tire_rrp = Math.round(vData.metrics.tirePressure[3].value * 0.14503773773020923).toString();
const vAddress = await GetAddress();
const addSymbol = (root, name) => {
  const sfs = SFSymbol.named(name)
  sfs.applyFont(
    //Font.thinMonospacedSystemFont(18)
		Font.boldRoundedSystemFont(14)
  )
  const image = root.addImage(sfs.image)
  image.imageSize = new Size(20, 20)
  image.tintColor = Color.white()
};
const addLargeSymbol = (root, name) => {
  const sfs = SFSymbol.named(name)
  sfs.applyFont(
    //Font.thinMonospacedSystemFont(18)
		Font.mediumRoundedSystemFont(36)
  )
  const image = root.addImage(sfs.image)
  image.imageSize = new Size(50, 50)
  image.tintColor = Color.white()
}

const addDescText = (root, name) => {
  const txt = root.addText(name)
  txt.font = Font.mediumRoundedSystemFont(14)
  txt.textColor = textWhite;
}

const addTitleText = (root, name) => {
  const txt = root.addText(name)
  txt.font = Font.boldRoundedSystemFont(14)
  txt.textColor = textWhite;
}

const wid = await CreateWidget();

Script.setWidget(wid);

    
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


async function getVehicleCommand(commandIs) {
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
  return fm.joinPath(p2, imageName + '.png')
}

async function GetAddress() {
  let token = 'pk.d99c8395cd483355c647bf77f4d2b8af';
  url = 'https://us1.locationiq.com/v1/reverse.php?key=';
  url = url + token;
  url = url + '&lat=' + locLat;
  url = url + '&lon=' + locLon;
  url = url + '&zoom=18';
  url = url + '&format=json';
  let req = new Request(url);
  req.method = 'GET';
  req.headers = {'accept': 'application/json'};
  const resp =   await req.loadJSON();
  const addr = resp.address;
  //console.log('resp: ' + resp)
  //console.log('addr: ' + addr)
  if ('house_number' in addr)
  	fAddr = addr.house_number + ' ' + addr.road + ', ' + addr.city
  else
  	fAddr = addr.road + ', ' + addr.city
  return fAddr.toString();
}

async function CreateWidget() {
  const widget = new ListWidget()
  let image = Image.fromFile(getVehicleImageFilePath());
  image.imageSize = new Size(15,15);
  
  //set gradient background
	let endColorDark = new Color("#141414");
	let startColorDark = new Color("#13235F");
	let endColorLight = new Color("#DDDDDD");
	let startColorLight = new Color("#BCBBBB")
	let gradient = new LinearGradient();
  let total = 100;
  let havegone = 50;
	gradient.colors = [startColorDark, endColorDark];
	gradient.locations = [0.0, 1];
  widget.backgroundGradient = gradient;
  const main = addCenteredStack(widget);
	main.layoutVertically();
  
	const s1 = addCenteredStack(main);
	s1.layoutHorizontally();
	const s2 = addCenteredStack(main);
	s2.layoutVertically();
  const s3 = addCenteredStack(main);
	s3.layoutHorizontally();
	const s4 = addCenteredStack(main);
	s4.layoutVertically();
  const s5 = addCenteredStack5(main);
  s5.layoutHorizontally();

	const s1g1 = s1.addStack();
	s1g1.layoutVertically();
	const s1g2 = s1.addStack();
	s1g2.layoutVertically();

	const s3g1 = addCenteredStack(s3);
	s3g1.layoutVertically();
	const s3g2 = addCenteredStack(s3);
	s3g2.layoutVertically();
	const s3g3 = addCenteredStack(s3);
	s3g3.layoutVertically();

	let s1c1r1 = s1g1.addStack();
	s1c1r1.layoutHorizontally();
	let s1c1r2 = s1g1.addStack();
	s1c1r2.layoutHorizontally();
	let s1c1r3 = s1g1.addStack();
	s1c1r3.layoutHorizontally();

  s1g2.addImage(image);

	let s2c1r1 = s2.addStack();
	let s2c1r2 = s2.addStack();

	let s3c1r1 = addCenteredStacks3(s3g1);
	let s3c1r2 = addCenteredStacks3(s3g1);
  //s3g1.addSpacer(SPACING);
	let s3c1r4 = addCenteredStacks3(s3g1);
	let s3c1r5 = addCenteredStacks3(s3g1);	

  //s3g2.addSpacer(SPACING+6);
  let s3c2r1 = addCenteredStacks3(s3g2);
	let s3c2r2 = addCenteredStacks3(s3g2);
	let s3c2r3 = addCenteredStacks3(s3g2);
	s3c2r3.layoutHorizontally();
	let s3c2r4 = addCenteredStacks3(s3g2);
	s3c2r4.layoutHorizontally();	

	let s3c3r1 = addCenteredStacks3(s3g3);
	let s3c3r2 = addCenteredStacks3(s3g3);
  //s3g3.addSpacer(SPACING);
	let s3c3r4 = addCenteredStacks3(s3g3);
	let s3c3r5 = addCenteredStacks3(s3g3);
   //s4.addSpacer(SPACING+SPACING);
	let s4c1r1 = s4.addStack();
  s4c1r1.layoutHorizontally();
	let s4c1r2 = s4.addStack();
  //s4.addSpacer(SPACING+SPACING);
		

	let s1c1r1t = s1c1r1.addText("Mandi's Car");
	s1c1r1t.font = hdrFont;
	s1c1r1t.textColor = textWhite;

	let s1c1r2t1 = addSymbol(s1c1r2, 'minus.plus.batteryblock');
	let s1c1r2t2 = addCenterSmallTitle(s1c1r2, 'Battery:');
	let s1c1r2t3 = addCenterSmallDesc(s1c1r2, battery);
s1c1r2t3.rightAlignText(); 
  
	let s1c1r3t1 = addSymbol(s1c1r3, 'oilcan.fill');
	let s1c1r3t2 = addCenterSmallTitle(s1c1r3, 'Oil Life:');
	let s1c1r3t3 = addCenterSmallDesc(s1c1r3, oilLife);
  	s1c1r3t3.rightAlignText();
  //s1c1r2.addSpacer(SPACING+SPACING);
  s2c1r1.addSpacer();
  let s2c1r1i = addSymbol(s2c1r1, 'fuelpump');
	let s2c1r1t = addTitleText(s2c1r1, ' ' + fuelLevel);
  s2c1r1.addSpacer();
  s2c1r2.addSpacer();
  let s2c1r2t = addCenterDescText(s2c1r2, fuelRange);
  s2c1r2.addSpacer();
  //s2.addSpacer(SPACING);
	let s3c1r1t1 = addSymbol(s3c1r1, 'key.fill');
	let s3c1r1t2 = addCenterSmallTitle(s3c1r1, 'Locks');
	let s3c1r2t = addCenterDescText(s3c1r2, doorLock);
  	
	let s3c1r4t1 = addSymbol(s3c1r4, 'suv.side.arrowtriangle.up.fill');
	let s3c1r4t2 = addCenterSmallTitle(s3c1r4, 'Doors');
	let s3c1r5t = addCenterDescText(s3c1r5, door1stat);
  
  //let s3c2r1t = s3c2r1.addText(' ');
  let s3c2r3i1 = s3c2r2.addText(' ');
  let s3c2r3i = addSymbol(s3c2r2, 'tirepressure');
	let s3c2r2t1 = addCenterSmallTitle(s3c2r2, 'Tires');
	let s3c2r3t1 = addCenterDescText(s3c2r3, tire_flp + ' | ' + tire_frp);
	let s3c2r4t1 = addCenterDescText(s3c2r4, tire_rlp + ' | ' + tire_rrp);

	let s3c3r1t1 = addSymbol(s3c3r1, 'key.horizontal.fill');
	let s3c3r1t2 = addCenterSmallTitle(s3c3r1, 'Ignition');
  //s3c3r2.addSpacer(SPACING);
	let s3c3r2t = addCenterDescText(s3c3r2, isRunning);

	//let s3c3r4t1 = addSymbol(s3c3r4, 'arrowtriangle.up.arrowtriangle.down.window.left');
  let s3c3r4t1 = addSymbol(s3c3r4, 'gauge.with.dots.needle.bottom.50percent');
	let s3c3r4t2 = addCenterSmallTitle(s3c3r4, 'Odometer');
	let s3c3r5t = addCenterDescText(s3c3r5, odometer);
  
  
  s4c1r1.addSpacer();
  let s4c1r1i = addSymbol(s4c1r1, 'map');
	let s4c1r1t = addTitleText(s4c1r1, ' Location');
  s4c1r1.addSpacer();
  s4c1r2.addSpacer();
	let s4c1r2t = addDescText(s4c1r2, vAddress);
  s4c1r2.addSpacer();
	
  let s5c1 = addCenteredStack(s5);
  s5c1.layoutVertically();
	let s5c2 = addCenteredStack(s5);
  s5c2.layoutVertically();
	let s5c3 = addCenteredStack(s5);
  s5c3.layoutVertically();
	let s5c4 = addCenteredStack(s5);
  s5c4.layoutVertically();
  let s5c1r1 = addCenteredStack5(s5c1);
  let s5c1r2 = addCenteredStack5(s5c1);
  let s5c2r1 = addCenteredStack5(s5c2);
  let s5c2r2 = addCenteredStack5(s5c2);
  let s5c3r1 = addCenteredStack5(s5c3);
  let s5c3r2 = addCenteredStack5(s5c3);
  let s5c4r1 = addCenteredStack5(s5c4);
  let s5c4r2 = addCenteredStack5(s5c4);
	let s5c1r1t = addLargeSymbol(s5c1r1, 'suv.side.lock');
  let s5c1r2t = addTinyText(s5c1r2, 'Lock');
	let s5c2r1t = addLargeSymbol(s5c2r1, 'suv.side.lock.open');
  let s5c2r2t = addTinyText(s5c2r2, 'Unlock');
	let s5c3r1t = addLargeSymbol(s5c3r1, 'suv.side.and.exclamationmark.fill');
  let s5c3r2t = addTinyText(s5c3r2, 'Start');
	let s5c4r1t = addLargeSymbol(s5c4r1, 'suv.side.and.exclamationmark');
  let s5c4r2t = addTinyText(s5c4r2, 'Stop');
  s5c1r1.url = lockCommand;
  s5c2r1.url = unlockCommand;
  s5c3r1.url = startCommand;
  s5c4r1.url = stopCommand;
  widget.addSpacer();
  console.log(config.runsInApp)
  console.log(config.runsInWidget)
  if (config.runsInApp)
  	return widget.presentLarge()
  else if (config.runsInWidget)
  	return widget
  
}

function createProgress(total,havegone){
  const width = 125
  const h = 5
	const context = new DrawContext()
	context.size = new Size(width, h)
	context.opaque=false
	context.respectScreenScale=true
	context.setFillColor(new Color("#48484b"))
	const path = new Path()
	path.addRoundedRect(new Rect(0, 0, width, h), 3, 2)
	context.addPath(path)
	context.fillPath()
	context.setFillColor(new Color("#ffd60a"))
	const path1 = new Path()
	path1.addRoundedRect(new Rect(0, 0, width*havegone/total, h), 3, 2)
	context.addPath(path1)
	context.fillPath()
	return context.getImage()
}

function borderize(stack) {
  stack.borderColor = Color.cyan()
  stack.borderWidth = 1
  return stack;
}

function addFlexText(root, text) {
  const s = root.addStack();
  s.addSpacer();
  const t = s.addText(text);
  t.font = Font.regularSystemFont(10);
  t.centerAlignText();
  return t
}

function addTinyText(root, text) {
  //const s = root.addStack();
  root.layoutHorizontally();
  root.addSpacer();
  const t = root.addText(text);
  t.font = Font.mediumRoundedSystemFont(10);
  t.textColor = textWhite;
  root.addSpacer();
  return t
}

function addCenterDescText(root, text) {
  //const s = root.addStack();
  //s.layoutHorizontally();
  root.addSpacer();
  const t = root.addText(text);
  t.font = Font.mediumRoundedSystemFont(14);
  t.textColor = textWhite;
  root.addSpacer();
  return t
}

function addCenterTitleText(root, text) {
  const s = root.addStack();
  s.layoutHorizontally();
  root.addSpacer();
  const t = root.addText(text);
  t.font = Font.boldRoundedSystemFont(14);
  t.textColor = textWhite;
  root.addSpacer();
  return t
}

	function addCenterSmallTitle(root, text) {
    root.addSpacer(1);
  const t = root.addText(' ' + text);
  t.font = Font.boldRoundedSystemFont(14);
  t.textColor = textWhite;
  root.addSpacer();
  return t
  }
  
  function addCenterSmallDesc(root, text) {
    root.addSpacer(1);
  const t = root.addText(text);
  t.font = Font.mediumRoundedSystemFont(14);
  t.textColor = textWhite;
  root.addSpacer();
  return t
  }

function addCenteredStack(root) {
  const ver = root.addStack()
  ver.layoutVertically()
  //ver.addSpacer()
  const hor = ver.addStack()
  hor.addSpacer()
  const result = hor.addStack();
  hor.addSpacer()
  //ver.addSpacer()
  return hor;
}

function addCenteredStack5(root) {
  const ver = root.addStack()
  ver.layoutVertically()
  //ver.addSpacer()
  const hor = ver.addStack()
  hor.addSpacer()
  const result = hor.addStack();
  hor.addSpacer()
  //ver.addSpacer()
  return result;
}

function addCenteredStacks3(root) {
  const ver = root.addStack()
  ver.layoutVertically()
  //ver.addSpacer()
  const hor = ver.addStack()
  hor.addSpacer(1)
  const result = hor.addStack();
  hor.addSpacer(1)
  ver.addSpacer(1)
  return result;
}

function flexStack(wrapper, title, desc) {
  const rootBox = borderize(wrapper.addStack())
  rootBox.backgroundColor = Color.red()
  rootBox.layoutVertically();
  const cen = addCenteredStack(rootBox);
  const titleStackRoot = borderize(rootBox.addStack())
  titleStackRoot.addSpacer();
  const titleStack = titleStackRoot.addStack();
  titleStack.layoutVertically()
  
  const t1 = addCenterText(titleStack, desc)
  
  return {
    main: cen,
    title1: t1,
  };
}

// Using Recursive Function
function urlify(str) {
    if (str.length === 0) {
        return '';
    }
    if (str[0] === ' ') {
        return '%20' + urlify(str.slice(1));
    }
    return str[0] + urlify(str.slice(1));
}
