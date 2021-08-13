$('btn-need-login').hide();
$(document).ready(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }

  //document.getElementById("btnPlay").onclick = loadMySheetData;
  registerEvent();
  registerHelper();
  settingUtil.settingLoad();
});

function registerHelper() {
  Handlebars.registerHelper('eq', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
}

function registerEvent() {
  
  document.getElementById("btnSettingSave").onclick = settingUtil.settingSave;

  document.getElementById("btnAmtAdd1").onclick = () => calcUtil.calcAmtAdd(1);
  document.getElementById("btnAmtAdd2").onclick = () => calcUtil.calcAmtAdd(2);
  document.getElementById("btnAmtAdd3").onclick = () => calcUtil.calcAmtAdd(3);
  document.getElementById("btnAmtAdd4").onclick = () => calcUtil.calcAmtAdd(4);
  document.getElementById("btnAmtAdd5").onclick = () => calcUtil.calcAmtAdd(5);
  document.getElementById("btnAmtAdd6").onclick = () => calcUtil.calcAmtAdd(6);
  document.getElementById("btnAmtAdd7").onclick = () => calcUtil.calcAmtAdd(7);
  document.getElementById("btnAmtAdd8").onclick = () => calcUtil.calcAmtAdd(8);
  document.getElementById("btnAmtAdd9").onclick = () => calcUtil.calcAmtAdd(9);
  document.getElementById("btnAmtAdd0").onclick = () => calcUtil.calcAmtAdd(0);
  document.getElementById("btnAmtDel").onclick = calcUtil.calcAmtDel;
  document.getElementById("btnAmtPlus").onclick = calcUtil.calcAmtPlus;
  document.getElementById("btnAmtOk").onclick = calcUtil.calcAmtOk;

  document.getElementById("navAddSpend").onclick = navUtil.navAddSpendShow;
  document.getElementById("navSpendList").onclick = navUtil.navSpendListShow;
  document.getElementById("navSetting").onclick = navUtil.navSettingShow;
}

var navUtil = (()=>{
  var thisUtil = {};

  thisUtil.navAddSpendShow = function() {
    document.getElementById("navAddSpend").classList.add('active');
    document.getElementById("navSpendList").classList.remove('active');
    document.getElementById("navSetting").classList.remove('active');

    document.getElementById("divAddSpend").classList.remove('d-none');
    document.getElementById("divSpendList").classList.add('d-none');
    document.getElementById("divSetting").classList.add('d-none');
  };

  thisUtil.navSpendListShow = function() {
    document.getElementById("navAddSpend").classList.remove('active');
    document.getElementById("navSpendList").classList.add('active');
    document.getElementById("navSetting").classList.remove('active');

    document.getElementById("divAddSpend").classList.add('d-none');
    document.getElementById("divSpendList").classList.remove('d-none');
    document.getElementById("divSetting").classList.add('d-none');

    loadSpendList();
  };

  thisUtil.navSettingShow = function() {
    document.getElementById("navAddSpend").classList.remove('active');
    document.getElementById("navSpendList").classList.remove('active');
    document.getElementById("navSetting").classList.add('active');

    document.getElementById("divAddSpend").classList.add('d-none');
    document.getElementById("divSpendList").classList.add('d-none');
    document.getElementById("divSetting").classList.remove('d-none');
  };

  return thisUtil;
})();

var settingUtil = (()=>{
  var thisUtil = {};
  thisUtil.settingSave = function() {
    localStorage.setItem("spreadsheetId", document.getElementById('inputSpreadsheetId').value);
    localStorage.setItem("spendSheetName", document.getElementById('inputSpendSheetName').value);
    localStorage.setItem("spendSheetId", document.getElementById('inputSpendSheetId').value);

    showMsg('Save Successful');
  };

  thisUtil.settingLoad = function() {
    document.getElementById('inputSpreadsheetId').value = localStorage.getItem("spreadsheetId");
    document.getElementById('inputSpendSheetName').value = localStorage.getItem("spendSheetName");
    document.getElementById('inputSpendSheetId').value = localStorage.getItem("spendSheetId");
  };

  thisUtil.getSpreadsheetId = function() {
    return document.getElementById('inputSpreadsheetId').value;
  };

  thisUtil.getSpendSheetName = function() {
    return document.getElementById('inputSpendSheetName').value;
  };

  thisUtil.getSpendSheetId = function() {
    return document.getElementById('inputSpendSheetId').value;
  };

  return thisUtil;
})();

var calcUtil = (()=>{
  var thisUtil = {};
  thisUtil.calcAmtAdd = function(addAmt) {
    let calcAmtDom = document.getElementById('calcAmt');
    let calcAmt = calcAmtDom.innerText;
    if(calcAmt==='0') {
      calcAmtDom.innerText = addAmt;
    }
    else {
      calcAmtDom.innerText = calcAmt + addAmt;
    }
  };

  thisUtil.calcAmtDel = function() {
    let calcAmtDom = document.getElementById('calcAmt');
    let calcAmt = calcAmtDom.innerText;
    if(calcAmt.length === 1) {
      calcAmtDom.innerText = "0";
    }
    else {
      let clacAmtNew = calcAmt.substring(0, calcAmt.length-1);
      calcAmtDom.innerText = clacAmtNew;
      if(clacAmtNew.indexOf('+')===-1) {//如果刪除後沒有加號，就變回ok
        document.getElementById("btnAmtOk").innerText = "ok";
      }
    }
  };

  thisUtil.calcAmtPlus = function() {
    let calcAmtDom = document.getElementById('calcAmt');
    let calcAmt = calcAmtDom.innerText;
    if(calcAmt.calcAmt === '0') {
      return;
    }
    else {
      calcAmtDom.innerText = calcAmt + '+';
      document.getElementById("btnAmtOk").innerText = "=";
    }
  };

  thisUtil.calcAmtOk = function() {
    let btnAmtOk = document.getElementById("btnAmtOk");
    let btnAmtOkText = btnAmtOk.innerText;
    let calcAmtDom = document.getElementById('calcAmt');
    let calcAmt = calcAmtDom.innerText;
    if(btnAmtOkText === '=') {//計算模式
      let amtSum = 0;
      for(let amtEle of calcAmt.split('+')) {
        amtSum += parseInt(amtEle);
      }
      calcAmtDom.innerText = amtSum;
    }
    else {//儲存模式
      let spendData = {};
      spendData.ID = uuidv4();
      spendData.cate = document.getElementById('sepndCate').value;
      spendData.remark = document.getElementById('sepndRemark').value;
      spendData.together = document.getElementById('spendTogether').checked?"Y":"N";
      spendData.must = document.getElementById('spendMust').checked?"Y":"N";
      spendData.date = document.getElementById('spendDate').value;
      spendData.time = dateFns.format(new Date(), "HH:mm:ss");
      spendData.money = document.getElementById('calcAmt').innerText;

      if(spendData.date==='今天') {
        spendData.date = dateFns.format(new Date(), "YYYYMMDD");
      }

      console.log('spendData', JSON.stringify(spendData));

      appendSpendData([spendData]);
    }
  };

  return thisUtil;
})();

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function showMsg(msgText) {
  var msgHtml = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-body">
    ${msgText}
  </div>
</div>`;
  $('#divToastContainer').append(msgHtml);
  //var myToastEl = document.getElementById('myToastEl')
  
  var newToast = new bootstrap.Toast($('#divToastContainer .toast').last()[0]);
  newToast.show();
}

  var appendSpendData = function(spendDataArr) {
    try {
      var params = {
        // The ID of the spreadsheet to update.
        spreadsheetId: settingUtil.getSpreadsheetId(),  // TODO: Update placeholder value.
      };
  
      var requestBody = {
        "requests": []
       };
  
      for (let spendData of spendDataArr) {
        let spendDataStr = [spendData.ID, 
                            spendData.cate,
                            spendData.remark,
                            spendData.together,
                            spendData.date,  
                            spendData.money,
                            spendData.time,
                            spendData.must
                          ].join(', ');
  
        requestBody.requests.push({
          "insertRange": {
           "range": {
            "sheetId": settingUtil.getSpendSheetId(),
            "startRowIndex": 1,
            "endRowIndex": 2
           },
           "shiftDimension": "ROWS"
          }
         });
  
        requestBody.requests.push({
          "pasteData": {
           "data": spendDataStr,
           "type": "PASTE_NORMAL",
           "delimiter": ",",
           "coordinate": {
            "sheetId": settingUtil.getSpendSheetId(),
            "rowIndex": 1,
           }
          }
        });
  
        console.log(JSON.stringify(params, null, ' '))
        console.log(JSON.stringify(requestBody, null, ' '))
      }
  
      var request = gapi.client.sheets.spreadsheets.batchUpdate(params, requestBody);
        request.then(function(response) {
          // TODO: Change code below to process the `response` object:
          console.log(response.result);
        }, function(reason) {
          console.error('error: ' + reason.result.error.message);
        });
      
      showMsg('Save Successful');
    }
    catch(e) {
      $('#divErrorInfo').html(JSON.stringify(e), null, "  ");
      console.log(e);
    }
    
  };

  async function loadSpendList() {
    try {
      var spreadsheetId = settingUtil.getSpreadsheetId();
      var range = settingUtil.getSpendSheetName() + '!A2:H100';//抓前100筆
      
      var response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      }); 
  
      var sheetData = response.result.values; 
      
      var templateStr = document.getElementById("templateSpendList").innerHTML;
      var templateObj = Handlebars.compile(templateStr);
      var rendered = templateObj(sheetData);
      
      $('#divSpendList').html(rendered);

    }
    catch(e) {
      $('#divErrorInfo').html(JSON.stringify(e), null, "  ");
      console.log(e);
    }
  }
  
  function localTestData() {
    return [
      [
          "shelve",
          "The First Nome's library was like Amos's, but a hundred times bigger, with circular rooms lined with honeycomb shelves that seemed to go on forever, like the world's largest beehive.\nSome were stacked on tables or stuffed into smaller shelves.",
          "7/27/2021 0:31:54",
          "7/30/2021 9:31:36",
          "1",
          "TRUE",
          "ʃɛlv",
          "http://res.iciba.com/resource/amp3/oxford/0/f9/11/f911a38ea4d49b5f10dc3aaf02e6ce15.mp3",
          "v. If someone shelves a plan or project, they decide not to continue with it, either for a while or permanently.\nv. If an area of ground next to or under the sea shelves, it slopes downwards.\nShelves is the plural of shelf .",
          "",
          "verb, verbal use of shelve(s) 1585–95\n1580–90; origin, originally uncertain; compare Frisian skelf not quite level",
          "v. 擱置，停止執行，暫不進行(計劃、項目)\nv. (近海或海底陸地)向下傾斜,成斜坡\n(shelf 的複數)",
          "15772",
          "Link",
          "",
          "",
          "{\"word\":\"shelve\",\"results\":[{\"definition\":\"hold back to a later time\",\"partOfSpeech\":\"verb\",\"synonyms\":[\"defer\",\"hold over\",\"postpone\",\"prorogue\",\"put off\",\"put over\",\"remit\",\"set back\",\"table\"],\"entails\":[\"scratch\",\"reschedule\",\"cancel\",\"call off\",\"scrub\"],\"typeOf\":[\"delay\"],\"hasTypes\":[\"suspend\",\"hold\",\"probate\",\"reprieve\",\"respite\",\"call\"],\"derivation\":[\"shelver\"]},{\"definition\":\"place on a shelf\",\"partOfSpeech\":\"verb\",\"typeOf\":[\"pose\",\"set\",\"position\",\"place\",\"put\",\"lay\"],\"derivation\":[\"shelver\"],\"examples\":[\"shelve books\"]}],\"syllables\":{\"count\":1,\"list\":[\"shelve\"]},\"pronunciation\":{\"all\":\"ʃɛlv\"},\"frequency\":2.2}"
      ],
      [
          "flare",
          "Desjardins' nostrils flared, but the old dude, Iskandar, just chuckled, and said something else in that other language.\nSet's nostrils flared.",
          "7/27/2021 0:31:44",
          "7/31/2021 8:45:46",
          "1",
          "TRUE",
          "flɜr",
          "http://res.iciba.com/resource/amp3/0/0/95/b0/95b05fbb1aa74c04ca2e937d43a05f6f.mp3",
          "nc. A flare is a small device that produces a bright flame. Flares are used as signals, for example on ships.\nv. If a fire flares, the flames suddenly become larger.\nv. If something such as trouble, violence, or conflict flares, it starts or becomes more violent.\nv. If people's tempers flare, they get angry.\nv. If someone's nostrils flare or if they flare them, their nostrils become wider, often because the person is angry or upset.\nv. If something such as a dress flares, it spreads outwards at one end to form a wide shape.\nnpl. Flares are trousers that are very wide at the bottom.\nPHRASAL VERB If a disease or injury flares up, it suddenly returns or becomes painful again.",
          "",
          "1540–50; origin, originally meaning: spread out, said of hair, a ship's sides, etc; compare Old English flǣre either of the spreading sides at the end of the nose",
          "nc. 閃光信號燈;照明彈\nv. (火)突然燒旺，突然熊熊燃燒\nv. (麻煩、暴亂、衝突等)加劇，升級，愈演愈烈\nv. 發怒;發火\nv. (常因氣憤或難過而)張大(鼻孔),(鼻孔)張開\nv. (連衣裙等)底部展開，呈喇叭形展開\nnpl. 喇叭褲\nPHRASAL VERB (疾病、傷勢)突然復發，突然惡化",
          "8467",
          "Link",
          "",
          "",
          "{\"word\":\"flare\",\"results\":[{\"definition\":\"erupt or intensify suddenly\",\"partOfSpeech\":\"verb\",\"synonyms\":[\"break open\",\"burst out\",\"erupt\",\"flare up\",\"irrupt\"],\"typeOf\":[\"deepen\",\"intensify\"],\"examples\":[\"Tempers flared at the meeting\"]},{\"definition\":\"a short forward pass to a back who is running toward the sidelines\",\"partOfSpeech\":\"noun\",\"synonyms\":[\"flare pass\"],\"typeOf\":[\"aerial\",\"forward pass\"],\"examples\":[\"he threw a flare to the fullback who was tackled for a loss\"]},{\"definition\":\"burn brightly\",\"partOfSpeech\":\"verb\",\"synonyms\":[\"blaze up\",\"burn up\",\"flame up\"],\"typeOf\":[\"combust\",\"burn\"],\"examples\":[\"Every star seemed to flare with new intensity\"]},{\"definition\":\"a burst of light used to communicate or illuminate\",\"partOfSpeech\":\"noun\",\"synonyms\":[\"flash\"],\"typeOf\":[\"visual signal\"],\"hasTypes\":[\"very light\",\"very-light\",\"star shell\",\"bengal light\"]},{\"definition\":\"shine with a sudden light\",\"partOfSpeech\":\"verb\",\"synonyms\":[\"flame\"],\"typeOf\":[\"beam\",\"shine\"],\"examples\":[\"The night sky flared with the massive bombardment\"]},{\"definition\":\"become flared and widen, usually at one end\",\"partOfSpeech\":\"verb\",\"synonyms\":[\"flare out\"],\"typeOf\":[\"widen\"],\"examples\":[\"The bellbottom pants flare out\"]},{\"definition\":\"a shape that spreads outward\",\"partOfSpeech\":\"noun\",\"synonyms\":[\"flair\"],\"typeOf\":[\"shape\",\"form\"],\"examples\":[\"the skirt had a wide flare\"]},{\"definition\":\"a sudden eruption of intense high-energy radiation from the sun's surface; associated with sunspots and radio interference\",\"partOfSpeech\":\"noun\",\"synonyms\":[\"solar flare\"],\"typeOf\":[\"solar radiation\"]},{\"definition\":\"a device that produces a bright light for warning or illumination or identification\",\"partOfSpeech\":\"noun\",\"typeOf\":[\"device\"],\"hasTypes\":[\"fuzee\",\"fusee\"]},{\"definition\":\"am unwanted reflection in an optical system (or the fogging of an image that is caused by such a reflection)\",\"partOfSpeech\":\"noun\",\"typeOf\":[\"reflexion\",\"reflection\"]},{\"definition\":\"a sudden burst of flame\",\"partOfSpeech\":\"noun\",\"typeOf\":[\"fire\",\"flaming\",\"flame\"]},{\"definition\":\"a sudden outburst of emotion\",\"partOfSpeech\":\"noun\",\"typeOf\":[\"blowup\",\"gush\",\"outburst\",\"effusion\",\"ebullition\"],\"examples\":[\"she felt a flare of delight\",\"she could not control her flare of rage\"]},{\"definition\":\"a sudden recurrence or worsening of symptoms\",\"partOfSpeech\":\"noun\",\"typeOf\":[\"attack\"],\"examples\":[\"a colitis flare\",\"infection can cause a lupus flare\"]},{\"definition\":\"(baseball) a fly ball hit a short distance into the outfield\",\"partOfSpeech\":\"noun\",\"inCategory\":[\"baseball game\",\"ball\",\"baseball\"],\"typeOf\":[\"fly ball\",\"fly\"]},{\"definition\":\"reddening of the skin spreading outward from a focus of infection or irritation\",\"partOfSpeech\":\"noun\",\"typeOf\":[\"erythroderma\"]}],\"syllables\":{\"count\":1,\"list\":[\"flare\"]},\"pronunciation\":{\"all\":\"flɜr\"},\"frequency\":3.52}"
      ],
      [
          "soar",
          "The ceilings soared to twenty or thirty feet, so it didn't feel like we were underground.\nAt the edge of the palace, Isis turned into a small bird of prey and soared into the air.",
          "7/27/2021 0:31:34",
          "7/31/2021 8:46:20",
          "1",
          "TRUE",
          "soʊr",
          "http://res.iciba.com/resource/amp3/oxford/0/b3/61/b361cf4e96e21da6f3183e4d83084abc.mp3",
          "v. If the amount, value, level, or volume of something soars, it quickly increases by a great deal.\nv. If something such as a bird soars into the air, it goes quickly up into the air.\nv. Trees or buildings that soar upwards are very tall.\nv. If music soars, it rises greatly in volume or pitch.\nv. If your spirits soar, you suddenly start to feel very happy.",
          "",
          "Vulgar Latin *exaurāre, equivalent. to Latin ex- ex-1 + aur(a) air + -āre infinitive suffix\nMiddle French essorer\nMiddle English soren 1325–75",
          "v. (數量、價值、水平、規模等)急升，猛漲\nv. (鳥等)高飛，翱翔，升騰\nv. (樹木、建築等)高聳，屹立\nv. (音樂)音量猛地增大，音調陡然升高\nv. (情緒)高昂,高漲",
          "4707",
          "Link",
          "",
          "",
          "{\"word\":\"soar\",\"results\":[{\"definition\":\"rise rapidly\",\"partOfSpeech\":\"verb\",\"synonyms\":[\"soar up\",\"soar upwards\",\"surge\",\"zoom\"],\"typeOf\":[\"lift\",\"come up\",\"arise\",\"go up\",\"move up\",\"rise\",\"uprise\"],\"hasTypes\":[\"wallow\",\"billow\"],\"examples\":[\"the dollar soared against the yen\"]},{\"definition\":\"fly by means of a hang glider\",\"partOfSpeech\":\"verb\",\"synonyms\":[\"hang glide\"],\"entails\":[\"glide\"],\"typeOf\":[\"fly\",\"aviate\",\"pilot\"],\"derivation\":[\"soaring\"]},{\"definition\":\"fly a plane without an engine\",\"partOfSpeech\":\"verb\",\"synonyms\":[\"sailplane\"],\"inCategory\":[\"air travel\",\"aviation\",\"air\"],\"entails\":[\"fly\",\"aviate\",\"pilot\"],\"typeOf\":[\"glide\"],\"derivation\":[\"soaring\"]},{\"definition\":\"the act of rising upward into the air\",\"partOfSpeech\":\"noun\",\"synonyms\":[\"zoom\"],\"typeOf\":[\"ascending\",\"rise\",\"ascension\",\"ascent\"]},{\"definition\":\"fly upwards or high in the sky\",\"partOfSpeech\":\"verb\",\"typeOf\":[\"wing\",\"fly\"]},{\"definition\":\"go or move upward\",\"partOfSpeech\":\"verb\",\"typeOf\":[\"climb\",\"go up\",\"rise\"],\"examples\":[\"The stock market soared after the cease-fire was announced\"]}],\"syllables\":{\"count\":1,\"list\":[\"soar\"]},\"pronunciation\":{\"all\":\"soʊr\"},\"frequency\":3.15}"
      ]
  ]
  }