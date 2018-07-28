// module.exports = function apiCategoryDecider(taskStr){

const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('ULL5QV-HEQ3H8K997');

const argvInput = process.argv[2];
const strArray = [" Book", " Movie", " Restaurant"];

const resultsObj = {};

const keywordObj = {
                      book       : ["word"] //"text", "book", "novel", "readability"],
                      // movie      : ["academyaward", "movie", "television"],
                      // restaurant : ["food", "restaurant"],
                   }



function wolframAPICall(strInput) {
    waApi.getFull({
    input: strInput,
    format: 'plaintext',
  }).then((queryresult) => {
      return queryresult;
  }).catch(console.error)
};

function compareWordCounter ((wolframAPICall(strInput)), compareWord){
  let intMatches = JSON.stringify(queryresult).replace(/\s/g, '').toLowerCase().split(compareWord.toLowerCase()).length - 1;
  console.log("intMatches: ", intMatches + " strInput: ", strInput);
  return intMatches;
};

for (let i = 0; i < strArray.length; i++){
  strInput = argvInput + strArray[i];
  for (keywordCategory in keywordObj){

    console.log("keywordObj: ", keywordObj);
    let keywordCount = 0;

    for (let j = 0; j < keywordObj[keywordCategory].length; j++){
      console.log("keywordCount: ", keywordCount);
      console.log("keywordObj[keywordCategory].length: ", keywordObj[keywordCategory].length);

        keywordCount = keywordCount + wolframAPICall(strInput, keywordObj[keywordCategory][j]);



        console.log("keywordObj[keywordCategory][j]: ", keywordObj[keywordCategory][j]);
    }
    resultsObj[keywordCategory] = { keywordCount };

  }
};

console.log(resultsObj);

